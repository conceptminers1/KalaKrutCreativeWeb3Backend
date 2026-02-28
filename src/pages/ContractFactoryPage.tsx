import React from 'react';
import ContractFactoryRealDataTable from '@/components/tables/ContractFactoryRealDataTable';

interface ContractFactoryPageProps {
  onNavigate: (view: string) => void;
}

const ContractFactoryPage: React.FC<ContractFactoryPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white mb-1">Contract Factory Dashboard</h1>
        <button
          onClick={() => onNavigate('admin')}
          className="bg-kala-secondary hover:bg-cyan-400 text-kala-900 font-bold py-2 px-4 rounded"
        >
          Back to Admin
        </button>
      </div>
      <div id="contract-factory-tables" className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <ContractFactoryExamplesTable />
        <ContractFactoryRealDataTable />
      </div>
    </div>
  );
};

export default ContractFactoryPage;