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
import { DaoGovernorProfile, UserRole } from '@/types/types';
import { useToast } from '@/contexts/ToastContext';

const ActionButton: React.FC<{ onClick: () => void; className: string; children: React.ReactNode }> = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${className}`}>
    {children}
  </button>
);

const TableActions: React.FC<{ 
  governor: DaoGovernorProfile;
  role: UserRole; 
  onAction: (action: string, governorId: string) => void;
}> = ({ governor, role, onAction }) => {

  const handleAction = (action: string) => {
    onAction(action, governor.id);
  };

  if (role === UserRole.SYSTEM_ADMIN_LIVE) {
    return (
        <div className="space-x-2">
          <ActionButton onClick={() => handleAction('edit')} className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/40">Edit</ActionButton>
          <ActionButton onClick={() => handleAction('delete')} className="bg-red-500/20 text-red-300 hover:bg-red-500/40">Delete</ActionButton>
        </div>
      );
  }
  
  return null;
};

const DaoGovernorRealDataTable = ({ currentUserRole }: { currentUserRole: UserRole }) => {
  const [governors, setGovernors] = useState<DaoGovernorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/dao-governors.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch DAO governors: ${response.statusText}`);
        }
        const data: DaoGovernorProfile[] = await response.json();
        setGovernors(data);
      } catch (e: any) {
        setError(e.message);
        notify(e.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [notify]);

  const handleAction = (action: string, governorId: string) => {
    notify(`Action '${action}' triggered for DAO governor '${governorId}'.`, 'info');
    if (action === 'delete') {
      setGovernors(currentGovernors => currentGovernors.filter(g => g.id !== governorId));
      notify(`DAO Governor ${governorId} was successfully deleted.`, 'success');
    }
  };

  if (isLoading) return <div className="text-center p-8 text-kala-400">Loading DAO governor data...</div>;
  if (error) return <div className="text-center p-8 text-red-500 bg-red-500/10 rounded-lg">Error: {error}</div>;

  return (
    <Table className="bg-kala-900 text-white rounded-lg p-6">
      <TableCaption>Real-time DAO governor data.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Proposals Created</TableHead>
          <TableHead>Votes Cast</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {governors.map((governor) => (
          <TableRow key={governor.id}>
            <TableCell>{governor.user?.name || 'N/A'}</TableCell>
            <TableCell>{governor.proposals_created}</TableCell>
            <TableCell>{governor.votes_cast}</TableCell>
            <TableCell className="text-right">
                <TableActions governor={governor} role={currentUserRole} onAction={handleAction} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DaoGovernorRealDataTable;
