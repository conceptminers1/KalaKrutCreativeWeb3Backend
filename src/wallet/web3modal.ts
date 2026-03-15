import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

// 1. Get ProjectID
const projectId = 'af6a6ff3baf7e99199d839ea4bce5c45' // Replace with your actual Project ID

// 2. Setup chains
const sepolia = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/demo' // Using Alchemy's public demo endpoint
};

const amoy = {
  chainId: 80002,
  name: 'Amoy',
  currency: 'MATIC',
  explorerUrl: 'https://www.oklink.com/amoy',
  rpcUrl: 'https://rpc-amoy.polygon.technology'
}

// 3. Create modal
const metadata = {
  name: 'KalaKrut Creative',
  description: 'A decentralized platform for artists and creators.',
  url: 'https://9000-firebase-kalakrutcreativekg1-1769075240619.cluster-ejd22kqny5htuv5dfowoyipt52.cloudworkstations.dev',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const ethersConfig = defaultConfig({
  metadata,
  defaultChainId: 11155111,
  enableInjected: false, // Disabling browser extension detection
  enableCoinbase: false,
  enableEIP6963: false // Disabling wallet discovery
})

createWeb3Modal({
  ethersConfig,
  chains: [sepolia, amoy],
  projectId,
  enableAnalytics: false,
  enableOnramp: false, 
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#0f172a',
    '--w3m-color-mix-strength': 20,
    '--w3m-accent': '#06b6d4',
    '--w3m-border-radius-master': '1rem',
    '--w3m-font-family': '"SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
  },
})
