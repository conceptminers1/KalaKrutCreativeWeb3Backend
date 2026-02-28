import React from 'react';
import HRDRealDataTable from '@/components/tables/HRDRealDataTable';

interface HRDPageProps {
  onNavigate: (view: string) => void;
}

const HRDPage: React.FC<HRDPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white mb-1">HRD Dashboard</h1>
        <button
          onClick={() => onNavigate('dashboard')}
          className="bg-kala-secondary hover:bg-cyan-400 text-kala-900 font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
      <div id="hrd-tables" className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <HRDRealDataTable data={[]} />
      </div>
    </div>
  );
};

export default HRDPage;