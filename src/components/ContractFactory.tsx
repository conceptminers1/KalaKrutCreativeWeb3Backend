
import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract, Signer } from 'ethers';
import contractABI from "../../artifacts/contracts/ContractFactory.sol/ContractFactory.json";
import { MOCK_CONTRACTS } from "../mockData";

// The address of the deployed ContractFactory
const contractAddress = "YOUR_CONTRACT_FACTORY_ADDRESS";

const ContractFactory: React.FC = () => {
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [signer, setSigner] = useState<Signer | null>(null);
    const [contract, setContract] = useState<Contract | null>(null);

    // State for each contract creation form
    const [minDelay, setMinDelay] = useState("0");
    const [proposers, setProposers] = useState("");
    const [executors, setExecutors] = useState("");
    const [tokenAddress, setTokenAddress] = useState("");
    const [timelockAddress, setTimelockAddress] = useState("");
    const [nftName, setNftName] = useState("");
    const [nftSymbol, setNftSymbol] = useState("");
    const [eventUri, setEventUri] = useState("");
    const [fractionalizerName, setFractionalizerName] = useState("");
    const [fractionalizerSymbol, setFractionalizerSymbol] = useState("");
    const [nftContractAddress, setNftContractAddress] = useState("");
    const [nftId, setNftId] = useState("");
    const [totalSupply, setTotalSupply] = useState("");
    const [beneficiary, setBeneficiary] = useState("");
    const [arbiter, setArbiter] = useState("");

    useEffect(() => {
        const initEthers = async () => {
            if (window.ethereum) {
                const web3Provider = new BrowserProvider(window.ethereum);
                setProvider(web3Provider);

                const web3Signer = await web3Provider.getSigner();
                setSigner(web3Signer);

                const factoryContract = new Contract(contractAddress, contractABI.abi, web3Signer);
                setContract(factoryContract);
            } else {
                console.log("Please install MetaMask!");
            }
        };

        initEthers();
    }, []);
    
    // Handlers for each contract creation function
    const handleCreateKalaKrutToken = async () => {
        if (!contract) return;
        try {
            const tx = await contract.createKalaKrutToken();
            await tx.wait();
            alert("KalaKrutToken deployed successfully!");
        } catch (error) {
            console.error(error);
            alert("Error deploying KalaKrutToken.");
        }
    };

    const handleCreateTimelockController = async () => {
        if (!contract) return;
        try {
            const tx = await contract.createTimelockController(minDelay, proposers.split(','), executors.split(','));
            await tx.wait();
            alert("TimelockController deployed successfully!");
        } catch (error) {
            console.error(error);
            alert("Error deploying TimelockController.");
        }
    };

    const handleCreateGovernor = async () => {
        if (!contract) return;
        try {
            const tx = await contract.createGovernor(tokenAddress, timelockAddress);
            await tx.wait();
            alert("KalaKrutGovernor deployed successfully!");
        } catch (error) {
            console.error(error);
            alert("Error deploying KalaKrutGovernor.");
        }
    };
    
    const handleCreateTreasury = async () => {
        if (!contract) return;
        try {
            const tx = await contract.createTreasury();
            await tx.wait();
            alert("Treasury deployed successfully!");
        } catch (error) {
            console.error(error);
            alert("Error deploying Treasury.");
        }
    };

    const handleCreateKalaKrutNFT = async () => {
        if (!contract) return;
        try {
            const tx = await contract.createKalaKrutNFT(nftName, nftSymbol);
            await tx.wait();
            alert("KalaKrutNFT deployed successfully!");
        } catch (error) {
            console.error(error);
            alert("Error deploying KalaKrutNFT.");
        }
    };

    const handleCreateEventTicket = async () => {
        if (!contract) return;
        try {
            const tx = await contract.createEventTicket(eventUri);
            await tx.wait();
            alert("EventTicket deployed successfully!");
        } catch (error) {
            console.error(error);
            alert("Error deploying EventTicket.");
        }
    };

    const handleCreateFractionalizer = async () => {
        if (!contract) return;
        try {
            const tx = await contract.createFractionalizer(
                fractionalizerName,
                fractionalizerSymbol,
                nftContractAddress,
                nftId,
                totalSupply
            );
            await tx.wait();
            alert("Fractionalizer deployed successfully!");
        } catch (error) {
            console.error(error);
            alert("Error deploying Fractionalizer.");
        }
    };

    const handleCreateEscrow = async () => {
        if (!contract) return;
        try {
            const tx = await contract.createEscrow(beneficiary, arbiter);
            await tx.wait();
            alert("Escrow deployed successfully!");
        } catch (error) {
            console.error(error);
            alert("Error deploying Escrow.");
        }
    };

    return (
        <div className="container mx-auto p-4 bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-6 text-purple-400">Contract Factory</h1>
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">Recently Created Contracts (Mock)</h2>
                <ul className="space-y-4">
                    {MOCK_CONTRACTS.map(contract => (
                        <li key={contract.id} className="p-4 bg-gray-800 rounded-lg shadow-md">
                            <p className="font-semibold text-purple-400 text-lg">{contract.contractType}</p>
                            <p className="text-sm text-gray-300 whitespace-pre-wrap mt-2">{contract.content}</p>
                            <span className={`text-xs font-medium px-3 py-1 rounded-full mt-3 inline-block ${contract.status === 'Pending Review' ? 'bg-yellow-500 text-yellow-900' : 'bg-blue-500 text-blue-100'}`}>
                                {contract.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* KalaKrut Token */}
                <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-purple-400">Create KalaKrut Token</h2>
                    <button onClick={handleCreateKalaKrutToken} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                        Create
                    </button>
                </div>

                {/* Timelock Controller */}
                <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-purple-400">Create Timelock Controller</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300">Min Delay:</label>
                        <input type="text" value={minDelay} onChange={(e) => setMinDelay(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm p-2" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300">Proposers (comma-separated):</label>
                        <input type="text" value={proposers} onChange={(e) => setProposers(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm p-2" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300">Executors (comma-separated):</label>
                        <input type="text" value={executors} onChange={(e) => setExecutors(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm p-2" />
                    </div>
                    <button onClick={handleCreateTimelockController} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                        Create
                    </button>
                </div>
                
                {/* KalaKrut Governor */}
                <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-purple-400">Create KalaKrut Governor</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300">Token Address:</label>
                        <input type="text" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm p-2" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300">Timelock Address:</label>
                        <input type="text" value={timelockAddress} onChange={(e) => setTimelockAddress(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm p-2" />
                    </div>
                    <button onClick={handleCreateGovernor} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                        Create
                    </button>
                </div>

                {/* Treasury */}
                <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-purple-400">Create Treasury</h2>
                    <button onClick={handleCreateTreasury} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                        Create
                    </button>
                </div>
                
                {/* KalaKrut NFT */}
                <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-purple-400">Create KalaKrut NFT</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300">Name:</label>
                        <input type="text" value={nftName} onChange={(e) => setNftName(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm p-2" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300">Symbol:</label>
                        <input type="text" value={nftSymbol} onChange={(e) => setNftSymbol(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm p-2" />
                    </div>
                    <button onClick={handleCreateKalaKrutNFT} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                        Create
                    </button>
                </div>

                {/* Event Ticket */}
                <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-purple-400">Create Event Ticket</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300">Event URI:</label>
                        <input type="text" value={eventUri} onChange={(e) => setEventUri(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm p-2" />
                    </div>
                    <button onClick={handleCreateEventTicket} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                        Create
                    </button>
                </div>

                {/* Fractionalizer */}
                <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-purple-400">Create Fractionalizer</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300">Name:</label>
                        <input type="text" value={fractionalizerName} onChange={(e) => setFractionalizerName(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm p-2" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300">Symbol:</label>
                        <input type="text" value={fractionalizerSymbol} onChange={(e) => setFractionalizerSymbol(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm p-2" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300">NFT Contract Address:</label>
                        <input type="text" value={nftContractAddress} onChange={(e) => setNftContractAddress(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm p-2" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300">NFT ID:</label>
                        <input type="text" value={nftId} onChange={(e) => setNftId(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm p-2" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300">Total Supply:</label>
                        <input type="text" value={totalSupply} onChange={(e) => setTotalSupply(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm p-2" />
                    </div>
                    <button onClick={handleCreateFractionalizer} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                        Create
                    </button>
                </div>
                
                {/* Escrow */}
                <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-purple-400">Create Escrow</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300">Beneficiary:</label>
                        <input type="text" value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm p-2" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300">Arbiter:</label>
                        <input type="text" value={arbiter} onChange={(e) => setArbiter(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm p-2" />
                    </div>
                    <button onClick={handleCreateEscrow} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContractFactory;
