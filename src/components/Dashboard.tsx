import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { ArtistProfile, UserRole, ItemStatus } from '../types/types';
import {
  DollarSign, Calendar, TrendingUp, Search, Tag, Upload, MessageSquare,
  CheckCircle, Rss, Wallet as WalletIcon, Bell, Table, Users, FileSignature,
  Landmark, Ticket, MapPin, Store, UserPlus, ArrowLeft
} from 'lucide-react';
import WalletHistory from './WalletHistory';
import JoinFormEditor from './JoinFormEditor';

interface DashboardProps {
  user: ArtistProfile;
  onNavigate: (view: string) => void;
}

const StatCard = ({ icon, title, value, sub, trend, primary = false }: any) => (
    <div
      className={`rounded-xl p-5 ${primary ? 'bg-green-500/10 border-green-500/30' : 'bg-kala-800/50 border-kala-700'} border transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-kala-900/50`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${primary ? 'text-green-200' : 'text-kala-400'}`}>{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${primary ? 'bg-green-500/20 text-green-300' : 'bg-kala-700 text-kala-300'}`}>
          {icon}
        </div>
      </div>
      <p className="text-xs text-kala-400 mt-3">{sub}</p>
      <p className={`text-xs font-bold mt-1 ${primary ? 'text-green-300' : 'text-green-400'}`}>{trend}</p>
    </div>
  );

  const ActionCard = ({ icon, title, subtitle, onClick }: any) => (
    <div
      onClick={onClick}
      className="bg-kala-800/50 border border-kala-700 rounded-xl p-5 text-center flex flex-col items-center justify-center gap-3 cursor-pointer group hover:bg-kala-800 transition-colors transform hover:-translate-y-1 duration-300"
    >
      <div className="text-cyan-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors">{title}</h4>
        <p className="text-xs text-kala-400">{subtitle}</p>
      </div>
    </div>
  );

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const { isConnected, open, address } = useWallet();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleProfileUpdateComplete = () => {
    setIsEditingProfile(false);
  };

  const handleBlockUser = () => {
    console.error("User blocked due to content violation during profile update.");
    setIsEditingProfile(false);
  };

  if (isEditingProfile) {
    return (
      <div className="animate-in fade-in bg-kala-900/50 p-4 sm:p-6 md:p-8 rounded-xl">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Update Your Profile</h1>
            <button 
              onClick={() => setIsEditingProfile(false)} 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-kala-700 hover:bg-kala-600 text-white font-semibold transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
        </div>
        <JoinFormEditor
          user={user}
          onComplete={handleProfileUpdateComplete}
          onBlockUser={handleBlockUser}
        />
      </div>
    );
  }
  
  const allTableNavItems = [
    // ADMIN ONLY
    { view: 'onboarding', label: 'Onboarding', icon: <UserPlus size={28}/>, roles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE] },
    { view: 'support-requests', label: 'Support', icon: <MessageSquare size={28}/>, roles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE] },
    { view: 'roster-bookings', label: 'Roster Bookings', icon: <Calendar size={28}/>, roles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE] },
    { view: 'hrds', label: 'HRDs', icon: <Users size={28}/>, roles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE] },
    { view: 'event-tickets', label: 'Event Tickets', icon: <Ticket size={28}/>, roles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE] },
    { view: 'admin', label: 'All Tables', icon: <Table size={28}/>, roles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE] },

    // DAO & CROSS-ROLE
    { view: 'contracts', label: 'Contracts & Agreements', icon: <FileSignature size={28}/>, roles: [
        UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE, UserRole.DAO_MEMBER, UserRole.DAO_GOVERNOR,
        UserRole.ARTIST, UserRole.VENUE, UserRole.SERVICE_PROVIDER, UserRole.ORGANIZER, UserRole.SPONSOR, UserRole.REVELLER
    ]},
    { view: 'proposals', label: 'Proposals', icon: <FileSignature size={28}/>, roles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE, UserRole.DAO_MEMBER, UserRole.DAO_GOVERNOR] },
    { view: 'treasury', label: 'Treasury', icon: <Landmark size={28}/>, roles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE, UserRole.DAO_GOVERNOR] },
    { view: 'dao-members', label: 'DAO Members', icon: <Users size={28}/>, roles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE, UserRole.DAO_MEMBER, UserRole.DAO_GOVERNOR] },
    { view: 'dao-governors', label: 'DAO Governors', icon: <Users size={28}/>, roles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE, UserRole.DAO_GOVERNOR] },

    // GENERAL ROLES
    { view: 'roster', label: 'Roster', icon: <Users size={28}/>, roles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE, UserRole.ARTIST, UserRole.DAO_MEMBER] },
    { view: 'artists', label: 'Artists', icon: <Users size={28}/>, roles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE, UserRole.VENUE, UserRole.SERVICE_PROVIDER, UserRole.REVELLER, UserRole.ORGANIZER, UserRole.SPONSOR] },
    { view: 'events', label: 'Events', icon: <Calendar size={28}/>, roles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE, UserRole.ARTIST, UserRole.VENUE, UserRole.SERVICE_PROVIDER, UserRole.REVELLER, UserRole.ORGANIZER, UserRole.SPONSOR] },
    { view: 'organizers', label: 'Organizers', icon: <Users size={28}/>, roles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE, UserRole.ARTIST, UserRole.VENUE, UserRole.SERVICE_PROVIDER, UserRole.SPONSOR] },
    { view: 'service-providers', label: 'Service Providers', icon: <Users size={28}/>, roles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE, UserRole.ORGANIZER] },
    { view: 'sponsors', label: 'Sponsors', icon: <Users size={28}/>, roles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE, UserRole.ARTIST, UserRole.VENUE, UserRole.ORGANIZER] },
    { view: 'venues', label: 'Venues', icon: <MapPin size={28}/>, roles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE, UserRole.ARTIST, UserRole.SERVICE_PROVIDER, UserRole.REVELLER, UserRole.ORGANIZER, UserRole.SPONSOR] },
    { view: 'marketplace', label: 'Marketplace', icon: <Store size={28}/>, roles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE, UserRole.REVELLER] },
    { view: 'revellers', label: 'Revellers', icon: <Users size={28}/>, roles: [UserRole.ADMIN, UserRole.SYSTEM_ADMIN_LIVE, UserRole.REVELLER] },
  ];

  const normalizeRole = (role: string) => role.toLowerCase().replace(/_|-|\s/g, '');

  const isUserAdmin = user && (user.role === UserRole.ADMIN || user.role === UserRole.SYSTEM_ADMIN_LIVE);
  const navItemsForUser = user && user.role
    ? allTableNavItems.filter(item => 
        item.roles.map(r => normalizeRole(r)).includes(normalizeRole(user.role))
      )
    : [];


  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Welcome back, {user.name}
          </h1>
          <p className="text-kala-400">
            Role: {user.role} • {user.location}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full bg-kala-800 hover:bg-kala-700 text-kala-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          {!isConnected ? (
            <button
              onClick={open}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-kala-secondary text-kala-900 font-bold hover:bg-cyan-400 transition-colors"
            >
              <WalletIcon className="w-5 h-5" />
              Connect Wallet
            </button>
          ) : (
            <div className="text-sm font-mono bg-kala-800/50 border border-kala-700 rounded-lg px-3 py-2 text-white">
              {address && `${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
            </div>
          )}
          <div
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-kala-secondary to-purple-600 p-0.5 cursor-pointer hover:scale-105 transition-transform ml-2"
            title="View My Profile"
          >
            <img
              src={user.avatar}
              alt="Me"
              className="w-full h-full rounded-full border-2 border-kala-900 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard primary icon={<DollarSign size={24} />} title="My Earnings (Fiat)" value="$28,500" sub="Stripe Balance (Available)" trend="+12.5% (30d)" />
        <StatCard icon={<Calendar size={24} />} title="Active Gigs" value="3" sub={<a href="#" onClick={(e) => { e.preventDefault(); onNavigate('booking');}} className="text-cyan-400 hover:underline">View Details</a>} trend=" " />
        <StatCard icon={<TrendingUp size={24} />} title="Community Score" value="Lvl 42" sub="Top 5% of Artists" trend=" " />
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <ActionCard icon={<Search size={28} />} title="Book Now" subtitle="Find & Select Artists" onClick={() => onNavigate('booking')} />
        <ActionCard icon={<Tag size={28} />} title="Sell / Auction" subtitle="List NFTs or Gear" onClick={() => onNavigate('marketplace')} />
        <ActionCard icon={<Upload size={28} />} title="Studio" subtitle="Upload & Mint" onClick={() => onNavigate('studio')} />
        <ActionCard icon={<MessageSquare size={28} />} title="Forum" subtitle="Community Chat" onClick={() => onNavigate('forum')} />
      </div>

      {/* Wallet History */}
      <div className="my-8">
        <WalletHistory currentUser={user} />
      </div>

      {/* Role-based Table Navigation */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Data Management</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {(isUserAdmin ? allTableNavItems : navItemsForUser).map(item => (
              <ActionCard
                  key={item.view}
                  icon={item.icon}
                  title={item.label}
                  subtitle={`View ${item.label} Data`}
                  onClick={() => onNavigate(item.view)}
              />
          ))}
        </div>
      </div>

      {/* Profile Update Prompt */}
      <div className="bg-kala-800/30 border border-dashed border-kala-600 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-full border border-green-500/20">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h4 className="font-bold text-white">Community Directory</h4>
            <p className="text-sm text-kala-400">Ensure your profile is up to date in the ArtistCatalog database for automated matchmaking.</p>
          </div>
        </div>
        <button onClick={() => setIsEditingProfile(true)} className="px-5 py-2.5 bg-kala-700 hover:bg-kala-600 border border-kala-500 rounded-lg text-white font-semibold text-sm transition-colors whitespace-nowrap">Update Profile</button>
      </div>

      {/* Go Mobile & Platform News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 flex items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-white">Go Mobile</h4>
            <p className="text-sm text-green-200/80 mt-1">Download the KalaKrut Android App for real-time notifications and mobile ticketing.</p>
            <button className="mt-4 px-4 py-2 bg-slate-200 text-black font-bold rounded-lg text-sm flex items-center gap-2 hover:bg-white">Get on Google Play</button>
          </div>
          <img src="/gplay-qr.png" alt="Google Play QR Code" className="w-24 h-24 object-contain" />
        </div>
        <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6 flex flex-col">
          <h4 className="font-bold text-white">Platform News</h4>
          <p className="text-sm text-kala-400 mt-1 flex-grow">Stay updated with the latest features and community stories.</p>
          <button onClick={() => onNavigate('announcements_internal')} className="mt-4 w-full px-4 py-2 bg-kala-700 hover:bg-kala-600 border border-kala-600 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2"><Rss size={16} /> Read Announcements</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
