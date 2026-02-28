import React from 'react';

interface AdminPageProps {
  onNavigate: (view: string) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const tables = [
    { name: 'Leads', id: 'leads' },
    { name: 'Join Requests', id: 'join_requests' },
    { name: 'Artists', id: 'artists' },
    { name: 'DAO Members', id: 'dao-members' },
    { name: 'DAO Proposals', id: 'dao-proposals' },
    { name: 'DAO Governors', id: 'dao-governors' },
    { name: 'Events', id: 'events' },
    { name: 'Event Tickets', id: 'event-tickets' },
    { name: 'HRDs', id: 'hrds' },
    { name: 'Organizers', id: 'organizers' },
    { name: 'Revellers', id: 'revellers' },
    { name: 'Service Providers', id: 'service-providers' },
    { name: 'Sponsors', id: 'sponsors' },
    { name: 'Support Requests', id: 'support-requests' },
    { name: 'Treasury', id: 'treasury' },
    { name: 'Venues', id: 'venues' },
    { name: 'Proposals', id: 'proposals' },
    { name: 'Roster Bookings', id: 'roster-bookings' },
    { name: 'Marketplace', id: 'marketplace' },
    { name: 'Roster', id: 'roster' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
        <button
          onClick={() => onNavigate('dashboard')}
          className="bg-kala-secondary hover:bg-cyan-400 text-kala-900 font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => onNavigate(table.id)}
            className="bg-kala-900 hover:bg-kala-800 text-white font-bold py-6 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            {table.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
