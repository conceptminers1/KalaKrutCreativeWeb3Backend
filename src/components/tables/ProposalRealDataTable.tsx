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
import { Button } from '@/components/ui/Button';
import { Proposal, ProposalStatus } from '@/types/types';

const StatusPill: React.FC<{ status: ProposalStatus }> = ({ status }) => (
    <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            status === ProposalStatus.ACCEPTED
                ? 'bg-green-500/20 text-green-300'
                : status === ProposalStatus.REJECTED
                ? 'bg-red-500/20 text-red-300'
                : 'bg-yellow-500/20 text-yellow-300' // PENDING
        }`}
    >
        {status}
    </span>
);

const ProposalRealDataTable = ({ data }: { data: Proposal[] }) => {
  return (
    <div className="bg-kala-900 text-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Real Proposal Data</h2>
      <Table className="bg-kala-900 text-white rounded-lg p-6">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((proposal) => (
            <TableRow key={proposal.id}>
              <TableCell>{proposal.title}</TableCell>
              <TableCell>{proposal.from.name}</TableCell>
              <TableCell>{proposal.to.name}</TableCell>
              <TableCell><StatusPill status={proposal.status} /></TableCell>
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

export default ProposalRealDataTable;