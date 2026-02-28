import React from 'react';
import EventTicketRealDataTable from '@/components/tables/EventTicketRealDataTable';

interface EventTicketPageProps {
  onNavigate: (view: string) => void;
}

const EventTicketPage: React.FC<EventTicketPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white mb-1">Event Ticket Management</h1>
        <button
          onClick={() => onNavigate('dashboard')}
          className="bg-kala-secondary hover:bg-cyan-400 text-kala-900 font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
      <div id="event-ticket-tables" className="grid grid-cols-1 gap-8 mt-8">
        <EventTicketRealDataTable />
      </div>
    </div>
  );
};

export default EventTicketPage;