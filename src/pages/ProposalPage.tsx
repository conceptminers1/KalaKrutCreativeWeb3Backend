import React from 'react';
import ProposalRealDataTable from '@/components/tables/ProposalRealDataTable';

interface ProposalPageProps {
  onNavigate: (view: string) => void;
}

const ProposalPage: React.FC<ProposalPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white mb-1">Proposal Management</h1>
        <button
          onClick={() => onNavigate('dashboard')}
          className="bg-kala-secondary hover:bg-cyan-400 text-kala-900 font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
      <div id="proposal-tables" className="grid grid-cols-1 gap-8 mt-8">
        <ProposalRealDataTable data={[]} />
      </div>
    </div>
  );
};

export default ProposalPage;