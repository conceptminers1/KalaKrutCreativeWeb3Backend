import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/tables/Table";
import { Button } from '@/components/ui/button';
import { ArtistProfile } from '@/types/types';

const RosterRealDataTable = ({ data = [] }: { data: ArtistProfile[] }) => {
  return (
    <div className="bg-kala-900 text-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Real Roster Data</h2>
      <Table className="bg-kala-900 text-white rounded-lg p-6">
        <TableHeader>
          <TableRow>
            <TableHead>Artist Name</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Bio</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>{profile.user?.name || 'N/A'}</TableCell>
              <TableCell>{profile.genre || 'N/A'}</TableCell>
              <TableCell>{profile.bio || 'N/A'}</TableCell>
              <TableCell>
                <Button className="bg-kala-secondary text-kala-900 px-4 py-2 rounded-lg font-bold hover:bg-cyan-400 transition-colors">View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RosterRealDataTable;