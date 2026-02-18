
import React, { useState, useEffect, useMemo } from 'react';
// Correct Ethers v6 imports
import { BrowserProvider, Contract } from 'ethers';
import { contractAddresses as oldContractAddresses } from '../data/contractAddresses';
import contractFactoryAbi from '../../artifacts/contracts/ContractFactory.sol/ContractFactory.json';
import { MOCK_CONTRACTS } from '../mockData';
import { SmartContractDraft } from '../types';

// This will be replaced with the real address once the factory is deployed.
const contractFactoryAddress = "0x0000000000000000000000000000000000000000"; // Using a placeholder

interface DeployedContract {
    type: string;
    address: string;
    isMock?: boolean;
}

const ContractsDashboard: React.FC = () => {
    const [newlyDeployedContracts, setNewlyDeployedContracts] = useState<DeployedContract[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Ensure this code runs only in the browser
        if (typeof window === 'undefined' || !window.ethereum) {
            setError("Please install MetaMask to interact with contracts.");
            return;
        }

        let factoryContract: Contract;

        const onContractCreated = (contractAddress: string, creator: string, contractType: string) => {
            // Ensure state updates are safe and avoid race conditions
            setNewlyDeployedContracts(prev => {
                if (prev.some(c => c.address === contractAddress)) {
                    return prev;
                }
                return [...prev, { type: contractType, address: contractAddress }];
            });
        };

        try {
            const provider = new BrowserProvider(window.ethereum);
            factoryContract = new Contract(contractFactoryAddress, contractFactoryAbi.abi, provider);
            factoryContract.on("ContractCreated", onContractCreated);
        } catch (e) {
            console.error("Note: Could not connect to the ContractFactory. This is expected if it's not deployed yet.", e);
            setError("Could not connect to the contract factory. Displaying existing contracts only.");
        }

        // Return the cleanup function to remove the listener
        return () => {
            if (factoryContract) {
                factoryContract.off("ContractCreated", onContractCreated);
            }
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    const allKnownContracts: DeployedContract[] = useMemo(() => {
        const oldContracts = Object.entries(oldContractAddresses).map(([type, address]) => ({ type, address, isMock: false }));
        const mockExamples = MOCK_CONTRACTS.map(c => ({ type: c.contractType, address: c.id, isMock: true }));
        const combined = [...oldContracts, ...mockExamples, ...newlyDeployedContracts];
        return combined.filter((v, i, a) => a.findIndex(t => (t.address === v.address)) === i);
    }, [newlyDeployedContracts]);

    const filteredContracts = useMemo(() => {
        if (!searchTerm) {
            return allKnownContracts;
        }
        return allKnownContracts.filter(
            contract =>
                contract.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contract.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allKnownContracts, searchTerm]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Contracts & Agreements</h1>
            <p className="text-gray-600 mb-6">A central dashboard for all deployed contracts on the platform.</p>
            
            {error && <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert"><p>{error}</p></div>}

            <div className="mb-6">
                <input 
                    type="text"
                    placeholder="Search by type or address... (e.g., 'Treasury' or '0x2f56...')"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">All Contracts</h2>
                {filteredContracts.length > 0 ? (
                    <ul className="space-y-3">
                        {filteredContracts.map(({ type, address, isMock }, i) => (
                            <li key={`${address}-${i}`} className={`p-3 rounded-md flex flex-col sm:flex-row justify-between sm:items-center transition-colors ${isMock ? 'bg-orange-50' : 'bg-gray-50'} hover:bg-gray-200`}>
                                <span className={`font-semibold ${isMock ? 'text-orange-700' : 'text-gray-800'}`}>
                                    {type} {isMock && '(Mock Example)'}
                                </span>
                                <span className="text-sm font-mono bg-gray-200 text-gray-700 px-3 py-1 rounded mt-2 sm:mt-0">{address}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center py-4">
                        {searchTerm ? `No contracts found for "${searchTerm}".` : "No contracts available."}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ContractsDashboard;
