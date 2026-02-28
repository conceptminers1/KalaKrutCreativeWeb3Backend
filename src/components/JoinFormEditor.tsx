import React from 'react';
import ArtistForm from './ArtistForm';
import VenueForm from './VenueForm';
import OrganizerForm from './OrganizerForm';
import SponsorForm from './SponsorForm';
import ServiceProviderForm from './ServiceProviderForm';
import RevellerForm from './RevellerForm';
import { UserRole } from '../types';
import { IUser } from '../data/users';

interface JoinFormEditorProps {
  user: IUser;
  onComplete: () => void;
  onBlockUser: () => void;
}

const JoinFormEditor: React.FC<JoinFormEditorProps> = ({ user, onComplete, onBlockUser }) => {

  const getOriginalRole = (user: IUser): UserRole | null => {
    // Check for properties that uniquely identify a user's original role.
    if (user.hasOwnProperty('artistName')) return UserRole.ARTIST;
    if (user.hasOwnProperty('venueName')) return UserRole.VENUE;
    if (user.hasOwnProperty('organizerName')) return UserRole.ORGANIZER;
    if (user.hasOwnProperty('sponsorName')) return UserRole.SPONSOR;
    if (user.hasOwnProperty('serviceProviderName')) return UserRole.SERVICE_PROVIDER;
    if (user.hasOwnProperty('interests')) return UserRole.REVELLER;
    return null;
  };

  const renderFormForRole = () => {
    const props = { 
      onComplete,
      // @ts-ignore 
      initialData: user, 
      mode: 'edit' as const,
      onBlockUser,
    };
    
    let effectiveRole = user.role;

    // For users with elevated permissions, find their original, editable profile type.
    if ([UserRole.ADMIN, UserRole.DAO_MEMBER, UserRole.DAO_GOVERNOR].includes(user.role)) {
      effectiveRole = getOriginalRole(user) || user.role;
    }

    switch (effectiveRole) {
      case UserRole.ARTIST:
        return <ArtistForm {...props} />;
      case UserRole.VENUE:
        return <VenueForm {...props} />;
      case UserRole.ORGANIZER:
        return <OrganizerForm {...props} />;
      case UserRole.SPONSOR:
        return <SponsorForm {...props} />;
      case UserRole.SERVICE_PROVIDER:
        return <ServiceProviderForm {...props} />;
      case UserRole.REVELLER:
        return <RevellerForm {...props} />;
      default:
        return <p className="text-yellow-400">Profile editing is not available for this role, or the original user profile could not be determined.</p>;
    }
  };

  return <div>{renderFormForRole()}</div>;
};

export default JoinFormEditor;