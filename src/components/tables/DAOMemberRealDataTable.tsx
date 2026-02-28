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
import { DaoMemberProfile, UserRole } from '@/types/types';
import { useToast } from '@/contexts/ToastContext';

const ActionButton: React.FC<{ onClick: () => void; className: string; children: React.ReactNode }> = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${className}`}>
    {children}
  </button>
);

const TableActions: React.FC<{ 
  member: DaoMemberProfile;
  role: UserRole; 
  onAction: (action: string, memberId: string) => void;
}> = ({ member, role, onAction }) => {

  const handleAction = (action: string) => {
    onAction(action, member.id);
  };

  if (role === UserRole.ADMIN || role === UserRole.SYSTEM_ADMIN_LIVE) {
    return (
        <div className="space-x-2">
          <ActionButton onClick={() => handleAction('edit')} className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/40">Edit</ActionButton>
          <ActionButton onClick={() => handleAction('delete')} className="bg-red-500/20 text-red-300 hover:bg-red-500/40">Delete</ActionButton>
        </div>
      );
  }
  
  return null; // No actions for other roles
};

const DAOMemberRealDataTable = ({ currentUserRole }: { currentUserRole: UserRole }) => {
  const [members, setMembers] = useState<DaoMemberProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/dao-members.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch DAO members: ${response.statusText}`);
        }
        const data: DaoMemberProfile[] = await response.json();
        setMembers(data);
      } catch (e: any) {
        setError(e.message);
        notify(e.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [notify]);

  const handleAction = (action: string, memberId: string) => {
    notify(`Action '${action}' triggered for member '${memberId}'.`, 'info');
    if (action === 'delete') {
      setMembers(currentMembers => currentMembers.filter(m => m.id !== memberId));
      notify(`DAO Member ${memberId} was successfully deleted.`, 'success');
    }
  };

  if (isLoading) return <div className="text-center p-8 text-kala-400">Loading DAO member data...</div>;
  if (error) return <div className="text-center p-8 text-red-500 bg-red-500/10 rounded-lg">Error: {error}</div>;

  return (
    <Table className="bg-kala-900 text-white rounded-lg p-6">
      <TableCaption>Real-time DAO member data.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Voting Power</TableHead>
          <TableHead>Joined At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>{member.user?.name || 'N/A'}</TableCell>
            <TableCell>{member.votingPower}</TableCell>
            <TableCell>{new Date(member.joinedAt).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
                <TableActions member={member} role={currentUserRole} onAction={handleAction} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DAOMemberRealDataTable;
