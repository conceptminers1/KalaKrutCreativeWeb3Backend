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
import { Event, EventStatus } from '@/types/types';

const StatusPill: React.FC<{ status: EventStatus }> = ({ status }) => (
    <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            status === EventStatus.SCHEDULED
                ? 'bg-green-500/20 text-green-300'
                : status === EventStatus.CANCELLED
                ? 'bg-red-500/20 text-red-300'
                : 'bg-yellow-500/20 text-yellow-300' // PENDING
        }`}
    >
        {status}
    </span>
);

const EventRealDataTable = ({ data = [] }: { data: Event[] }) => {
  return (
    <div className="bg-kala-900 text-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Real Event Data</h2>
      <Table className="bg-kala-900 text-white rounded-lg p-6">
        <TableHeader>
          <TableRow>
            <TableHead>Event Name</TableHead>
            <TableHead>Starts</TableHead>
            <TableHead>Ends</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.name}</TableCell>
              <TableCell>{new Date(event.startTime).toLocaleString()}</TableCell>
              <TableCell>{new Date(event.endTime).toLocaleString()}</TableCell>
              <TableCell><StatusPill status={event.status} /></TableCell>
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

export default EventRealDataTable;