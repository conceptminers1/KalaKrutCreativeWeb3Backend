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
import { EventTicket, UserRole } from '@/types/types';
import { useToast } from '@/contexts/ToastContext';

const ActionButton: React.FC<{ onClick: () => void; className: string; children: React.ReactNode }> = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${className}`}>
    {children}
  </button>
);

const TableActions: React.FC<{ 
  ticket: EventTicket;
  role: UserRole; 
  onAction: (action: string, ticketId: string) => void;
}> = ({ ticket, role, onAction }) => {

  const handleAction = (action: string) => {
    onAction(action, ticket.id);
  };

  if (role === UserRole.ADMIN || role === UserRole.SYSTEM_ADMIN_LIVE) {
    return (
        <div className="space-x-2">
          <ActionButton onClick={() => handleAction('invalidate')} className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/40">Invalidate</ActionButton>
          <ActionButton onClick={() => handleAction('delete')} className="bg-red-500/20 text-red-300 hover:bg-red-500/40">Delete</ActionButton>
        </div>
      );
  }
  
  return null;
};

const EventTicketRealDataTable = ({ currentUserRole }: { currentUserRole: UserRole }) => {
  const [tickets, setTickets] = useState<EventTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/event-tickets.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch event tickets: ${response.statusText}`);
        }
        const data: EventTicket[] = await response.json();
        setTickets(data);
      } catch (e: any) {
        setError(e.message);
        notify(e.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [notify]);

  const handleAction = (action: string, ticketId: string) => {
    notify(`Action '${action}' triggered for ticket '${ticketId}'.`, 'info');
    if (action === 'delete') {
      setTickets(currentTickets => currentTickets.filter(t => t.id !== ticketId));
      notify(`Ticket ${ticketId} was successfully deleted.`, 'success');
    }
    if (action === 'invalidate') {
        setTickets(currentTickets => currentTickets.map(t => t.id === ticketId ? { ...t, status: 'INVALIDATED' } : t));
        notify(`Ticket ${ticketId} has been invalidated.`, 'success');
    }
  };

  if (isLoading) return <div className="text-center p-8 text-kala-400">Loading ticket data...</div>;
  if (error) return <div className="text-center p-8 text-red-500 bg-red-500/10 rounded-lg">Error: {error}</div>;

  return (
    <Table className="bg-kala-900 text-white rounded-lg p-6">
      <TableCaption>Real-time event ticket data.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell>{ticket.event.name}</TableCell>
            <TableCell>{ticket.owner.name}</TableCell>
            <TableCell>{ticket.status}</TableCell>
            <TableCell className="text-right">
                <TableActions ticket={ticket} role={currentUserRole} onAction={handleAction} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EventTicketRealDataTable;
