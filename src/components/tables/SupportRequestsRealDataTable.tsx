import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/tables/Table";
import { Button } from '@/components/ui/Button';

const SupportRequestsRealDataTable: React.FC = () => {
  // Mock data for demonstration
  const supportRequests = [
    {
      id: '1',
      user: 'John Doe',
      request: 'Cannot login',
      status: 'Open'
    },
    {
      id: '2',
      user: 'Jane Smith',
      request: 'Payment issue',
      status: 'Closed'
    },
    {
      id: '3',
      user: 'Peter Jones',
      request: 'Profile update failed',
      status: 'Open'
    },
    {
      id: '4',
      user: 'Mary Johnson',
      request: 'How to use the marketplace',
      status: 'In Progress'
    }
  ];

  const handleResolve = (id: string) => {
    // In a real app, you'd update the state or call an API
    console.log(`Resolving request ${id}`);
  };

  const handleEscalate = (id: string) => {
    // In a real app, you'd update the state or call an API
    console.log(`Escalating request ${id}`);
  };

  return (
    <div className="bg-kala-900 text-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Support Requests</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Request</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supportRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-mono text-xs">{request.id}</TableCell>
              <TableCell className="font-medium">{request.user}</TableCell>
              <TableCell>{request.request}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 text-xs font-bold rounded-full ${
                    request.status === 'Open' ? 'bg-yellow-500/20 text-yellow-300' :
                    request.status === 'Closed' ? 'bg-green-500/20 text-green-300' :
                    'bg-blue-500/20 text-blue-300' // In Progress
                  }`}
                >
                  {request.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                    {request.status !== 'Closed' && (
                        <>
                            <Button variant="outline" size="sm" onClick={() => handleResolve(request.id)}>
                                Resolve
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleEscalate(request.id)}>
                                Escalate
                            </Button>
                        </>
                    )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SupportRequestsRealDataTable;
