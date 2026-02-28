import React from 'react';
import ArtistPage from '@/pages/ArtistPage';
import DAOMemberPage from '@/pages/DAOMemberPage';
import DAOProposalPage from '@/pages/DAOProposalPage';
import DaoGovernorPage from '@/pages/DaoGovernorPage';
import EventPage from '@/pages/EventPage';
import EventTicketPage from '@/pages/EventTicketPage';
import HRDPage from '@/pages/HRDPage';
import OrganizerPage from '@/pages/OrganizerPage';
import RevellerPage from '@/pages/RevellerPage';
import ServiceProviderPage from '@/pages/ServiceProviderPage';
import SponsorPage from '@/pages/SponsorPage';
import SupportRequestsPage from '@/pages/SupportRequestsPage';
import TreasuryPage from '@/pages/TreasuryPage';
import VenuePage from '@/pages/VenuePage';
import ProposalPage from '@/pages/ProposalPage';
import RosterBookingPage from '@/pages/RosterBookingPage';
import MarketplacePage from '@/pages/MarketplacePage';
import RosterPage from '@/pages/RosterPage';
import { UserRole } from '@/types/types';

interface TablesPageProps {
  activeView: string;
  onNavigate: (view: string) => void;
  currentUserRole: UserRole;
  currentUserId: string;
}

const TablesPage: React.FC<TablesPageProps> = ({ activeView, onNavigate, currentUserRole, currentUserId }) => {
  const passProps = { onNavigate, currentUserRole, currentUserId };

  switch (activeView) {
    case 'artists':
      return <ArtistPage {...passProps} />;
    case 'dao-members':
      return <DAOMemberPage {...passProps} />;
    case 'dao-proposals':
      return <DAOProposalPage {...passProps} />;
    case 'dao-governors':
      return <DaoGovernorPage {...passProps} />;
    case 'events':
      return <EventPage {...passProps} />;
    case 'event-tickets':
      return <EventTicketPage {...passProps} />;
    case 'hrds':
      return <HRDPage {...passProps} />;
    case 'organizers':
      return <OrganizerPage {...passProps} />;
    case 'revellers':
      return <RevellerPage {...passProps} />;
    case 'service-providers':
      return <ServiceProviderPage {...passProps} />;
    case 'sponsors':
      return <SponsorPage {...passProps} />;
    case 'support-requests':
      return <SupportRequestsPage {...passProps} />;
    case 'treasury':
      return <TreasuryPage {...passProps} />;
    case 'venues':
      return <VenuePage {...passProps} />;
    case 'proposals':
        return <ProposalPage {...passProps} />;
    case 'roster-bookings':
        return <RosterBookingPage {...passProps} />;
    case 'marketplace':
        return <MarketplacePage {...passProps} />;
    case 'roster':
        return <RosterPage {...passProps} />;
    default:
      return <div className="text-center p-8 text-kala-400">Select a table from the navigation to view its data.</div>;
  }
};

export default TablesPage;
