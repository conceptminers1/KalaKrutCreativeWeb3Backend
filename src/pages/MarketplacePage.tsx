import React from 'react';
import MarketplaceRealDataTable from '@/components/tables/MarketplaceRealDataTable';
import { useData } from '@/contexts/DataContext';
import { UserRole } from '@/types/types';

interface MarketplacePageProps {
  onNavigate: (view: string) => void;
  currentUserId: string;
  currentUserRole: UserRole;
}

const MarketplacePage: React.FC<MarketplacePageProps> = ({ onNavigate, currentUserId, currentUserRole }) => {
  const { marketItems } = useData();
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white mb-1">Marketplace Management</h1>
        <button
          onClick={() => onNavigate('dashboard')}
          className="bg-kala-secondary hover:bg-cyan-400 text-kala-900 font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
      <div id="marketplace-tables" className="grid grid-cols-1 gap-8 mt-8">
        <MarketplaceRealDataTable data={marketItems} currentUserId={currentUserId} currentUserRole={currentUserRole} />
      </div>
    </div>
  );
};

export default MarketplacePage;
