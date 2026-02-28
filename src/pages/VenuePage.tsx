import React from 'react';
import VenueRealDataTable from '@/components/tables/VenueRealDataTable';
import { UserRole } from '@/types/types';

interface VenuePageProps {
  onNavigate: (view: string) => void;
  currentUserRole: UserRole;
}

const VenuePage: React.FC<VenuePageProps> = ({ onNavigate, currentUserRole }) => {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white mb-1">Venue Dashboard</h1>
        <button
          onClick={() => onNavigate('dashboard')}
          className="bg-kala-secondary hover:bg-cyan-400 text-kala-900 font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
      <div id="venue-tables" className="grid grid-cols-1 gap-8 mt-8">
        <VenueRealDataTable currentUserRole={currentUserRole} />
      </div>
    </div>
  );
};

export default VenuePage;