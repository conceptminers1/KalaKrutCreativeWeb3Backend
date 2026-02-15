import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [web3Modal, setWeb3Modal] = useState(null);

  useEffect(() => {
    const modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    });
    setWeb3Modal(modal);
  }, []);

  const connect = async () => {
    const instance = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(instance);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setProvider(provider);
    setSigner(signer);
    setAddress(address);
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    setProvider(null);
    setSigner(null);
    setAddress(null);
  };

  return (
    <Web3Context.Provider value={{ provider, signer, address, connect, disconnect }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
