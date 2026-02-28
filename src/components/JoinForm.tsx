import React, { useState } from 'react';
import { User, Briefcase, Building, Mic, Star, ShoppingCart, Wrench } from 'lucide-react';
import ArtistForm from './ArtistForm';
import VenueForm from './VenueForm';
import OrganizerForm from './OrganizerForm';
import SponsorForm from './SponsorForm';
import ServiceProviderForm from './ServiceProviderForm';
import RevellerForm from './RevellerForm';
import { UserRole } from '../types';

interface JoinFormProps {
  onComplete: () => void;
  onBlockUser: () => void;
}

const JoinForm: React.FC<JoinFormProps> = ({ onComplete, onBlockUser }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.ARTIST);

  const renderFormForRole = () => {
    switch (selectedRole) {
      case UserRole.ARTIST:
        return <ArtistForm onComplete={onComplete} onBlockUser={onBlockUser} />;
      case UserRole.VENUE:
        return <VenueForm onComplete={onComplete} onBlockUser={onBlockUser} />;
      case UserRole.ORGANIZER:
        return <OrganizerForm onComplete={onComplete} onBlockUser={onBlockUser} />;
      case UserRole.REVELLER:
        return <RevellerForm onComplete={onComplete} onBlockUser={onBlockUser} />;
      case UserRole.SPONSOR:
        return <SponsorForm onComplete={onComplete} onBlockUser={onBlockUser} />;
      case UserRole.SERVICE_PROVIDER:
          return <ServiceProviderForm onComplete={onComplete} onBlockUser={onBlockUser} />;
      default:
        return <p className="text-red-400">Please select a valid role.</p>;
    }
  };

  const RoleOption = ({ role, label, icon: Icon }) => (
    <button
        type="button"
        onClick={() => setSelectedRole(role)}
        className={`flex-1 p-4 rounded-lg text-center transition-all duration-300 border-2 ${
            selectedRole === role
            ? 'bg-kala-secondary/20 border-kala-secondary text-white scale-105'
            : 'bg-kala-800 border-kala-700 text-kala-400 hover:bg-kala-700/50 hover:border-kala-600'
        }`}>
        <Icon className="mx-auto mb-2 h-8 w-8" />
        <span className="font-bold text-sm">{label}</span>
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          Become a Part of the Movement
        </h1>
        <p className="text-kala-300 text-lg">
          Choose your role to begin the registration process.
        </p>
      </div>

      <div className="bg-kala-900/50 border border-kala-800 rounded-2xl p-6 md:p-8">
        <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase className="text-kala-secondary w-5 h-5" /> Select Your Role
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <RoleOption role={UserRole.ARTIST} label="Artist" icon={Mic} />
                <RoleOption role={UserRole.VENUE} label="Venue" icon={Building} />
                <RoleOption role={UserRole.ORGANIZER} label="Organizer" icon={User} />
                <RoleOption role={UserRole.REVELLER} label="Reveller" icon={Star} />
                <RoleOption role={UserRole.SPONSOR} label="Sponsor" icon={ShoppingCart} />
                <RoleOption role={UserRole.SERVICE_PROVIDER} label="Service" icon={Wrench} />
            </div>
        </div>

        <div className="border-t border-dashed border-kala-700 my-8"></div>
        
        {renderFormForRole()}
      </div>
    </div>
  );
};

export default JoinForm;
