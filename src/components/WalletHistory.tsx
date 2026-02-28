import React from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Fuel,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { UserRole, ArtistProfile } from '../types/types'; // Updated import path

// Expanded Transaction type to include user info
export interface Transaction {
  id: string;
  type: 'Incoming' | 'Outgoing' | 'Gas' | 'Mint' | 'Swap';
  description: string;
  amount: string;
  currency: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  hash: string;
  userId: string; // To associate transaction with a user
  toFrom: string; // Name of the other party
}

// Enhanced mock data with user IDs
const MOCK_HISTORY_DETAILED: Transaction[] = [
  {
    id: '1',
    type: 'Incoming',
    description: 'Payment for Gig #882',
    amount: '+0.85',
    currency: 'ETH',
    date: '2023-10-14',
    status: 'Completed',
    hash: '0x32...a1b2',
    userId: 'u_artist',
    toFrom: 'Festival Co.',
  },
  {
    id: '2',
    type: 'Gas',
    description: 'Contract Deployment (Event)',
    amount: '-0.012',
    currency: 'ETH',
    date: '2023-10-13',
    status: 'Completed',
    hash: '0x99...c3d4',
    userId: 'u_org',
    toFrom: 'Ethereum Network',
  },
  {
    id: '3',
    type: 'Mint',
    description: 'Minted NFT: \"Neon Rain\"',
    amount: '-0.05',
    currency: 'ETH',
    date: '2023-10-12',
    status: 'Completed',
    hash: '0x55...e6f7',
    userId: 'u_artist',
    toFrom: 'KalaKrut Minting',
  },
  {
    id: '4',
    type: 'Outgoing',
    description: 'DAO Membership Fee',
    amount: '-500',
    currency: 'KALA',
    date: '2023-10-10',
    status: 'Completed',
    hash: '0x11...g8h9',
    userId: 'u_dao_member',
    toFrom: 'KalaKrut DAO',
  },
  {
    id: '5',
    type: 'Swap',
    description: 'Swap ETH to USDC',
    amount: '250',
    currency: 'USDC',
    date: '2023-10-09',
    status: 'Pending',
    hash: '0x77...i0j1',
    userId: 'u_reveller',
    toFrom: 'Uniswap',
  },
    {
    id: '6',
    type: 'Incoming',
    description: 'Ticket Sale: Early Bird',
    amount: '+50',
    currency: 'USDC',
    date: '2023-10-15',
    status: 'Completed',
    hash: '0x88...jkl0',
    userId: 'u_org',
    toFrom: 'Alex Fan',
  },
];


const TransactionIcon: React.FC<{ type: Transaction['type'] }> = ({ type }) => {
    const iconProps = { className: "w-4 h-4" };
    const typeMap = {
        'Incoming': <ArrowDownLeft {...iconProps} />,
        'Outgoing': <ArrowUpRight {...iconProps} />,
        'Mint': <RefreshCw {...iconProps} />,
        'Gas': <Fuel {...iconProps} />,
        'Swap': <RefreshCw {...iconProps} />,
    };
    return (
        <div
            className={`p-2 rounded-full ${
              type === 'Incoming' ? 'bg-green-500/20 text-green-400'
            : type === 'Outgoing' ? 'bg-red-500/20 text-red-400'
            : type === 'Mint' ? 'bg-purple-500/20 text-purple-400'
            : type === 'Gas' ? 'bg-orange-500/20 text-orange-400'
            : 'bg-blue-500/20 text-blue-400'
            }`}
        >
            {typeMap[type]}
        </div>
    );
}

const WalletHistory: React.FC<{ currentUser: ArtistProfile }> = ({ currentUser }) => {

  // Admins see all transactions, others see only their own.
  const transactionsToShow =
    currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SYSTEM_ADMIN_LIVE
      ? MOCK_HISTORY_DETAILED
      : MOCK_HISTORY_DETAILED.filter((tx) => tx.userId === currentUser.id);

  return (
    <div className="bg-kala-900 border border-kala-700 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-kala-700 bg-kala-800/50 flex justify-between items-center">
        <h3 className="font-bold text-white">Transaction History</h3>
        <button className="text-xs text-kala-400 hover:text-white flex items-center gap-1">
          View on Etherscan <ExternalLink className="w-3 h-3" />
        </button>
      </div>
      <div className="divide-y divide-kala-800">
        {transactionsToShow.length > 0 ? (
            transactionsToShow.map((tx) => (
            <div
                key={tx.id}
                className="p-4 flex items-center justify-between hover:bg-kala-800/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                <TransactionIcon type={tx.type} />
                <div>
                    <div className="text-sm font-medium text-white">
                    {tx.description}
                    </div>
                    <div className="text-xs text-kala-500">
                    {tx.date} &bull; {tx.status} &bull; To/From: {tx.toFrom}
                    </div>
                </div>
                </div>
                <div className="text-right">
                <div
                    className={`text-sm font-mono font-bold ${
                    tx.amount.startsWith('+')
                        ? 'text-green-400'
                        : 'text-slate-200'
                    }`}
                >
                    {tx.amount} {tx.currency}
                </div>
                <div className="text-[10px] text-kala-600 font-mono truncate w-20 ml-auto">
                    {tx.hash}
                </div>
                </div>
            </div>
            ))
        ) : (
            <div className="p-8 text-center text-kala-500">
                <p>No transactions found for this user.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default WalletHistory;