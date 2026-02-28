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
import { ArtistProfile, UserRole } from '@/types/types';
import { useToast } from '@/contexts/ToastContext';

const ActionButton: React.FC<{ onClick: () => void; className: string; children: React.ReactNode }> = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${className}`}>
    {children}
  </button>
);

const TableActions: React.FC<{ 
  artist: ArtistProfile;
  role: UserRole; 
  onAction: (action: string, artistId: string) => void;
}> = ({ artist, role, onAction }) => {

  const handleAction = (action: string) => {
    onAction(action, artist.id);
  };

  // Only render buttons for Admin roles
  if (role === UserRole.ADMIN || role === UserRole.SYSTEM_ADMIN_LIVE) {
    return (
        <div className="space-x-2">
          <ActionButton onClick={() => handleAction('edit')} className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/40">Edit</ActionButton>
          <ActionButton onClick={() => handleAction('delete')} className="bg-red-500/20 text-red-300 hover:bg-red-500/40">Delete</ActionButton>
        </div>
      );
  }
  
  // Return null for all other roles, so no buttons are displayed
  return null;
};


const ArtistRealDataTable = ({ currentUserRole }: { currentUserRole: UserRole }) => {
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/artists.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch artists: ${response.statusText}`);
        }
        const data: ArtistProfile[] = await response.json();
        setArtists(data);
      } catch (e: any) {
        setError(e.message);
        notify(e.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [notify]);

  const handleAction = (action: string, artistId: string) => {
    notify(`Action '${action}' triggered for artist '${artistId}'.`, 'info');
    if (action === 'delete') {
      setArtists(currentArtists => currentArtists.filter(a => a.id !== artistId));
      notify(`Artist ${artistId} was successfully deleted.`, 'success');
    }
  };

  if (isLoading) return <div className="text-center p-8 text-kala-400">Loading artist data...</div>;
  if (error) return <div className="text-center p-8 text-red-500 bg-red-500/10 rounded-lg">Error: {error}</div>;

  return (
    <Table className="bg-kala-900 text-white rounded-lg p-6">
      <TableCaption>Real-time artist data.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Genre</TableHead>
          <TableHead>Bio</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {artists.map((profile) => (
          <TableRow key={profile.id}>
            <TableCell>{profile.user?.name || 'N/A'}</TableCell>
            <TableCell>{profile.genre || 'N/A'}</TableCell>
            <TableCell className="max-w-xs truncate">{profile.bio || 'N/A'}</TableCell>
            <TableCell className="text-right">
              <TableActions artist={profile} role={currentUserRole} onAction={handleAction} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ArtistRealDataTable;
