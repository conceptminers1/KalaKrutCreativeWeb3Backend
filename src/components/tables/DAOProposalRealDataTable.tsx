import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";
import { Proposal, ProposalStatus, UserRole } from '@/types/types';
import { useToast } from '@/contexts/ToastContext';

const StatusPill: React.FC<{ status: ProposalStatus }> = ({ status }) => (
    <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            status === ProposalStatus.ACTIVE
                ? 'bg-green-500/20 text-green-300'
                : status === ProposalStatus.PENDING
                ? 'bg-yellow-500/20 text-yellow-300'
                : status === ProposalStatus.PASSED
                ? 'bg-blue-500/20 text-blue-300'
                : status === ProposalStatus.EXECUTED
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-red-500/20 text-red-300' // FAILED
        }`}
    >
        {status}
    </span>
);

const ActionButton: React.FC<{ onClick: () => void; className: string; children: React.ReactNode }> = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${className}`}>
    {children}
  </button>
);

const TableActions: React.FC<{ 
  proposal: Proposal; 
  role: UserRole; 
  onAction: (action: string, proposalId: string) => void;
}> = ({ proposal, role, onAction }) => {
  const handleAction = (action: string) => { onAction(action, proposal.id); };

  switch (role) {
    case UserRole.DAO_GOVERNOR:
      return (
        <div className="space-x-2">
          <ActionButton onClick={() => handleAction('approve')} className="bg-green-500/20 text-green-300 hover:bg-green-500/40">Approve</ActionButton>
          <ActionButton onClick={() => handleAction('reject')} className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/40">Reject</ActionButton>
        </div>
      );
    case UserRole.ADMIN:
    case UserRole.SYSTEM_ADMIN_LIVE:
      return (
        <div className="space-x-2">
          <ActionButton onClick={() => handleAction('review')} className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/40">Review</ActionButton>
          <ActionButton onClick={() => handleAction('delete')} className="bg-red-500/20 text-red-300 hover:bg-red-500/40">Delete</ActionButton>
        </div>
      );
    case UserRole.DAO_MEMBER:
      return <ActionButton onClick={() => handleAction('view')} className="bg-gray-500/20 text-gray-300 hover:bg-gray-500/40">View</ActionButton>;
    default:
      return null;
  }
};

const DAOProposalRealDataTable = ({ currentUserRole }: { currentUserRole: UserRole }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/dao-proposals.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Proposal[] = await response.json();
        setProposals(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAction = (action: string, proposalId: string) => {
    notify(`Action '${action}' triggered for proposal '${proposalId}'.`, 'info');
    if (action === 'delete') {
      setProposals(currentProposals => currentProposals.filter(p => p.id !== proposalId));
      notify(`Proposal ${proposalId} was successfully deleted.`, 'success');
    }
  };

  const getVoteCounts = (proposal: Proposal) => {
    const votesFor = proposal.votes.filter(v => v.choice === true).length;
    const votesAgainst = proposal.votes.filter(v => v.choice === false).length;
    return { votesFor, votesAgainst };
  };

  if (isLoading) return <div className="text-center p-8">Loading proposals...</div>;
  if (error) return <div className="text-center p-8 text-red-400">{error}</div>;

  return (
    <Table className="bg-kala-900 text-white rounded-lg p-6">
      <TableCaption>Real-time DAO proposals.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Proposer</TableHead>
          <TableHead>Votes For</TableHead>
          <TableHead>Votes Against</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {proposals.map((proposal) => {
          const { votesFor, votesAgainst } = getVoteCounts(proposal);
          return (
            <TableRow key={proposal.id}>
              <TableCell>{proposal.title}</TableCell>
              <TableCell>{proposal.proposer?.name || 'N/A'}</TableCell>
              <TableCell>{votesFor}</TableCell>
              <TableCell>{votesAgainst}</TableCell>
              <TableCell><StatusPill status={proposal.status} /></TableCell>
              <TableCell>{new Date(proposal.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <TableActions proposal={proposal} role={currentUserRole} onAction={handleAction} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default DAOProposalRealDataTable;
