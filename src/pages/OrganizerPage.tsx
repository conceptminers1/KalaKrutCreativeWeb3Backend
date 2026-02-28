import React from 'react';
import OrganizerRealDataTable from '@/components/tables/OrganizerRealDataTable';
import { UserRole } from '@/types/types';

interface OrganizerPageProps {
  onNavigate: (view: string) => void;
  currentUserRole: UserRole;
}

const OrganizerPage: React.FC<OrganizerPageProps> = ({ onNavigate, currentUserRole }) => {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white mb-1">Organizer Dashboard</h1>
        <button
          onClick={() => onNavigate('dashboard')}
          className="bg-kala-secondary hover:bg-cyan-400 text-kala-900 font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
      <div id="organizer-tables" className="grid grid-cols-1 gap-8 mt-8">
        <OrganizerRealDataTable currentUserRole={currentUserRole} />
      </div>
    </div>
  );
};

export default OrganizerPage;