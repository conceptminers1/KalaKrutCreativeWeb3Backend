import React, { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { contractAddresses } from '@/data/contractAddresses';
import TreasuryABI from '@/../artifacts/contracts/Treasury.sol/Treasury.json';
import { ethers } from 'ethers';
import { API_BASE_URL } from '@/config';

interface Transaction {
  id: string;
  type: 'Deposit' | 'Withdrawal' | 'Operational' | 'Grant';
  description: string;
  from: string;
  to: string;
  amount: string;
  currency: 'ETH' | 'USD' | string;
  timestamp: Date;
}

const TreasuryRealDataTable: React.FC = () => {
  const { provider, isConnected } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      console.log("TreasuryLedger: Starting fetch. API_BASE_URL:", API_BASE_URL);

      try {
        let onChainTxs: Transaction[] = [];
        let offChainTxs: Transaction[] = [];

        // 1. Fetch On-Chain (Crypto) Transactions
        if (provider && isConnected) {
          try {
            const treasuryContract = new ethers.Contract(
              contractAddresses.Treasury,
              TreasuryABI.abi,
              provider
            );
            const depositFilter = treasuryContract.filters.FundsDeposited();
            const depositEvents = await treasuryContract.queryFilter(depositFilter);
            const withdrawalFilter = treasuryContract.filters.FundsWithdrawn();
            const withdrawalEvents = await treasuryContract.queryFilter(withdrawalFilter);

            const processEvents = async (events: any[], type: 'Deposit' | 'Withdrawal'): Promise<Transaction[]> => {
              return Promise.all(
                events.map(async (event) => {
                  const block = await event.getBlock();
                  return {
                    id: event.transactionHash,
                    type,
                    description: type === 'Deposit' ? 'On-chain deposit' : 'On-chain withdrawal',
                    from: type === 'Deposit' ? event.args.from : contractAddresses.Treasury,
                    to: type === 'Withdrawal' ? event.args.to : contractAddresses.Treasury,
                    amount: ethers.formatEther(event.args.amount),
                    currency: 'ETH',
                    timestamp: new Date(block.timestamp * 1000),
                  };
                })
              );
            };
            const deposits = await processEvents(depositEvents, 'Deposit');
            const withdrawals = await processEvents(withdrawalEvents, 'Withdrawal');
            onChainTxs = [...deposits, ...withdrawals];
            console.log(`TreasuryLedger: Found ${onChainTxs.length} on-chain transactions.`);
          } catch (e: any) {
            console.error("On-chain data fetch failed:", e);
            setError("Could not load on-chain data. Check your wallet connection.");
          }
        }

        // 2. Fetch Off-Chain (Fiat) Transactions
        let apiData: any[] = [];
        try {
          console.log("TreasuryLedger: Attempting to fetch from backend API...");
          const response = await fetch(`${API_BASE_URL}/api/fiat-transactions`);
          console.log("TreasuryLedger: API Response Status:", response.status);
          if (response.ok) {
            apiData = await response.json();
            console.log("TreasuryLedger: Received API data:", apiData);
          } else {
            console.warn("TreasuryLedger: API fetch failed, falling back to local JSON.");
          }
        } catch (e) {
          console.warn("TreasuryLedger: API unreachable, falling back to local JSON:", e);
        }

        // Fallback to local JSON if API is empty or failed
        if (apiData.length === 0) {
          try {
            console.log("TreasuryLedger: Fetching from local JSON fallback...");
            const jsonResponse = await fetch('/api/treasury_transactions.json');
            if (jsonResponse.ok) {
              const jsonData = await jsonResponse.json();
              // Transform JSON format if needed, assuming it matches legacy structure or mapped structure
              apiData = jsonData.map((tx: any) => ({
                id: tx.id || `json-${Math.random()}`,
                amount: tx.amount || tx.value,
                currency: tx.currency || 'USD',
                description: tx.description || tx.label,
                type: tx.type === 'INCOME' || tx.type === 'Deposit' ? 'INCOME' : 'EXPENSE',
                createdAt: tx.createdAt || new Date().toISOString()
              }));
              console.log("TreasuryLedger: Loaded local JSON data:", apiData);
            }
          } catch (jsonErr) {
            console.error("TreasuryLedger: Both API and Local JSON failed:", jsonErr);
          }
        }

        offChainTxs = apiData.map((tx: any) => {
          let mappedType: 'Deposit' | 'Withdrawal' | 'Operational' | 'Grant' = 'Operational';
          if (tx.type === 'INCOME') {
            mappedType = tx.description?.toLowerCase().includes('grant') ? 'Grant' : 'Deposit';
          } else {
            mappedType = tx.description?.toLowerCase().includes('withdraw') ? 'Withdrawal' : 'Operational';
          }

          return {
            id: tx.id,
            type: mappedType,
            description: tx.description || 'Fiat Transaction',
            from: tx.type === 'INCOME' ? 'External' : 'Treasury',
            to: tx.type === 'EXPENSE' ? 'External' : 'Treasury',
            amount: tx.amount.toString(),
            currency: tx.currency,
            timestamp: new Date(tx.createdAt),
          };
        });

        console.log("TreasuryLedger: Final mapped off-chain transactions:", offChainTxs);

        // 3. Merge and Sort
        const allTransactions = [...onChainTxs, ...offChainTxs].sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        );

        setTransactions(allTransactions);

      } catch (e: any) {
        console.error("Failed to fetch treasury transactions:", e);
        setError(`Failed to load ledger data: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [provider, isConnected]);

  if (isLoading) {
    return <div className="text-center p-8 text-kala-400">Loading Unified Treasury Ledger...</div>;
  }

  if (transactions.length === 0) {
    if (!isConnected) {
      return (
        <div className="space-y-4 text-center p-8">
          <div className="text-kala-500">No records found (API/JSON empty) and wallet is disconnected.</div>
          <div className="text-sm text-kala-400 italic">Please connect your wallet to view on-chain treasury activity.</div>
        </div>
      );
    }
    return <div className="text-center p-8 text-kala-500">No treasury transactions found.</div>;
  }

  const truncateAddress = (addr: string) => addr.startsWith('0x') ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : addr;

  const typeColors = {
    Deposit: 'bg-green-500/20 text-green-300',
    Withdrawal: 'bg-red-500/20 text-red-300',
    Operational: 'bg-blue-500/20 text-blue-300',
    Grant: 'bg-purple-500/20 text-purple-300',
  }

  return (
    <div className="bg-kala-800/50 border border-kala-700 rounded-xl overflow-hidden animate-in fade-in">
      {error && <div className="p-4 bg-yellow-500/10 text-yellow-400 text-center text-sm">Warning: {error}</div>}
      {!isConnected && (
        <div className="p-2 bg-kala-900/30 text-kala-500 text-center text-[10px] uppercase tracking-widest border-b border-kala-700">
          Note: Wallet disconnected. Only displaying cached/fiat ledger.
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-kala-700">
          <thead className="bg-kala-900/50">
            <tr>
              {['Timestamp', 'Type', 'Description', 'Amount', 'Transaction ID / Source'].map(header => (
                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-kala-300 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-kala-800 divide-y divide-kala-700">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-kala-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-kala-400">{tx.timestamp.toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${typeColors[tx.type]}`}>
                    {tx.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-kala-300">{tx.description}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-mono ${tx.currency === 'ETH' ? 'text-green-400' : 'text-kala-200'}`}>
                  {(tx.type === 'Deposit' ? '+' : '-')}{tx.amount} {tx.currency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-kala-500 text-right font-mono">
                  {tx.currency === 'ETH' ? (
                    <a href={`https://sepolia.etherscan.io/tx/${tx.id}`} target="_blank" rel="noopener noreferrer" className="hover:text-kala-300 underline decoration-kala-700">
                      {truncateAddress(tx.id)}
                    </a>
                  ) : (
                    <span>Fiat / {tx.id.substring(0, 8)}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TreasuryRealDataTable;