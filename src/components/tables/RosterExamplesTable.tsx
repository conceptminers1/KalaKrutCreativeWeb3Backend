import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/tabless';

const RosterExamplesTable: React.FC = () => {
  return (
    <div className="bg-kala-900 text-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Example Roster</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Artist ID</TableHead>
            <TableHead>Artist Name</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>ART-001</TableCell>
            <TableCell>DJ Beatmaster</TableCell>
            <TableCell>Electronic</TableCell>
            <TableCell>Available</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ART-002</TableCell>
            <TableCell>Rock On Band</TableCell>
            <TableCell>Rock</TableCell>
            <TableCell>Booked</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ART-003</TableCell>
            <TableCell>Jane Doe</TableCell>
            <TableCell>Acoustic</TableCell>
            <TableCell>Available</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default RosterExamplesTable;