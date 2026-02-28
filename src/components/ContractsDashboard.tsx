
import React, { useState, useEffect, useMemo } from 'react';
// Correct Ethers v6 imports
import { BrowserProvider, Contract } from 'ethers';
import { contractAddresses as oldContractAddresses } from '../data/contractAddresses';
import contractFactoryAbi from '../../artifacts/contracts/ContractFactory.sol/ContractFactory.json';
import { MOCK_CONTRACTS } from '../mockData';
import { SmartContractDraft } from '../types';
import { FileSignature, Search, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

// This will be replaced with the real address once the factory is deployed.
const contractFactoryAddress = "0x0000000000000000000000000000000000000000"; // Using a placeholder

interface DeployedContract {
    type: string;
    address: string;
    isMock?: boolean;
}

const ContractsDashboard: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.ethereum) {
            setError("Please install MetaMask to interact with contracts. Live contract creation listening is disabled.");
            return;
        }
    }, []);

    const { liveContracts, mockContracts } = useMemo(() => {
        const live = Object.entries(oldContractAddresses).map(([type, address]) => ({ type, address, isMock: false }));
        const mock = MOCK_CONTRACTS.map(c => ({ type: c.contractType, address: c.id, isMock: true }));
        
        const filterContracts = (contracts: DeployedContract[]) => {
            if (!searchTerm) return contracts;
            return contracts.filter(
                c => c.type.toLowerCase().includes(searchTerm.toLowerCase()) || c.address.toLowerCase().includes(searchTerm.toLowerCase())
            );
        };

        return {
            liveContracts: filterContracts(live),
            mockContracts: filterContracts(mock)
        };
    }, [searchTerm]);

    const ContractList = ({ contracts, title, icon, isMockList }: { contracts: DeployedContract[], title: string, icon: React.ReactNode, isMockList?: boolean }) => (
        <div className="bg-kala-800/40 border border-kala-700 p-4 sm:p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
                {icon}
                <h2 className="text-2xl font-semibold text-white">{title}</h2>
            </div>
            {contracts.length > 0 ? (
                <ul className="space-y-4">
                    {contracts.map(({ type, address }, i) => (
                        <li key={`${address}-${i}`} 
                            className={`p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center transition-all duration-200 border 
                            ${isMockList 
                                ? 'bg-orange-800/20 border-orange-500/20' 
                                : 'bg-green-800/20 border-green-500/20 hover:bg-green-800/40 hover:border-green-500/40'
                            }`}>
                            
                            <div className="flex items-center gap-3">
                                <span className={`font-bold ${isMockList ? 'text-orange-300' : 'text-green-300'}`}>
                                    {type}
                                </span>
                            </div>
                            
                            {isMockList ? (
                                <span className="text-sm font-mono bg-kala-900 text-kala-500 px-3 py-1 rounded-md mt-3 sm:mt-0 self-start sm:self-center select-all">
                                    {address}
                                </span>
                            ) : (
                                <a  href={`https://sepolia.etherscan.io/address/${address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-mono bg-kala-900 text-kala-300 px-3 py-1 rounded-md mt-3 sm:mt-0 self-start sm:self-center group flex items-center gap-2 hover:bg-kala-700 transition-colors">
                                    <span>{address}</span>
                                    <ExternalLink className="w-4 h-4 text-kala-500 group-hover:text-kala-secondary transition-colors" />
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-kala-500 text-center py-8">
                    <p className="text-lg">No contracts found.</p>
                    {searchTerm && <p className="text-sm mt-1">Your search for "{searchTerm}" did not match any contracts in this list.</p>}
                </div>
            )}
        </div>
    );

    return (
        <div className="p-2 sm:p-6 bg-kala-900 min-h-screen text-white">
            <div className="flex items-center gap-4 mb-2">
                <FileSignature className="w-8 h-8 text-kala-secondary" />
                <h1 className="text-3xl font-bold">Contracts & Agreements</h1>
            </div>
            <p className="text-kala-400 mb-8">A central dashboard for all deployed smart contracts on the platform.</p>
            
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 mb-6 rounded-lg flex items-center gap-3" role="alert">
                    <AlertTriangle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="mb-8 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-kala-500" />
                <input 
                    type="text"
                    placeholder="Search all contracts..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-kala-800 border border-kala-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-kala-secondary placeholder-kala-500"
                />
            </div>

            <div className="space-y-10">
                <ContractList 
                    contracts={liveContracts} 
                    title="Portal's Contracts" 
                    icon={<CheckCircle className="w-7 h-7 text-green-400" />}
                />
                <ContractList 
                    contracts={mockContracts} 
                    title="Users' Contracts" 
                    icon={<AlertTriangle className="w-7 h-7 text-orange-400" />}
                    isMockList
                />
            </div>
        </div>
    );
};

export default ContractsDashboard;
