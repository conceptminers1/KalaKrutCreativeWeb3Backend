import React from 'react';
import RosterBookingRealDataTable from '@/components/tables/RosterBookingRealDataTable';

interface RosterBookingPageProps {
  onNavigate: (view: string) => void;
}

const RosterBookingPage: React.FC<RosterBookingPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white mb-1">Roster Booking Management</h1>
        <button
          onClick={() => onNavigate('dashboard')}
          className="bg-kala-secondary hover:bg-cyan-400 text-kala-900 font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
      <div id="roster-booking-tables" className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <RosterBookingRealDataTable />
      </div>
    </div>
  );
};

export default RosterBookingPage;