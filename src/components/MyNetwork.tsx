import React from 'react';
import { Users, Briefcase, Mic, MapPin, Handshake, Shield, Mail } from 'lucide-react';
import { User, UserRole, ItemStatus } from '../types/types';
import { MOCK_GIGS, MOCK_USERS_BY_ROLE } from '../mockData';

const NetworkMemberCard = ({ name, role }: { name: string | null | undefined; role: string }) => {
    const getIcon = () => {
        switch (role) {
            case UserRole.ARTIST: return <Mic size={20} />;
            case UserRole.VENUE: return <MapPin size={20} />;
            case UserRole.ORGANIZER: return <Briefcase size={20} />;
            case UserRole.SERVICE_PROVIDER: return <Handshake size={20} />;
            default: return <Users size={20} />;
        }
    }

    return (
        <div className="bg-kala-800/50 border border-kala-700 rounded-lg p-4 flex items-center justify-between hover:bg-kala-800 transition-colors">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-kala-700 rounded-lg text-kala-300">
                    {getIcon()}
                </div>
                <div>
                    <p className="font-bold text-white">{name}</p>
                    <p className="text-sm text-kala-400">{role}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    className="p-2 bg-kala-700 hover:bg-kala-600 rounded-lg text-kala-300 hover:text-white transition-colors"
                    title={`Message ${name}`}
                >
                    <Mail className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};


interface MyNetworkProps {
  currentUser: User;
}

const MyNetwork: React.FC<MyNetworkProps> = ({ currentUser }) => {
  const connections = new Map<string, { user: User, connectionType: string }>();

  MOCK_GIGS.forEach(gig => {
    if (gig.artistId === currentUser.id) {
        const venueUser = MOCK_USERS_BY_ROLE[gig.venueId];
        if (venueUser) connections.set(venueUser.id, { user: venueUser, connectionType: 'Venues I\'ve Played At' });
    }
    if (gig.venueId === currentUser.id) {
        const artistUser = MOCK_USERS_BY_ROLE[gig.artistId];
        if (artistUser) connections.set(artistUser.id, { user: artistUser, connectionType: 'Artists Who Have Performed' });
    }
  });
  
  const groupedConnections = Array.from(connections.values()).reduce((acc, { user, connectionType }) => {
    if (!acc[connectionType]) {
      acc[connectionType] = [];
    }
    acc[connectionType].push(user);
    return acc;
  }, {} as { [key: string]: User[] });

  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="text-kala-secondary" /> My Network
        </h1>
        <p className="text-kala-400 mt-1">
            Your professional network based on past gigs and collaborations.
        </p>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 flex items-start gap-4">
        <Shield className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-200">
            <span className="font-bold">This page is private.</span> Your network is only visible to you. Others cannot see your professional connections.
        </p>
      </div>

      {Object.keys(groupedConnections).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedConnections).map(([connectionType, users]) => (
            <div key={connectionType}>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">{connectionType} ({users.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map(user => (
                        <NetworkMemberCard key={user.id} name={user.name} role={user.role} />
                    ))}
                </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-kala-700 rounded-lg">
            <h3 className="text-lg font-semibold text-white">No Network Activity Yet</h3>
            <p className="text-kala-400 mt-2">Complete a gig to start building your professional network.</p>
        </div>
      )}
    </div>
  );
};

export default MyNetwork;
