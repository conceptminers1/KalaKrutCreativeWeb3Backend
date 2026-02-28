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
import { SponsorProfile, UserRole } from '@/types/types';
import { useToast } from '@/contexts/ToastContext';

const ActionButton: React.FC<{ onClick: () => void; className: string; children: React.ReactNode }> = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${className}`}>
    {children}
  </button>
);

const TableActions: React.FC<{ 
  sponsor: SponsorProfile;
  role: UserRole; 
  onAction: (action: string, sponsorId: string) => void;
}> = ({ sponsor, role, onAction }) => {

  const handleAction = (action: string) => {
    onAction(action, sponsor.id);
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

const SponsorRealDataTable = ({ currentUserRole }: { currentUserRole: UserRole }) => {
  const [sponsors, setSponsors] = useState<SponsorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/sponsors.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch sponsors: ${response.statusText}`);
        }
        const data: SponsorProfile[] = await response.json();
        setSponsors(data);
      } catch (e: any) {
        setError(e.message);
        notify(e.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [notify]);

  const handleAction = (action: string, sponsorId: string) => {
    notify(`Action '${action}' triggered for sponsor '${sponsorId}'.`, 'info');
    if (action === 'delete') {
      setSponsors(currentSponsors => currentSponsors.filter(s => s.id !== sponsorId));
      notify(`Sponsor ${sponsorId} was successfully deleted.`, 'success');
    }
  };

  if (isLoading) return <div className="text-center p-8 text-kala-400">Loading sponsor data...</div>;
  if (error) return <div className="text-center p-8 text-red-500 bg-red-500/10 rounded-lg">Error: {error}</div>;

  return (
    <Table className="bg-kala-900 text-white rounded-lg p-6">
      <TableCaption>Real-time sponsor data.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Sponsorship Level</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sponsors.map((sponsor) => (
          <TableRow key={sponsor.id}>
            <TableCell>{sponsor.user?.name || 'N/A'}</TableCell>
            <TableCell>{sponsor.sponsorship_level}</TableCell>
            <TableCell>{sponsor.verified ? 'Yes' : 'No'}</TableCell>
            <TableCell className="text-right">
                <TableActions sponsor={sponsor} role={currentUserRole} onAction={handleAction} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SponsorRealDataTable;
