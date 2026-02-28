import React from 'react';
import RevellerRealDataTable from '@/components/tables/RevellerRealDataTable';
import { MOCK_USERS_BY_ROLE } from '@/mockData';
import { UserRole, ItemStatus } from '@/types/types';

interface RevellerPageProps {
  onNavigate: (view: string) => void;
}

const RevellerPage: React.FC<RevellerPageProps> = ({ onNavigate }) => {
  const revellerData = Object.values(MOCK_USERS_BY_ROLE).filter(
    (user) => user.role === UserRole.REVELLER
  );

  // Since MOCK_USERS_BY_ROLE gives us ArtistProfile, we need to adapt it
  // to the User type. In a real application, the API would return the correct User objects.
  const revellersForTable = revellerData.map(profile => ({
      id: profile.id,
      name: profile.name,
      email: `${profile.id}@kalakrut.com`, // mock email
      role: profile.role,
      ownedTickets: [], // mock data
      ownedNFTs: [], // mock data
      ownedFractions: [], // mock data
      // other User fields would be here
  }));


  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white mb-1">Reveller Dashboard</h1>
        <button
          onClick={() => onNavigate('dashboard')}
          className="bg-kala-secondary hover:bg-cyan-400 text-kala-900 font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
      <div id="reveller-tables" className="grid grid-cols-1 gap-8 mt-8">
        <RevellerRealDataTable data={revellersForTable} />
      </div>
    </div>
  );
};

export default RevellerPage;