
import React, { useState, useEffect } from "react";
import { Contract, parseEther } from 'ethers';
import { useWallet } from "../contexts/WalletContext"; // <-- Import the new hook
import contractABI from "../abis/ContractFactory.json";
import { MOCK_CONTRACTS } from "../mockData";
import { SmartContractDraft } from "../types";

// The address of the deployed ContractFactory
const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

const ContractFactory: React.FC = () => {
    // Get wallet state and functions from context
    const { signer, isConnected, open } = useWallet();

    const [factoryContract, setFactoryContract] = useState<Contract | null>(null);
    const [formValues, setFormValues] = useState<Record<string, Record<string, string>>>({});

    // Effect to create contract instance when the signer is available
    useEffect(() => {
        if (signer) {
            const contract = new Contract(contractAddress, contractABI, signer);
            setFactoryContract(contract);
        } else {
            setFactoryContract(null);
        }
    }, [signer]); // Re-run when the signer changes

    const handleInputChange = (contractId: string, parameter: string, value: string) => {
        setFormValues(prev => ({
            ...prev,
            [contractId]: {
                ...prev[contractId],
                [parameter]: value,
            }
        }));
    };

    const handleDeploy = async (contractInfo: SmartContractDraft) => {
        if (!factoryContract) {
            alert("Contract factory not initialized. Please connect your wallet.");
            return;
        }

        const contractValues = formValues[contractInfo.id] || {};
        const args = contractInfo.parameters.map(p => contractValues[p] || '');

        if (args.some(arg => arg === '')) {
            alert('Please fill in all parameters.');
            return;
        }

        try {
            const contractType = contractInfo.contractType;
            const createFunctionName = `create${contractType}`;

            if (typeof factoryContract[createFunctionName] !== 'function') {
                alert(`Factory function ${createFunctionName} does not exist.`);
                return;
            }

            let txOptions = {};
            let processedArgs = [ ...args ];

            if (contractType === 'ServiceAgreement') {
                const paymentAmount = processedArgs.pop(); // Last param is paymentAmount
                if (paymentAmount) {
                    txOptions = { value: parseEther(paymentAmount) };
                }
            }

            const finalArgs = processedArgs.map((arg, index) => {
                const paramName = contractInfo.parameters[index];
                if (paramName.includes('proposers') || paramName.includes('executors')) {
                    return arg.split(',').map(a => a.trim());
                }
                return arg;
            });

            const tx = await factoryContract[createFunctionName](...finalArgs, txOptions);
            
            await tx.wait();
            alert(`${contractType} deployed successfully!`);
        } catch (error) {
            console.error(error);
            alert(`Error deploying ${contractInfo.contractType}. Check console for details.`);
        }
    };
    
    return (
        <div className="container mx-auto p-4 bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-6 text-purple-400">Contract Factory</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_CONTRACTS.map(c => (
                    <div key={c.id} className="p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col">
                        <div className="flex-grow">
                            <h2 className="text-xl font-semibold mb-2 text-purple-400">{c.contractType}</h2>
                            <p className="text-xs text-gray-400 whitespace-pre-wrap mt-2 mb-4 font-mono bg-gray-900 p-2 rounded">{c.content}</p>
                            
                            {c.parameters.map(param => (
                                <div key={param} className="mb-4">
                                    <label className="block text-sm font-medium text-gray-300 capitalize">{param.replace(/([A-Z])/g, ' $1')}:</label>
                                    <input 
                                        type={param.toLowerCase().includes('address') ? "text" : (param.toLowerCase().includes("amount") ? "number" : "text")}
                                        value={(formValues[c.id] && formValues[c.id][param]) || ''}
                                        onChange={(e) => handleInputChange(c.id, param, e.target.value)} 
                                        placeholder={`Enter ${param}`}
                                        className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm p-2 text-sm" 
                                    />
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => handleDeploy(c)} 
                            disabled={!factoryContract} // Disabled if the contract instance isn't ready
                            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 disabled:bg-gray-500">
                            Deploy
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContractFactory;
