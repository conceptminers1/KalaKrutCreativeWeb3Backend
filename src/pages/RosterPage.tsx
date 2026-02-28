
import React from 'react';
import ArtistRealDataTable from '@/components/tables/ArtistRealDataTable';
import SponsorRealDataTable from '@/components/tables/SponsorRealDataTable';
import RevellerRealDataTable from '@/components/tables/RevellerRealDataTable';
import OrganizerRealDataTable from '@/components/tables/OrganizerRealDataTable';
import DAOMemberRealDataTable from '@/components/tables/DAOMemberRealDataTable';
import DaoGovernorRealDataTable from '@/components/tables/DaoGovernorRealDataTable';
import { MOCK_ROSTER, MOCK_PROPOSALS } from '@/mockData';
import { UserRole, ItemStatus } from '@/types/types';
import { Button } from '@/components/ui/Button';

interface RosterPageProps {
  onNavigate: (view: string) => void;
}

const RosterPage: React.FC<RosterPageProps> = ({ onNavigate }) => {
  const artists = MOCK_ROSTER.filter((member) => member.role === UserRole.ARTIST);
  const sponsors = MOCK_ROSTER.filter((member) => member.role === UserRole.SPONSOR);
  const revellers = MOCK_ROSTER.filter((member) => member.role === UserRole.REVELLER);
  const organizers = MOCK_ROSTER.filter((member) => member.role === UserRole.ORGANIZER);
  const daoMembers = MOCK_ROSTER.filter((member) => member.role === UserRole.DAO_MEMBER);

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white mb-1">Roster Management</h1>
        <div className="flex space-x-2">
          <Button onClick={() => onNavigate('roster_analytics')}>View Analytics</Button>
          <Button onClick={() => onNavigate('dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
      <div id="roster-tables" className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Artists</h2>
          <ArtistRealDataTable data={artists} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Sponsors</h2>
          <SponsorRealDataTable data={sponsors} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Revellers</h2>
          <RevellerRealDataTable data={revellers} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Organizers</h2>
          <OrganizerRealDataTable data={organizers} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">DAO Members</h2>
          <DAOMemberRealDataTable data={daoMembers} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">DAO Governance</h2>
          <DaoGovernorRealDataTable data={MOCK_PROPOSALS} />
        </div>
      </div>
    </div>
  );
};

export default RosterPage;
