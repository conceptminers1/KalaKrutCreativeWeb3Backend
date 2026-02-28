import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/tables/Table";
import { Transaction, UserRole } from '@/types/types';
import { useToast } from '@/contexts/ToastContext';

const ActionButton: React.FC<{ onClick: () => void; className: string; children: React.ReactNode }> = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${className}`}>
    {children}
  </button>
);

const TableActions: React.FC<{ 
  transaction: Transaction;
  role: UserRole; 
  onAction: (action: string, transactionId: string) => void;
}> = ({ transaction, role, onAction }) => {

  const handleAction = (action: string) => {
    onAction(action, transaction.id);
  };

  if (role === UserRole.ADMIN || role === UserRole.SYSTEM_ADMIN_LIVE) {
    return (
        <div className="space-x-2">
          <ActionButton onClick={() => handleAction('approve')} className="bg-green-500/20 text-green-300 hover:bg-green-500/40">Approve</ActionButton>
          <ActionButton onClick={() => handleAction('reject')} className="bg-red-500/20 text-red-300 hover:bg-red-500/40">Reject</ActionButton>
        </div>
      );
  }
  
  return null;
};

const TransactionRealDataTable = ({ currentUserRole }: { currentUserRole: UserRole }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/transactions.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch transactions: ${response.statusText}`);
        }
        const data: Transaction[] = await response.json();
        setTransactions(data);
      } catch (e: any) {
        setError(e.message);
        notify(e.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [notify]);

  const handleAction = (action: string, transactionId: string) => {
    notify(`Action '${action}' triggered for transaction '${transactionId}'.`, 'info');
    // Implement actual logic here, e.g., calling an API endpoint
  };

  if (isLoading) return <div className="text-center p-8 text-kala-400">Loading transaction data...</div>;
  if (error) return <div className="text-center p-8 text-red-500 bg-red-500/10 rounded-lg">Error: {error}</div>;

  return (
    <Table className="bg-kala-900 text-white rounded-lg p-6">
      <TableCaption>Real-time transaction data.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.id}</TableCell>
            <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>{transaction.amount}</TableCell>
            <TableCell>{transaction.currency}</TableCell>
            <TableCell>{transaction.status}</TableCell>
            <TableCell className="text-right">
                <TableActions transaction={transaction} role={currentUserRole} onAction={handleAction} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionRealDataTable;
