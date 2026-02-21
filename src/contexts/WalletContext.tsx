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
  // Optional: sid: 'YOUR_SESSION_ID', // Define a session ID for trusted sessions
};

// 5. Create a custom theme
const kalaTheme = {
  '--w3m-color-mix': '#0f172a',
  '--w3m-color-mix-strength': 20,
  '--w3m-accent': '#06b6d4', // Kala secondary color
  '--w3m-border-radius-master': '1rem',
  '--w3m-font-family': '"SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
};


interface WalletContextType {
  isConnected: boolean;
  address?: string;
  provider?: BrowserProvider;
  open: () => void;
  disconnect: () => void;
  getChainId: () => number | undefined;
  signMessage: (message: string) => Promise<string | undefined>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// --- Custom Hooks for Wallet Data --- 
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

// --- WalletLogic Component (Handles the core web3modal hooks) ---
const WalletLogic: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { open } = useWeb3Modal();
    const { disconnect } = useDisconnect();
    const { selectedNetworkId } = useWeb3ModalState();

    const getSignerAndProvider = useCallback(() => {
        if (!address || !chainId) return { provider: undefined, signer: undefined };
        const provider = new ethers.BrowserProvider(window.ethereum as unknown as Eip1193Provider);
        return { provider, signer: provider.getSigner() };
    }, [address, chainId]);

    const signMessage = useCallback(async (message: string): Promise<string | undefined> => {
        const { signer } = await getSignerAndProvider();
        if (signer) {
            return await (await signer).signMessage(message);
        }
        return undefined;
    }, [getSignerAndProvider]);

    const value: WalletContextType = {
        isConnected,
        address,
        provider: getSignerAndProvider().provider,
        open,
        disconnect,
        getChainId: () => selectedNetworkId,
        signMessage
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
                projectId: projectId || 'YOUR_WALLETCONNECT_PROJECT_ID', // Fallback for safety
                enableAnalytics: true,
                themeMode: 'dark',
                themeVariables: kalaTheme,
                explorerApiUrl: '/w3m_proxy',
                enableVerify: false, // Disabling domain verification as per recommendation
            });
            setIsModalInitialized(true);
        }
    }, [isModalInitialized]);

    return isModalInitialized ? <WalletLogic>{children}</WalletLogic> : null;
};
