import React from 'react';
import EventRealDataTable from '@/components/tables/EventRealDataTable';

interface EventPageProps {
  onNavigate: (view: string) => void;
}

const EventPage: React.FC<EventPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white mb-1">Event Management</h1>
        <button
          onClick={() => onNavigate('dashboard')}
          className="bg-kala-secondary hover:bg-cyan-400 text-kala-900 font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
      <div id="event-tables" className="grid grid-cols-1 gap-8 mt-8">
        <EventRealDataTable />
      </div>
    </div>
  );
};

export default EventPage;