import React from 'react';
import SupportRequestsRealDataTable from '@/components/tables/SupportRequestsRealDataTable';

interface SupportRequestsPageProps {
  onNavigate: (view: string) => void;
}

const SupportRequestsPage: React.FC<SupportRequestsPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in bg-kala-900 text-white p-8 rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-1">Support Requests</h1>
        <button
          onClick={() => onNavigate('dashboard')}
          className="bg-kala-secondary hover:bg-cyan-400 text-kala-900 font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <SupportRequestsRealDataTable />
      </div>
    </div>
  );
};

export default SupportRequestsPage;