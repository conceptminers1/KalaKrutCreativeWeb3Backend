import React, { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import {
  useWeb3Modal,
  useWeb3ModalState,
  useWeb3ModalAccount,
  useWeb3ModalProvider
} from '@web3modal/ethers/react';
import { BrowserProvider, ethers } from 'ethers';

// --- Types and Interfaces ---
export interface Balances {
  eth: number;
  kala: number;
  usd: number;
}

const TOKEN_CONTRACT_ADDRESSES = {
  sepolia: {
    kala: '0x4934a84351a8e3ac83190841f89a7209559952b1',
  },
  amoy: {
    kala: '0xe9E5D4a9B223679eB86A0a913A8FafD3afD73C61',
  },
  mainnet: {
    kala: '0xYourKalaTokenAddressOnMainnet', // Placeholder
  }
};

interface WalletContextType {
  isConnected: boolean;
  address?: string;
  provider?: BrowserProvider;
  open: () => void;
  // disconnect property removed
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

function timeout<T>(ms: number, promise: Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Promise timed out')), ms);
    promise
      .then(value => { clearTimeout(timer); resolve(value); })
      .catch(reason => { clearTimeout(timer); reject(reason); });
  });
}

// --- WalletLogic Component ---
const WalletLogic: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const { open } = useWeb3Modal();
    // useDisconnect hook removed
    const { selectedNetworkId } = useWeb3ModalState();

    const [provider, setProvider] = useState<BrowserProvider | undefined>();
    const [balances, setBalances] = useState<Balances>({ eth: 0, kala: 0, usd: 1000 });

    useEffect(() => {
      if (isConnected && walletProvider) {
        const ethersProvider = new BrowserProvider(walletProvider);
        setProvider(ethersProvider);
      } else {
        setProvider(undefined);
        // Reset balances on disconnect
        setBalances({ eth: 0, kala: 0, usd: 1000 });
      }
    }, [isConnected, walletProvider]);

    useEffect(() => {
        const updateBalances = async () => {
            if (!provider || !address || !chainId) {
                setBalances({ eth: 0, kala: 0, usd: 1000 });
                return;
            }

            let ethBalance = 0;
            let kalaBalance = 0;

            try {
                const balance = await provider.getBalance(address);
                ethBalance = parseFloat(ethers.formatEther(balance));
            } catch (error) {
                console.error("Failed to fetch native balance:", error);
                ethBalance = 0;
            }

            const networkName = chainId === 11155111 ? 'sepolia' : chainId === 80002 ? 'amoy' : null;
            if (networkName) {
                try {
                    const kalaContractAddress = TOKEN_CONTRACT_ADDRESSES[networkName].kala;
                    const abi = ["function balanceOf(address) view returns (uint256)"];
                    const contract = new ethers.Contract(kalaContractAddress, abi, provider);

                    const balance = await timeout(5000, contract.balanceOf(address));
                    kalaBalance = parseFloat(ethers.formatUnits(balance as any, 18));
                } catch (error) {
                    console.error(`Failed to fetch KALA balance on chain ${chainId}:`, error);
                    kalaBalance = 0;
                }
            }

            setBalances(prev => ({ ...prev, eth: ethBalance, kala: kalaBalance }));
        };

        updateBalances();
        const interval = setInterval(updateBalances, 20000);
        return () => clearInterval(interval);

    }, [provider, address, chainId]);

    // Custom disconnect function removed

    const signMessage = useCallback(async (message: string): Promise<string | undefined> => {
        if (!provider) return undefined;
        const signer = await provider.getSigner();
        return await signer.signMessage(message);
    }, [provider]);

    const swap = useCallback(async (from: keyof Balances, to: keyof Balances, amount: number) => {
      console.log(`Swapping ${amount} ${from} to ${to}`);
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
        // disconnect property removed
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
    return <WalletLogic>{children}</WalletLogic>;
};
