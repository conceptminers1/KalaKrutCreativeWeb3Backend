import { useState, useMemo, useEffect } from 'react';
import { FileText, Briefcase, UserCheck, Shield, Award, Users } from 'lucide-react';
import ContractFactory from './ContractFactory';
import { UserRole } from '../types';

// --- All 9 Deployed Contract Addresses ---
const DEPLOYED_CONTRACTS = {
    KalaKrutToken: '0x67eeAedF8A791BB4e661959Bf2e5aa8ab2d12776',
    TimelockController: '0xe9E5D4a9B223679eB86A0a913A8FafD3afD73C61',
    KalaKrutGovernor: '0xDC304662539550251eD88467CE06E49F130C3E02',
    Treasury: '0x2f567D9057530a161F7AFc27cEf655335995d535',
    KalaKrutNFT: '0x369D9d5DD6706025C6F0376df9000C03e18daEE7',
    EventTicket: '0x5dEA09497196D0A3E3676956e28Aa4c428313e8e',
    Fractionalizer: '0x39b15Af3C4a222adDf69098149E02B965d40f9af',
    Escrow: '0x9F9601e0288Ca1d23E5A16da9DC98032Cf045eb8',
    ContractFactory: '0x98D039d6C8F4F04ac59d1dF2Cd80f408813C3810',
};

type ContractName = keyof typeof DEPLOYED_CONTRACTS;

// --- Role-Based Contract Visibility ---
const CONTRACT_ACCESS_LEVELS: Record<string, ContractName[]> = {
    ADMIN: Object.keys(DEPLOYED_CONTRACTS) as ContractName[],
    SYSTEM_ADMIN_LIVE: Object.keys(DEPLOYED_CONTRACTS) as ContractName[],
    DAO_GOVERNOR: Object.keys(DEPLOYED_CONTRACTS) as ContractName[],
    DAO_MEMBER: ['KalaKrutGovernor', 'KalaKrutToken', 'TimelockController', 'Escrow', 'EventTicket', 'Fractionalizer', 'KalaKrutNFT'],
    DEFAULT: ['Escrow', 'EventTicket', 'KalaKrutToken', 'KalaKrutNFT', 'Fractionalizer'], // For Artists, Talents, etc.
};

const mockContractListings = [
    { id: 'C001', name: 'Artist Management Agreement #1024', type: 'Artist', status: 'Pending Review', assignedTo: 'ADMIN' },
    { id: 'C002', name: 'DAO Proposal #42: New Marketing Budget', type: 'DAO', status: 'Voting Active', assignedTo: 'DAO_MEMBER' },
    { id: 'C003', name: 'Venue Rental Agreement - Live Event', type: 'Vendor', status: 'Action Required: Payout', assignedTo: 'SYSTEM_ADMIN_LIVE' },
    { id: 'C004', name: 'Treasury Payout to ArtistX', type: 'DAO', status: 'Queued in Timelock', assignedTo: 'DAO_GOVERNOR' },
    { id: 'C005', name: 'Service Agreement - Sound Engineer', type: 'Vendor', status: 'Awaiting Signature', assignedTo: 'ADMIN' },
    { id: 'C006', name: 'DAO Proposal #43: Update Bylaws', type: 'DAO', status: 'Defeated', assignedTo: 'DAO_GOVERNOR' },
];

interface AdminContractsProps {
  currentUserRole: UserRole;
}

const AdminContracts: React.FC<AdminContractsProps> = ({ currentUserRole }) => {
    const [activeTab, setActiveTab] = useState<'agreements' | 'factory'>('agreements');

    const visibleContracts = useMemo(() => {
        const userRole = currentUserRole || 'DEFAULT';
        const allowedKeys = CONTRACT_ACCESS_LEVELS[userRole] || CONTRACT_ACCESS_LEVELS.DEFAULT;
        
        return allowedKeys.reduce((acc, key) => {
            if (DEPLOYED_CONTRACTS[key]) {
                acc[key] = DEPLOYED_CONTRACTS[key];
            }
            return acc;
        }, {} as Record<ContractName, string>);
    }, [currentUserRole]);

    const [selectedContract, setSelectedContract] = useState<ContractName>(() => {
        const firstVisible = Object.keys(visibleContracts)[0] as ContractName;
        return firstVisible || 'KalaKrutToken';
    });
    
    useEffect(() => {
        const availableKeys = Object.keys(visibleContracts);
        if (availableKeys.length > 0 && !availableKeys.includes(selectedContract)) {
            setSelectedContract(availableKeys[0] as ContractName);
        }
    }, [visibleContracts, selectedContract]);

    const roleBasedActions = useMemo(() => {
        if (!currentUserRole) return [];
        const roles = {
            ADMIN: () => mockContractListings.filter(c => c.assignedTo === 'ADMIN'),
            SYSTEM_ADMIN_LIVE: () => mockContractListings.filter(c => c.assignedTo === 'SYSTEM_ADMIN_LIVE'),
            DAO_GOVERNOR: () => mockContractListings.filter(c => c.type === 'DAO'),
            DAO_MEMBER: () => mockContractListings.filter(c => c.assignedTo === 'DAO_MEMBER' && c.status === 'Voting Active'),
        };
        return roles[currentUserRole as keyof typeof roles] ? roles[currentUserRole as keyof typeof roles]() : [];
    }, [currentUserRole]);

    const renderRoleIcon = (role: string) => {
        const icons = {
            ADMIN: <UserCheck className="w-4 h-4 text-blue-400" />,
            SYSTEM_ADMIN_LIVE: <Shield className="w-4 h-4 text-red-400" />,
            DAO_GOVERNOR: <Award className="w-4 h-4 text-amber-400" />,
            DAO_MEMBER: <Users className="w-4 h-4 text-green-400" />,
        };
        return icons[role as keyof typeof icons] || null;
    };

    const AgreementsPage = (
        <div className="bg-kala-900 border border-kala-700 rounded-2xl p-6 lg:p-8 shadow-2xl shadow-kala-950/50">
            <div className="flex items-center gap-4 mb-8">
                <Briefcase className="w-8 h-8 text-kala-secondary" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Contracts & Agreements</h2>
                    <p className="text-kala-400">Manage, review, and interact with all organizational contracts.</p>
                </div>
            </div>

            <div className='mb-8'>
                <label htmlFor="contractSelect" className="block text-sm font-medium text-kala-300 mb-2">View a Deployed Smart Contract</label>
                <select
                    id="contractSelect"
                    value={selectedContract}
                    onChange={(e) => setSelectedContract(e.target.value as ContractName)}
                    className="w-full bg-kala-800 border border-kala-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-kala-secondary focus:border-kala-secondary transition"
                >
                    {Object.keys(visibleContracts).map(name => (
                        <option key={name} value={name}>{name.replace(/([A-Z])/g, ' $1').trim()}</option>
                    ))}
                </select>
                <div className='mt-2 text-xs text-mono text-kala-500'>
                    Address: {visibleContracts[selectedContract]}
                </div>
            </div>
            
            <div>
                <h3 className="text-xl font-semibold text-white mb-4">Your Action Items</h3>
                {roleBasedActions.length > 0 ? (
                    <ul className="space-y-3">
                        {roleBasedActions.map(contract => (
                            <li key={contract.id} className="bg-kala-800/70 p-4 rounded-lg flex justify-between items-center hover:bg-kala-800 transition cursor-pointer">
                                <div className='flex items-center gap-4'>
                                    <FileText className="w-6 h-6 text-kala-400" />
                                    <div>
                                        <p className='font-bold text-white'>{contract.name}</p>
                                        <p className='text-sm text-kala-300'>Status: <span className='font-semibold text-amber-400'>{contract.status}</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-kala-400" title={`Assigned to: ${contract.assignedTo}`}>
                                    {renderRoleIcon(contract.assignedTo)}
                                    <span>{contract.assignedTo.replace('_', ' ')}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className='text-center py-8 px-4 border-2 border-dashed border-kala-700 rounded-lg'>
                        <p className='text-kala-400'>You have no pending contract actions based on your role.</p>
                        <p className='text-sm text-kala-500 mt-1'>Your current role: {currentUserRole}</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex border-b border-kala-700">
                <button 
                    onClick={() => setActiveTab('agreements')}
                    className={`px-6 py-3 text-lg font-semibold transition ${activeTab === 'agreements' ? 'text-white border-b-2 border-kala-secondary' : 'text-kala-400 hover:text-white'}`}>
                    Contracts & Agreements
                </button>
                <button 
                    onClick={() => setActiveTab('factory')}
                    className={`px-6 py-3 text-lg font-semibold transition ${activeTab === 'factory' ? 'text-white border-b-2 border-kala-secondary' : 'text-kala-400 hover:text-white'}`}>
                    Contract Factory
                </button>
            </div>

            {activeTab === 'agreements' ? AgreementsPage : <ContractFactory currentUserRole={currentUserRole} />}
        </div>
    );
};

export default AdminContracts;
