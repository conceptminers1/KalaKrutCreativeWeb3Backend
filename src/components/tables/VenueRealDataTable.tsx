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
import { VenueProfile, UserRole } from '@/types/types';
import { useToast } from '@/contexts/ToastContext';

const ActionButton: React.FC<{ onClick: () => void; className: string; children: React.ReactNode }> = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${className}`}>
    {children}
  </button>
);

const TableActions: React.FC<{ 
  venue: VenueProfile;
  role: UserRole; 
  onAction: (action: string, venueId: string) => void;
}> = ({ venue, role, onAction }) => {

  const handleAction = (action: string) => {
    onAction(action, venue.id);
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

const VenueRealDataTable = ({ currentUserRole }: { currentUserRole: UserRole }) => {
  const [venues, setVenues] = useState<VenueProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/venues.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch venues: ${response.statusText}`);
        }
        const data: VenueProfile[] = await response.json();
        setVenues(data);
      } catch (e: any) {
        setError(e.message);
        notify(e.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [notify]);

  const handleAction = (action: string, venueId: string) => {
    notify(`Action '${action}' triggered for venue '${venueId}'.`, 'info');
    if (action === 'delete') {
      setVenues(currentVenues => currentVenues.filter(v => v.id !== venueId));
      notify(`Venue ${venueId} was successfully deleted.`, 'success');
    }
  };

  if (isLoading) return <div className="text-center p-8 text-kala-400">Loading venue data...</div>;
  if (error) return <div className="text-center p-8 text-red-500 bg-red-500/10 rounded-lg">Error: {error}</div>;

  return (
    <Table className="bg-kala-900 text-white rounded-lg p-6">
      <TableCaption>Real-time venue data.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {venues.map((venue) => (
          <TableRow key={venue.id}>
            <TableCell>{venue.user?.name || 'N/A'}</TableCell>
            <TableCell>{venue.location}</TableCell>
            <TableCell>{venue.verified ? 'Yes' : 'No'}</TableCell>
            <TableCell className="text-right">
                <TableActions venue={venue} role={currentUserRole} onAction={handleAction} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default VenueRealDataTable;
