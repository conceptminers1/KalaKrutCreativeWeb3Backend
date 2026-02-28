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
import { HumanResources, HRStatus } from '@/types/types';
import { Button } from '@/components/ui/Button';

const StatusPill: React.FC<{ status: HRStatus }> = ({ status }) => (
    <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            status === HRStatus.ACTIVE
                ? 'bg-green-500/20 text-green-300'
                : status === HRStatus.ON_LEAVE
                ? 'bg-yellow-500/20 text-yellow-300'
                : 'bg-red-500/20 text-red-300' // INACTIVE
        }`}
    >
        {status}
    </span>
);

const HRDRealDataTable = ({ data }: { data: HumanResources[] }) => {
  return (
    <div className="bg-kala-900 text-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Real HR Data</h2>
      <Table className="bg-kala-900 text-white rounded-lg p-6">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((hr) => (
            <TableRow key={hr.id}>
              <TableCell>{hr.name}</TableCell>
              <TableCell>{hr.role}</TableCell>
              <TableCell><StatusPill status={hr.status} /></TableCell>
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

export default HRDRealDataTable;