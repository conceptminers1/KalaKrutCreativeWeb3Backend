import React, { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import { createWeb3Modal, useWeb3Modal, useWeb3ModalState, useWeb3ModalAccount, useDisconnect } from '@web3modal/ethers/react';
import { BrowserProvider, Eip1193Provider, ethers } from 'ethers';

// 1. Get ProjectID
const projectId = import.meta.env.VITE_PROJECT_ID;

// 2. Setup chains
const sepolia = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com'
};

// 3. Create a metadata object
const metadata = {
  name: 'KalaKrut Creative',
  description: 'A decentralized platform for artists and creators.',
  url: window.location.origin, // Use dynamic origin
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// 4. Create Ethers config
const ethersConfig = {
  metadata,
  defaultChainId: 11155111,
};

// 5. Create a custom theme
const kalaTheme = {
  '--w3m-color-mix': '#0f172a',
  '--w3m-color-mix-strength': 20,
  '--w3m-accent': '#06b6d4', // Kala secondary color
  '--w3m-border-radius-master': '1rem',
  '--w3m-font-family': '"SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
};

// --- Types and Interfaces ---
export interface Balances {
  eth: number;
  kala: number;
  usd: number; // This is a virtual balance for the demo
}

// IMPORTANT: Using a placeholder address. This will cause the KALA balance fetch to fail
// on Sepolia, but the new error handling will prevent it from hanging the app.
const TOKEN_CONTRACT_ADDRESSES = {
  sepolia: {
    kala: '0x4934a84351a8e3ac83190841f89a7209559952b1', // Example: A random valid-looking but likely incorrect address
  },
  mainnet: {
    kala: '0xYourKalaTokenAddressOnMainnet', // Placeholder for mainnet
  }
};

interface WalletContextType {
  isConnected: boolean;
  address?: string;
  provider?: BrowserProvider;
  open: () => void;
  disconnect: () => void;
  getChainId: () => number | undefined;
  signMessage: (message: string) => Promise<string | undefined>;
  balances: Balances;
  swap: (from: keyof Balances, to: keyof Balances, amount: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

// Helper function for a timeout
function timeout<T>(ms: number, promise: Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Promise timed out'));
    }, ms);

    promise
      .then(value => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch(reason => {
        clearTimeout(timer);
        reject(reason);
      });
  });
}


// --- WalletLogic Component (Handles the core web3modal hooks and balance fetching) ---
const WalletLogic: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { open } = useWeb3Modal();
    const { disconnect: w3mDisconnect } = useDisconnect();
    const { selectedNetworkId } = useWeb3ModalState();

    const [provider, setProvider] = useState<BrowserProvider | undefined>();
    const [balances, setBalances] = useState<Balances>({ eth: 0, kala: 0, usd: 1000 });

    useEffect(() => {
      if (isConnected && window.ethereum) {
        const ethersProvider = new ethers.BrowserProvider(window.ethereum as unknown as Eip1193Provider);
        setProvider(ethersProvider);
      } else {
        setProvider(undefined);
      }
    }, [isConnected]);

    useEffect(() => {
        const updateBalances = async () => {
            if (!provider || !address || !chainId) {
                setBalances({ eth: 0, kala: 0, usd: 1000 }); // Reset balances if disconnected
                return;
            }
            
            console.log(`Updating balances for chain ${chainId} on address ${address}`);
            let ethBalance = 0;
            let kalaBalance = 0;

            // 1. Fetch ETH Balance (Native Currency)
            try {
                const balance = await provider.getBalance(address);
                ethBalance = parseFloat(ethers.formatEther(balance));
            } catch (error) {
                console.error("Failed to fetch ETH balance:", error);
                ethBalance = 0; // Don't hang, just default to 0
            }

            // 2. Fetch KALA Token Balance (ERC20)
            if (chainId === sepolia.chainId) {
                try {
                    const kalaContractAddress = TOKEN_CONTRACT_ADDRESSES.sepolia.kala;
                    const abi = ["function balanceOf(address) view returns (uint256)"];
                    const contract = new ethers.Contract(kalaContractAddress, abi, provider);
                    console.log("Querying KALA balance...");
                    
                    // Race the balanceOf call against a 5-second timeout
                    const balance = await timeout(5000, contract.balanceOf(address));

                    kalaBalance = parseFloat(ethers.formatUnits(balance as any, 18)); // Assuming 18 decimals
                } catch (error) {
                    console.error("Failed to fetch KALA balance on Sepolia:", error);
                    kalaBalance = 0;
                }
            }

            setBalances(prev => ({ ...prev, eth: ethBalance, kala: kalaBalance }));
        };

        updateBalances();
        const interval = setInterval(updateBalances, 20000); // Update every 20s
        return () => clearInterval(interval); // Cleanup

    }, [provider, address, chainId]);

    const disconnect = () => {
        w3mDisconnect();
        setBalances({ eth: 0, kala: 0, usd: 1000 });
    };

    const signMessage = useCallback(async (message: string): Promise<string | undefined> => {
        if (!provider) return undefined;
        const signer = await provider.getSigner();
        return await signer.signMessage(message);
    }, [provider]);

    const swap = useCallback(async (from: keyof Balances, to: keyof Balances, amount: number) => {
      console.log(`Swapping ${amount} ${from} to ${to}`);
      // This is a mock swap. A real implementation would involve a router contract.
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setBalances(prev => {
            const newBalances = { ...prev };
            const fromRate = from === 'eth' ? 2200 : from === 'kala' ? 0.15 : 1;
            const toRate = to === 'eth' ? 2200 : to === 'kala' ? 0.15 : 1;
            const swapRate = fromRate / toRate;

            if (newBalances[from] >= amount) {
              newBalances[from] -= amount;
              newBalances[to] += amount * swapRate;
            }
            return newBalances;
          });
          resolve();
        }, 1500);
      });
    }, []);

    const value: WalletContextType = {
        isConnected,
        address,
        provider,
        open,
        disconnect,
        getChainId: () => selectedNetworkId,
        signMessage,
        balances,
        swap
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};

// --- Main Provider Component ---
export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isModalInitialized, setIsModalInitialized] = useState(false);

    useEffect(() => {
        if (!isModalInitialized) {
             if (!projectId) {
                console.warn("VITE_PROJECT_ID is not set in your .env file. Get one at https://cloud.walletconnect.com");
            }
            createWeb3Modal({
                ethersConfig,
                chains: [sepolia],
                projectId: projectId || 'a03c0a33e660428380ce6f40f36f36ac', 
                enableAnalytics: false, // Privacy-focused
                themeMode: 'dark',
                themeVariables: kalaTheme,
            });
            setIsModalInitialized(true);
        }
    }, [isModalInitialized]);

    return isModalInitialized ? <WalletLogic>{children}</WalletLogic> : null;
};
