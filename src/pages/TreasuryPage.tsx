import React, { useState } from 'react';
import TreasuryRealDataTable from '@/components/tables/TreasuryRealDataTable';
import TreasuryDashboard from '@/components/TreasuryDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

const TreasuryPage: React.FC = () => {
  const [activeView, setActiveView] = useState('management');
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Treasury</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveView('management')}
            className={`font-bold py-2 px-4 rounded ${activeView === 'management' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
            Management Dashboard
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`font-bold py-2 px-4 rounded ${activeView === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
            Treasury Ledger
          </button>
        </div>
      </div>

      {activeView === 'management' && (
        <TreasuryDashboard />
      )}

      {activeView === 'history' && (
        <TreasuryRealDataTable />
      )}
    </div>
  );
};

export default TreasuryPage;