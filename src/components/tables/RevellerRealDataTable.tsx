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
import { RevellerProfile, UserRole } from '@/types/types';
import { useToast } from '@/contexts/ToastContext';

const ActionButton: React.FC<{ onClick: () => void; className: string; children: React.ReactNode }> = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${className}`}>
    {children}
  </button>
);

const TableActions: React.FC<{ 
  reveller: RevellerProfile;
  role: UserRole; 
  onAction: (action: string, revellerId: string) => void;
}> = ({ reveller, role, onAction }) => {

  const handleAction = (action: string) => {
    onAction(action, reveller.id);
  };

  if (role === UserRole.ADMIN || role === UserRole.SYSTEM_ADMIN_LIVE) {
    return (
        <div className="space-x-2">
          <ActionButton onClick={() => handleAction('edit')} className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/40">Edit</ActionButton>
          <ActionButton onClick={() => handleAction('delete')} className="bg-red-500/20 text-red-300 hover:bg-red-500/40">Delete</ActionButton>
        </div>
      );
  }
  
  return null;
};

const RevellerRealDataTable = ({ currentUserRole }: { currentUserRole: UserRole }) => {
  const [revellers, setRevellers] = useState<RevellerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/revellers.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch revellers: ${response.statusText}`);
        }
        const data: RevellerProfile[] = await response.json();
        setRevellers(data);
      } catch (e: any) {
        setError(e.message);
        notify(e.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [notify]);

  const handleAction = (action: string, revellerId: string) => {
    notify(`Action '${action}' triggered for reveller '${revellerId}'.`, 'info');
    if (action === 'delete') {
      setRevellers(currentRevellers => currentRevellers.filter(r => r.id !== revellerId));
      notify(`Reveller ${revellerId} was successfully deleted.`, 'success');
    }
  };

  if (isLoading) return <div className="text-center p-8 text-kala-400">Loading reveller data...</div>;
  if (error) return <div className="text-center p-8 text-red-500 bg-red-500/10 rounded-lg">Error: {error}</div>;

  return (
    <Table className="bg-kala-900 text-white rounded-lg p-6">
      <TableCaption>Real-time reveller data.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Tickets Purchased</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {revellers.map((reveller) => (
          <TableRow key={reveller.id}>
            <TableCell>{reveller.user?.name || 'N/A'}</TableCell>
            <TableCell>{reveller.tickets_purchased}</TableCell>
            <TableCell>{reveller.verified ? 'Yes' : 'No'}</TableCell>
            <TableCell className="text-right">
                <TableActions reveller={reveller} role={currentUserRole} onAction={handleAction} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RevellerRealDataTable;
