import React from 'react';
import useAuth from '@/hooks/useAuth';
import { useData } from '@/hooks/useData';
import ArtistRealDataTable from '@/components/tables/ArtistRealDataTable';
import VenueRealDataTable from '@/components/tables/VenueRealDataTable';
import ServiceProviderRealDataTable from '@/components/tables/ServiceProviderRealDataTable';
import OrganizerRealDataTable from '@/components/tables/OrganizerRealDataTable';
import SponsorRealDataTable from '@/components/tables/SponsorRealDataTable';
import RevellerRealDataTable from '@/components/tables/RevellerRealDataTable';
import DaoGovernorRealDataTable from '@/components/tables/DaoGovernorRealDataTable';
import DAOMemberRealDataTable from '@/components/tables/DAOMemberRealDataTable';
import EventTicketRealDataTable from '@/components/tables/EventTicketRealDataTable';
import TransactionRealDataTable from '@/components/tables/TransactionRealDataTable';
import { UserRole, ItemStatus } from '@/types';

const DashboardPage: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { users, proposals, marketItems } = useData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
            <button
                onClick={() => onNavigate('tickets')}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
                Tickets
            </button>
            <button
                onClick={() => onNavigate('services')}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
                Services
            </button>
            {user?.role === UserRole.ADMIN && (
              <button
                onClick={() => onNavigate('admin')}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Admin Page
              </button>
            )}
        </div>
      </div>
      {user && <p className="mb-8">Welcome, {user.email}!</p>}

      {user && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ArtistRealDataTable currentUserRole={user.role} />
            <VenueRealDataTable currentUserRole={user.role} />
            <ServiceProviderRealDataTable currentUserRole={user.role} />
            <OrganizerRealDataTable currentUserRole={user.role} />
            <SponsorRealDataTable currentUserRole={user.role} />
            <RevellerRealDataTable currentUserRole={user.role} />
            <DaoGovernorRealDataTable currentUserRole={user.role} />
            <EventTicketRealDataTable currentUserRole={user.role} />
            {(user.role === UserRole.DAO_MEMBER || user.role === UserRole.DAO_GOVERNOR) && (
              <DAOMemberRealDataTable currentUserRole={user.role} />
            )}
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Transaction History</h2>
            <TransactionRealDataTable currentUserRole={user.role} />
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
