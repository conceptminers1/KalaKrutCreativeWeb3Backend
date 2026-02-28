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
import { Contract } from '@/types/types';

const ContractFactoryRealDataTable = ({ data = [] }: { data: Contract[] }) => {
  return (
    <Table>
      <TableCaption>Real-time contract factory data.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((contract) => (
          <TableRow key={contract.id}>
            <TableCell>{contract.title}</TableCell>
            <TableCell>{contract.status}</TableCell>
            <TableCell>{new Date(contract.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <button className="bg-kala-secondary text-kala-900 px-4 py-2 rounded-lg font-bold hover:bg-cyan-400 transition-colors">View</button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ContractFactoryRealDataTable;