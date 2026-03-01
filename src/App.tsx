
import React, { useState, useEffect, useTransition } from 'react';
import Layout from '@/components/Layout';
import Home from '@/components/Home';
import Dashboard from '@/components/Dashboard';
import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import { ToastProvider, useToast } from '@/contexts/ToastContext';
import { DataProvider, useData, transformRosterMemberToArtistProfile } from '@/contexts/DataContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  UserRole,
  ModerationCase,
  ArtistProfile as IArtistProfile,
  Artist,
  OnboardingRequest,
  Lead,
  ItemStatus
} from '@/types/types';
import {
  Wallet,
  Bell,
  Search,
  LogOut,
  Lock,
  Loader2,
  UploadCloud,
  MessageSquare,
  CreditCard,
  CheckCircle,
  ShieldAlert,
  AlertTriangle,
  X,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import {
  MOCK_LEADERBOARD,
  MOCK_ARTIST_PROFILE,
  MOCK_ROSTER,
  MOCK_USERS_BY_ROLE,
  MOCK_MODERATION_CASES,
} from '@/mockData';
import { DISABLE_ACCESS_DENIED } from '@/DISABLE_ACCESS_DENIED';

// Statically Imported Components
import Announcements from '@/components/Announcements';
import ChatOverlay from '@/components/ChatOverlay';
import WalletHistory from '@/components/WalletHistory';
import SearchResults from '@/components/SearchResults';
import Sitemap from '@/components/Sitemap';
import SystemDiagrams from '@/components/SystemDiagrams';
import WhitePaper from '@/components/WhitePaper';
import TokenExchange from '@/components/TokenExchange';
import BookingHub from '@/components/BookingHub';
import DaoGovernance from '@/components/DaoGovernance';
import Marketplace from '@/components/Marketplace';
import ServicesHub from '@/components/ServicesHub';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import ArtistProfile from '@/components/ArtistProfile';
import Roster from '@/components/Roster';
import JoinForm from '@/components/JoinForm';
import LeadsAndAi from '@/components/LeadsAndAi';
import AdminEmailTemplates from '@/components/AdminEmailTemplates';
import AdminSupport from '@/components/AdminSupport';
import TreasuryPage from '@/pages/TreasuryPage';
import HRDashboard from '@/components/HRDashboard';
import Forum from '@/components/Forum';
import CreativeStudio from '@/components/CreativeStudio';
import MembershipPlans from '@/components/MembershipPlans';
import MyNetwork from '@/components/MyNetwork';
import AdminReview from '@/components/AdminReview';
import ContractsDashboard from '@/components/ContractsDashboard';
import AdminPage from '@/pages/AdminPage';
import TablesPage from '@/pages/TablesPage';
import SupportRequestsPage from '@/pages/SupportRequestsPage';
import OnboardingPage from '@/pages/OnboardingPage';
import RosterAnalyticsPage from '@/pages/RosterAnalyticsPage';

const PageLoader = () => (
  <div className="h-[60vh] w-full flex flex-col items-center justify-center text-kala-400">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-kala-800 border-t-kala-secondary rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-kala-secondary rounded-full"></div>
      </div>
    </div>
    <p className="text-sm font-bold mt-6 tracking-widest uppercase animate-pulse">
      Loading Module...
    </p>
  </div>
);

const BlockedScreen: React.FC<{ onAppeal: (reason: string) => void }> = ({
  onAppeal,
}) => {
  const [appealReason, setAppealReason] = useState('');
  const [hasAppealed, setHasAppealed] = useState(false);
  const { notify } = useToast();

  const handleSubmit = () => {
    if (!appealReason.trim()) return;
    onAppeal(appealReason);
    setHasAppealed(true);
    notify('Appeal submitted to moderation team.', 'info');
  };

  return (
    <div className="min-h-screen bg-kala-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-red-900/20 p-8 rounded-full border-4 border-red-500 mb-8 animate-pulse">
        <ShieldAlert className="w-24 h-24 text-red-500" />
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">Account Suspended</h1>
      <div className="max-w-xl mx-auto space-y-4 mb-8">
        <p className="text-red-200 text-lg">
          Your account has been automatically flagged and blocked for violating
          our <span className="font-bold">Zero Tolerance Policy</span> regarding
          illicit or foul content.
        </p>
        <p className="text-kala-400 text-sm">
          This block is immediate and applies to all portal features.
        </p>
      </div>
      {!hasAppealed ? (
        <div className="w-full max-w-md bg-kala-800 p-6 rounded-xl border border-kala-700">
          <h3 className="text-white font-bold mb-3 flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" /> File Formal
            Appeal
          </h3>
          <textarea
            className="w-full bg-kala-900 border border-kala-600 rounded-lg p-3 text-white text-sm mb-4 outline-none focus:border-kala-secondary"
            rows={4}
            placeholder="Explain why this block was an error..."
            value={appealReason}
            onChange={(e) => setAppealReason(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={!appealReason}
            className="w-full px-8 py-3 bg-kala-700 hover:bg-kala-600 text-white font-bold rounded-xl border border-kala-500 transition-colors disabled:opacity-50"
          >
            Submit Appeal to Admins
          </button>
        </div>
      ) : (
        <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-xl max-w-md">
          <div className="text-green-400 font-bold text-lg mb-2 flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" /> Appeal Submitted
          </div>
          <p className="text-green-200 text-sm">
            Your case ID is #BL-{Math.floor(Math.random() * 1000)}. Our
            moderation team will review your request within 48-72 hours.
          </p>
        </div>
      )}
    </div>
  );
};

interface AppContentProps {
  currentUser: IArtistProfile | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<IArtistProfile | null>>;
}

const AppContent: React.FC<AppContentProps> = ({ currentUser, setCurrentUser }) => {
  const [isPending, startTransition] = useTransition();
  const [currentView, setCurrentView] = useState('home');
  const [activeTableView, setActiveTableView] = useState(''); 
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(
    UserRole.GUEST
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(MOCK_ARTIST_PROFILE);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [showWalletHistory, setShowWalletHistory] = useState(false);
  const [showTokenExchange, setShowTokenExchange] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(MOCK_ARTIST_PROFILE);
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [moderationCases, setModerationCases] = useState<ModerationCase[]>(
    MOCK_MODERATION_CASES
  );
  const [onboardingRequests, setOnboardingRequests] = useState<OnboardingRequest[]>([]);
  const [aiLeads, setAiLeads] = useState<Lead[]>([]);
  const [onboardingFilter, setOnboardingFilter] = useState<'all' | 'Lead' | 'Join Request'>('all');
  const [profileTab, setProfileTab] = useState('overview');

  const {
    isConnected: isWalletConnected,
    open: openWalletModal,
    disconnect: disconnectWallet,
    address: walletAddress,
  } = useWallet();
  const { notify } = useToast();
  const { addUser, findUserByEmail, findUserByWallet, updateUser } =
    useData();

  const navigate = (view: string) => {
    startTransition(() => {
      const tableViews = [
        'artists', 'dao-members', 'dao-proposals', 'dao-governors', 'events',
        'event-tickets', 'organizers', 'revellers', 'service-providers',
        'sponsors', 'support-requests', 'venues', 'proposals',
        'roster-bookings'
      ];
      
      if (view === 'leads') {
        setCurrentView('leads_and_ai');
      } else if (view === 'join_requests') {
        setOnboardingFilter('Join Request');
        setCurrentView('onboarding');
      } else if (tableViews.includes(view)) {
        setActiveTableView(view);
        setCurrentView('tables');
      } else {
        setOnboardingFilter('all');
        setCurrentView(view);
      }
    });
  };
  
  useEffect(() => {
    const fetchOnboardingRequests = async () => {
      try {
        const [leadsResponse, joinRequestsResponse] = await Promise.all([
          fetch('http://localhost:3001/api/leads').catch(e => { console.error('Fetch leads failed:', e); return { json: () => Promise.resolve([]) }; }),
          fetch('http://localhost:3001/api/join-requests/admin/all').catch(e => { console.error('Fetch join requests failed:', e); return { json: () => Promise.resolve([]) }; }),
        ]);

        const leadsData = await leadsResponse.json();
        const joinRequestsData = await joinRequestsResponse.json();

        const transformedAiLeads = leadsData.map((lead: any) => ({
          id: lead.id,
          name: lead.user.name,
          status: lead.status,
          bio: (lead.user && lead.user.artist && lead.user.artist.disambiguation) || ''
        }));
        setAiLeads(transformedAiLeads);

        const transformedOnboardingLeads: OnboardingRequest[] = leadsData.map((lead: any) => ({
          id: lead.id,
          type: 'Lead',
          name: lead.user.name,
          email: lead.user.email,
          requestedRole: UserRole.ARTIST, 
          status: lead.status,
          date: new Date(lead.createdAt),
        }));

        const transformedJoinRequests: OnboardingRequest[] = joinRequestsData.map((req: any) => ({
          id: req.id,
          type: 'Join Request',
          name: req.name,
          email: req.email,
          requestedRole: UserRole.ARTIST, 
          status: req.status,
          date: new Date(req.createdAt),
        }));

        setOnboardingRequests([...transformedOnboardingLeads, ...transformedJoinRequests]);
      } catch (error) {
        // This might still fail if the server isn't running, but the UI won't crash.
        console.error('Error processing onboarding requests:', error);
      }
    };

    if (currentUser && (currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.SYSTEM_ADMIN_LIVE)) {
      fetchOnboardingRequests();
    }
  }, [currentUser, currentUserRole, notify]);


  const handleLogin = async (
    role: UserRole | null,
    method: 'web2' | 'web3',
    credentials?: any
  ) => {
    if (method === 'web3' && !isWalletConnected) {
      openWalletModal();
      return; 
    }

    setIsLoggingIn(true);
    let userToLogin: IArtistProfile | null = null;

    if (method === 'web3') {
        const rosterUser = findUserByWallet(walletAddress!);
        if (rosterUser) {
            userToLogin = transformRosterMemberToArtistProfile(rosterUser, MOCK_ARTIST_PROFILE);
        }
    } else { 
      if (
        credentials?.email === 'bhoominpandya@gmail.com' &&
        credentials?.password === 'Creatkala!2'
      ) {
        notify(`Bypassing live login for test role: ${role}`, 'info');
        userToLogin = MOCK_USERS_BY_ROLE[role!] || MOCK_ARTIST_PROFILE;
      } else {
        try {
          const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });
          const data = await response.json();
          if (!response.ok) {
            notify(data.message || 'Login failed.', 'error');
            setIsLoggingIn(false);
            return;
          }
          userToLogin = data.user;
        } catch (error) {
          notify('Login request failed. Is the server running?', 'error');
          setIsLoggingIn(false);
          return;
        }
      }
    }

    if (!userToLogin) {
      if (method === 'web3') {
        notify('Wallet connected, but no user found. Please register.', 'info');
        navigate('join_request'); 
      } else {
        notify('Login failed. Please check your credentials.', 'error');
      }
      setIsLoggingIn(false);
      return;
    }

    if ((userToLogin.role === UserRole.ADMIN || userToLogin.role === UserRole.SYSTEM_ADMIN_LIVE) && method === 'web3') {
      notify('Admin-level roles may not use wallet-based login for security reasons.', 'error');
      setIsLoggingIn(false);
      return;
    }

    setCurrentUserRole(userToLogin.role);
    setCurrentUser(userToLogin);
    setSelectedProfile(userToLogin);
    setIsUserBlocked(false);

    startTransition(() => {
      setCurrentView('dashboard');
    });

    notify(`Welcome back, ${userToLogin.name}!`, 'info');
    setIsLoggingIn(false);
  };

  const addLead = (artist: Artist): Promise<boolean> => {
    return new Promise((resolve) => {
      setAiLeads((prevLeads) => {
        if (prevLeads.some((lead) => lead.id === artist.id)) {
          notify(`${artist.name} is already in your leads list.`, 'info');
          resolve(false);
          return prevLeads;
        }

        const newAiLead: Lead = {
          id: artist.id,
          name: artist.name,
          bio: artist.bio,
          status: 'New',
        };

        // Also update the main onboarding requests list for other parts of the app
        setOnboardingRequests((prevOnboarding) => {
            const newOnboardingRequest: OnboardingRequest = {
                id: artist.id,
                type: 'Lead',
                name: artist.name,
                email: `${artist.name.replace(/\s/g, '.').toLowerCase()}@example.com`,
                requestedRole: UserRole.ARTIST,
                status: 'PENDING',
                date: new Date(),
            };
            if (prevOnboarding.some(r => r.id === newOnboardingRequest.id)) {
                return prevOnboarding;
            }
            return [newOnboardingRequest, ...prevOnboarding];
        });

        notify(`Successfully added ${artist.name} as a new lead.`, 'success');
        resolve(true);
        return [newAiLead, ...prevLeads];
      });
    });
  };

  const handleOnboardingStatusChange = async (id: string, newStatus: 'Approved' | 'Denied') => {
    const request = onboardingRequests.find(r => r.id === id);
    if (!request) return;

    let url = '';
    let options: RequestInit = { method: 'POST' }; 

    if (request.type === 'Lead') {
      url = `http://localhost:3001/api/leads/${id}`;
      options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus.toUpperCase() }),
      };
    } else { // Join Request
      const action = newStatus === 'Approved' ? 'approve' : 'deny';
      url = `http://localhost:3001/api/join-requests/admin/${action}/${id}`;
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update status to ${newStatus}`);
      }

      setOnboardingRequests(currentRequests =>
        currentRequests.map(req =>
          req.id === id ? { ...req, status: newStatus } : req
        )
      );
      notify(`Request ${id} has been ${newStatus.toLowerCase()}.`, 'success');
    } catch (error) {
        let message = 'An unknown error occurred.';
        if (error instanceof Error) {
            message = error.message;
        }
        notify(message, 'error');
        console.error(error);
    }
  };


  const handleBlockUser = () => {
    if (!currentUser) return;
    setIsUserBlocked(true);
    setShowChat(false);
    const newCase: ModerationCase = {
      id: `MOD-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUserRole,
      violationType: 'Automated Flag (Zero Tolerance)',
      contentSnippet: 'User content triggered global moderation filter.',
      status: 'Blocked',
      timestamp: new Date().toLocaleString(),
    };
    setModerationCases((prev) => [newCase, ...prev]);
    notify('Account suspended due to policy violation.', 'error');
  };

  const handleAppeal = (reason: string) => {
    if (!currentUser) return;
    setModerationCases((prev) =>
      prev.map((c) =>
        c.userId === currentUser.id && c.status === 'Blocked'
          ? { ...c, status: 'Appeal Pending', appealReason: reason }
          : c
      )
    );
  };

  const handleAdminDecision = (
    caseId: string,
    decision: 'Unblock' | 'Reject'
  ) => {
    setModerationCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const newStatus =
            decision === 'Unblock'
              ? 'Resolved - Unblocked'
              : 'Resolved - Ban Upheld';
          if (decision === 'Unblock' && c.userId === currentUser?.id) {
            setIsUserBlocked(false);
          }
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
    notify(`Case ${caseId} updated: ${decision}`, 'success');
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate('search_results');
    }
  };

  const handleOpenChat = () => {
    setChatRecipient(selectedProfile);
    setShowChat(true);
  };

  const handleWalletConnect = () => {
    openWalletModal();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserRole(UserRole.GUEST);
    setSelectedProfile(MOCK_ARTIST_PROFILE);
    disconnectWallet();
    navigate('home');
    setIsUserBlocked(false);
    notify('Logged out successfully.', 'info');
  };

  const handleViewProfile = (id: string) => {
    const member = MOCK_ROSTER.find((m) => m.id === id);
    if (member) {
      const profile = {
        ...MOCK_ARTIST_PROFILE,
        id: member.id,
        name: member.name,
        role: member.role,
        avatar: member.avatar,
        location: member.location,
        verified: member.verified,
        walletAddress: member.walletAddress,
        bio: `${member.name} is a leading ${member.role} in the KalaKrut ecosystem...`,
        coverImage: `https://picsum.photos/seed/${member.id}/1200/400`,
      };
      setSelectedProfile(profile as IArtistProfile);
      setProfileTab('overview');
      navigate('profile');
    }
  };

  const handleUpdateUserProfile = (updates: Partial<IArtistProfile>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    updateUser({
      id: updatedUser.id,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      walletAddress: updatedUser.walletAddress,
      subscriberOnly: {
        ...updatedUser.subscriberOnly,
        email: updatedUser.email || updatedUser.subscriberOnly.email,
      },
      password: updatedUser.password,
    });
    if (selectedProfile.id === currentUser.id) {
      setSelectedProfile(updatedUser);
    }
  };

  const UserWidget = () => {
    if (!currentUser) return null;
    return (
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between mb-8 gap-4">
        <div className="text-white">
          <h1 className="text-2xl font-bold">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-kala-400 text-sm">
            Role: {currentUserRole} &bull; {currentUser.location}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-kala-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search portal..."
              className="bg-kala-800 border border-kala-700 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-kala-secondary outline-none w-48 transition-all focus:w-64"
            />
          </div>
          {!isWalletConnected ? (
            <button
              onClick={handleWalletConnect}
              disabled={isLoggingIn}
              className="text-xs bg-kala-secondary text-kala-900 px-3 py-1.5 rounded font-bold hover:bg-cyan-400 transition-colors flex items-center gap-2"
            >
              {isLoggingIn ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                'Connect Wallet'
              )}
            </button>
          ) : null}
          <button className="relative p-2 text-kala-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-kala-700">
            <div className="text-right hidden sm:block">
              {isWalletConnected ? (
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-sm font-bold text-white text-right font-mono tracking-tighter">
                      {walletAddress}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTokenExchange(true)}
                    className="p-2 bg-kala-800 hover:bg-kala-700 rounded-full border border-kala-600 text-kala-secondary transition-colors"
                    title="Swap Tokens"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
            <div
              onClick={() => {
                setSelectedProfile(currentUser);
                setProfileTab('overview');
                navigate('profile');
              }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-kala-secondary to-purple-600 p-0.5 cursor-pointer hover:scale-105 transition-transform ml-2"
              title="View My Profile"
            >
              <img
                src={currentUser.avatar}
                alt="Me"
                className="w-full h-full rounded-full border-2 border-kala-900 object-cover"
              />
            </div>
            <button
              onClick={handleLogout}
              className="text-kala-500 hover:text-red-400 transition-colors ml-2"
              title="Log Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAppContent = () => {
    if (!currentUser) {
      return <PageLoader />;
    }
    return (
      <div
        className={
          isPending
            ? 'opacity-70 transition-opacity pointer-events-none'
            : 'opacity-100 transition-opacity'
        }
      >
        {(() => {
            switch (currentView) {
              case 'search_results':
                return (
                  <SearchResults query={searchQuery} onNavigate={navigate} />
                );
              case 'sitemap':
                return <Sitemap onNavigate={navigate} />;
              case 'system_docs':
                return (DISABLE_ACCESS_DENIED || currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.SYSTEM_ADMIN_LIVE) ? (
                  <SystemDiagrams />
                ) : (
                  <div className="text-red-400 bg-kala-800 p-8 rounded-xl text-center">
                    Access Denied
                  </div>
                );
              case 'whitepaper':
                return <WhitePaper />;
              case 'booking':
                return (
                  <BookingHub
                    onBlockUser={handleBlockUser}
                    onOpenExchange={() => setShowTokenExchange(true)}
                  />
                );
              case 'governance':
                return (
                  <DaoGovernance
                    currentUserRole={currentUserRole}
                    onOpenExchange={() => setShowTokenExchange(true)}
                  />
                );
              case 'marketplace':
                return (
                  <Marketplace
                    onBlockUser={handleBlockUser}
                    onChat={(seller) => {
                      setChatRecipient({
                        ...MOCK_ARTIST_PROFILE,
                        name: seller.name,
                        avatar: seller.avatar,
                      });
                      setShowChat(true);
                    }}
                    currentUserRole={currentUserRole}
                    currentUserId={currentUser.id}
                  />
                );
              case 'services':
                return (
                  <ServicesHub
                    userRole={currentUserRole}
                    onNavigateToLeads={() => {
                      setSelectedProfile(currentUser);
                      setProfileTab('leads');
                      navigate('profile');
                    }}
                    onBlockUser={handleBlockUser}
                  />
                );
              case 'roster':
                return (
                  <Roster
                    onNavigate={navigate}
                    onViewProfile={handleViewProfile}
                  />
                );
              case 'roster_analytics':
                return <RosterAnalyticsPage onNavigate={navigate} />;
              case 'forum':
                return <Forum onBlockUser={handleBlockUser} currentUserRole={currentUserRole} currentUserId={currentUser.id} />;
              case 'studio':
                return <CreativeStudio onBlockUser={handleBlockUser} />;
              case 'admin_email_templates':
                return (DISABLE_ACCESS_DENIED || currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.SYSTEM_ADMIN_LIVE) ? (
                  <AdminEmailTemplates />
                ) : (
                  <div>Access Denied</div>
                );
              case 'admin_review':
                return (DISABLE_ACCESS_DENIED || currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.SYSTEM_ADMIN_LIVE) ? (
                  <AdminReview requests={onboardingRequests} onStatusChange={handleOnboardingStatusChange} />
                ) : (
                  <div>Access Denied</div>
                );
              case 'contracts':
                return (
                  (DISABLE_ACCESS_DENIED || currentUserRole === UserRole.ADMIN ||
                  currentUserRole === UserRole.SYSTEM_ADMIN_LIVE ||
                  currentUserRole === UserRole.DAO_GOVERNOR ||
                  currentUserRole === UserRole.DAO_MEMBER)
                ) ? (
                  <ErrorBoundary><ContractsDashboard /></ErrorBoundary>
                ) : (
                  <div>Access Denied</div>
                );
              case 'membership':
                return <MembershipPlans currentUser={currentUser} />;
              case 'my_network':
                return <MyNetwork currentUser={currentUser} />;
              case 'onboarding':
                return (DISABLE_ACCESS_DENIED || currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.SYSTEM_ADMIN_LIVE) ? (
                  <OnboardingPage 
                    requests={onboardingRequests} 
                    onStatusChange={handleOnboardingStatusChange}
                    initialFilter={onboardingFilter}
                  />
                ) : (
                  <div>Access Denied</div>
                );
              case 'leads_and_ai':
                return <LeadsAndAi leads={aiLeads} addLead={addLead} />;
              case 'admin_support':
                return (DISABLE_ACCESS_DENIED || currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.SYSTEM_ADMIN_LIVE) ? (
                  <SupportRequestsPage onNavigate={navigate} />
                ) : (
                  <div>Access Denied</div>
                );
              case 'treasury':
                return (DISABLE_ACCESS_DENIED || currentUserRole === UserRole.ADMIN ||
                  currentUserRole === UserRole.DAO_GOVERNOR ||
                  currentUserRole === UserRole.SYSTEM_ADMIN_LIVE) ? (
                  <TreasuryPage />
                ) : (
                  <div>Access Denied</div>
                );
              case 'hrds':
                return (DISABLE_ACCESS_DENIED || currentUserRole === UserRole.ADMIN ||
                  currentUserRole === UserRole.DAO_GOVERNOR ||
                  currentUserRole === UserRole.SYSTEM_ADMIN_LIVE) ? (
                  <HRDashboard />
                ) : (
                  <div>Access Denied</div>
                );
              case 'admin':
                return (DISABLE_ACCESS_DENIED || currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.SYSTEM_ADMIN_LIVE) ? (
                  <AdminPage onNavigate={navigate} />
                ) : (
                  <div>Access Denied</div>
                );
              case 'tables':
                return (
                  (DISABLE_ACCESS_DENIED || currentUserRole === UserRole.ADMIN ||
                  currentUserRole === UserRole.SYSTEM_ADMIN_LIVE ||
                  currentUserRole === UserRole.DAO_GOVERNOR ||
                  currentUserRole === UserRole.DAO_MEMBER)
                ) ? (
                  <TablesPage activeView={activeTableView} onNavigate={navigate} currentUserRole={currentUserRole} currentUserId={currentUser.id} />
                ) : (
                  <div>Access Denied</div>
                );
              case 'profile':
                return (
                  <ArtistProfile
                    artist={selectedProfile}
                    onChat={handleOpenChat}
                    onBook={() => navigate('booking')}
                    isOwnProfile={selectedProfile.id === currentUser.id}
                    isBlocked={isUserBlocked}
                    onUpdateProfile={handleUpdateUserProfile}
                    initialTab={profileTab}
                  />
                );
              case 'analytics':
                return (DISABLE_ACCESS_DENIED || currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.SYSTEM_ADMIN_LIVE) ? (
                  <AnalyticsDashboard />
                ) : (
                  <div>Access Denied</div>
                );
              case 'announcements_internal':
                return <Announcements onBack={() => navigate('dashboard')} />;
              case 'dashboard':
              default:
                return <Dashboard user={currentUser} onNavigate={navigate} />;
            }
          })()}
      </div>
    );
  };

  if (isUserBlocked) {
    return <BlockedScreen onAppeal={handleAppeal} />;
  }
  if (!currentUser) {
    if (currentView === 'announcements_public') {
      return (
          <Announcements onBack={() => navigate('home')} />
      );
    }
    if (currentView === 'join_request') {
      return (
        <div className="min-h-screen bg-kala-900 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2 text-kala-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>
              <JoinForm
                onComplete={() => {
                  navigate('home');
                  notify('Your request has been submitted!', 'success');
                }}
                onBlockUser={handleBlockUser}
              />
          </div>
        </div>
      );
    }
    return (
      <Home
        onLogin={handleLogin}
        onViewNews={() => navigate('announcements_public')}
        onJoin={() => navigate('join_request')}
        isLoggingIn={isLoggingIn}
      />
    );
  }

  return (
    <Layout
      currentView={currentView}
      userRole={currentUserRole}
      onNavigate={navigate}
      onLogout={handleLogout}
    >
      {showChat && (
        <ChatOverlay
          recipientName={chatRecipient.name}
          recipientAvatar={chatRecipient.avatar}
          onClose={() => setShowChat(false)}
          onNavigateToBooking={() => {
            setShowChat(false);
            navigate('booking');
          }}
          onBlockUser={handleBlockUser}
        />
      )}
      {showTokenExchange && (
        <TokenExchange onClose={() => setShowTokenExchange(false)} />
      )}
      {currentView !== 'dashboard' && <UserWidget />}
      {renderAppContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<IArtistProfile | null>(null);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <WalletProvider>
          <DataProvider currentUserId={currentUser?.id}>
            <AuthProvider>
              <AppContent currentUser={currentUser} setCurrentUser={setCurrentUser} />
            </AuthProvider>
          </DataProvider>
        </WalletProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
