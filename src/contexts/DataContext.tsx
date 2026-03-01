import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  RosterMember,
  MarketplaceItem,
  Proposal,
  ArtistProfile,
  UserRole,
  Artist,
  Notification,
  ApprovalStatus,
  ItemStatus,
} from '../types';
import {
  MOCK_ROSTER,
  MOCK_MARKETPLACE_ITEMS,
  MOCK_PROPOSALS,
  MOCK_ARTIST_PROFILE,
} from '../mockData';

export interface DataContextType {
  users: RosterMember[];
  marketItems: MarketplaceItem[];
  proposals: Proposal[];
  leads: ArtistProfile[];
  notifications: Notification[];
  addUser: (user: ArtistProfile) => void;
  updateUser: (user: Partial<RosterMember>) => void;
  addMarketItem: (item: MarketplaceItem) => void;
  addLead: (artist: Artist) => boolean;
  updateLeadStatus: (leadId: string, status: ArtistProfile['leadStatus']) => void;
  removeLead: (leadId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationsAsRead: (userId: string) => void;
  purgeMockData: () => void;
  isDemoMode: boolean;
  setDemoMode: (isDemo: boolean) => void;
  demoModeAvailable: boolean;
  setDemoModeAvailable: (available: boolean) => void;
  stats: {
    totalMembers: number;
    activeGigs: number;
    totalTransactions: string;
  };
  // Auth & User Lookup
  findUserByEmail: (email: string) => RosterMember | undefined;
  findUserByWallet: (address: string) => RosterMember | undefined;
  getUserById: (id: string) => RosterMember | undefined;
}

export const DataContext = createContext<DataContextType | undefined>(
  undefined
);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const transformRosterMemberToArtistProfile = (
  rosterMember: RosterMember,
  fallbackProfile: ArtistProfile
): ArtistProfile => {
  return {
    ...fallbackProfile,
    id: rosterMember.id,
    name: rosterMember.name,
    role: rosterMember.role,
    avatar: rosterMember.avatar,
    location: rosterMember.location,
    verified: rosterMember.verified,
    walletAddress: rosterMember.walletAddress,
    email: rosterMember.subscriberOnly?.email || '',
    bio: `A member of the KalaKrut community since ${new Date().getFullYear()}.`,
    coverImage: `https://picsum.photos/seed/${rosterMember.id}/1200/400`,
    genres: fallbackProfile.genres,
    pressKit: fallbackProfile.pressKit,
    stats: fallbackProfile.stats,
    xp: fallbackProfile.xp,
    level: fallbackProfile.level,
    leadStatus: 'Converted',
    status: ApprovalStatus.APPROVED
  };
};

const tagMocks = (data: any[]) =>
  data.map((item) => ({ ...item, isMock: true }));

const SYSTEM_ADMIN: RosterMember = {
  id: 'sys_admin_live',
  name: 'System Admin (Live)',
  role: UserRole.SYSTEM_ADMIN_LIVE,
  avatar:
    'https://ui-avatars.com/api/?name=System+Admin&background=0D8ABC&color=fff',
  location: 'Server Room',
  verified: true,
  rating: 5.0,
  assets: { ips: [], contents: [], events: [], products: [], services: [], equipment: [], instruments: [], tickets: [] },
  subscriberOnly: { email: 'admin@kalakrut.io', phone: 'N/A', agentContact: 'System' },
  isMock: false,
};

const SUPER_ADMIN: RosterMember = {
  id: 'super_admin_bhoomin',
  name: 'Super Admin',
  role: UserRole.ADMIN,
  avatar:
    'https://ui-avatars.com/api/?name=Super+Admin&background=8b5cf6&color=fff',
  location: 'Global HQ',
  verified: true,
  rating: 5.0,
  assets: { ips: [], contents: [], events: [], products: [], services: [], equipment: [], instruments: [], tickets: [] },
  subscriberOnly: { email: 'bhoominpandya@gmail.com', phone: '+1 (555) 000-SUPER', agentContact: 'Direct' },
  isMock: false,
  password: 'Creatkala!2',
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<RosterMember[]>(() => {
    try {
      const saved = localStorage.getItem('kk_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          let users = parsed.filter(Boolean);
          if (!users.some((u) => u && u.id === SYSTEM_ADMIN.id)) users.push(SYSTEM_ADMIN);
          if (!users.some((u) => u && u.id === SUPER_ADMIN.id)) users.push(SUPER_ADMIN);
          return users;
        }
      }
    } catch (error) {
      console.error("CRITICAL: Failed to load 'kk_users'.", error);
    }
    return [...tagMocks(MOCK_ROSTER), SYSTEM_ADMIN, SUPER_ADMIN];
  });

  const [allLeads, setAllLeads] = useState<ArtistProfile[]>(() => {
    try {
      const saved = localStorage.getItem('kk_leads');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      }
    } catch (error) {
      console.error("CRITICAL: Failed to load 'kk_leads'.", error);
    }
    return [];
  });
  
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem('kk_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      }
    } catch (error) {
      console.error("CRITICAL: Failed to load 'kk_notifications'.", error);
    }
    return [];
  });

  const [allMarketItems, setAllMarketItems] = useState<MarketplaceItem[]>(
    () => {
      try {
        const saved = localStorage.getItem('kk_market');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const uniqueIds = new Set();
            return parsed.filter(item => {
              if (!item || !item.id || uniqueIds.has(item.id)) return false;
              uniqueIds.add(item.id);
              return true;
            });
          }
        }
      } catch (error) {
        console.error("CRITICAL: Failed to load 'kk_market'.", error);
      }
      return tagMocks(MOCK_MARKETPLACE_ITEMS);
    }
  );

  const [allProposals, setAllProposals] = useState<Proposal[]>(() => {
    try {
      const saved = localStorage.getItem('kk_proposals');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      }
    } catch (error) {
      console.error("CRITICAL: Failed to load 'kk_proposals'.", error);
    }
    return tagMocks(MOCK_PROPOSALS);
  });

  const [isDemoMode, setIsDemoMode] = useState(true);
  const [demoModeAvailable, setDemoModeAvailable] = useState(() => {
    const saved = localStorage.getItem('kk_demo_available');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => { localStorage.setItem('kk_users', JSON.stringify(allUsers)); }, [allUsers]);
  useEffect(() => { localStorage.setItem('kk_leads', JSON.stringify(allLeads)); }, [allLeads]);
  useEffect(() => { localStorage.setItem('kk_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('kk_market', JSON.stringify(allMarketItems)); }, [allMarketItems]);
  useEffect(() => { localStorage.setItem('kk_proposals', JSON.stringify(allProposals)); }, [allProposals]);

  useEffect(() => {
    localStorage.setItem('kk_demo_available', JSON.stringify(demoModeAvailable));
    if (!demoModeAvailable) setIsDemoMode(false);
  }, [demoModeAvailable]);

  const addUser = (profile: ArtistProfile) => {
    const newRosterMember: RosterMember = {
      id: profile.id,
      name: profile.name,
      role: profile.role,
      avatar: profile.avatar || 'https://picsum.photos/seed/new_user/200',
      location: profile.location,
      verified: false,
      rating: 0,
      walletAddress: profile.walletAddress,
      assets: { ips: [], contents: [], events: [], products: [], services: [], equipment: [], instruments: [], tickets: [] },
      subscriberOnly: { email: profile.email || 'hidden', phone: 'Hidden', agentContact: 'Direct' },
      isMock: false,
      password: profile.password,
    };
    setAllUsers((prev) => [newRosterMember, ...prev.filter((p) => p.id !== newRosterMember.id)]);
  };

  const updateUser = (updates: Partial<RosterMember>) => {
    setAllUsers((prev) => prev.map((user) => (user.id === updates.id ? { ...user, ...updates } : user)));
  };
  
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationsAsRead = (userId: string) => {
    setNotifications(prev => prev.map(n => (n.userId === userId ? { ...n, read: true } : n)));
  };

  const addMarketItem = (item: MarketplaceItem) => {
    setAllMarketItems((prev) => [{ ...item, isMock: false }, ...prev]);
  };

  const addLead = (artist: Artist): boolean => {
    let wasAdded = false;
    setAllLeads((prev) => {
      if (prev.some((l) => l.id === artist.id)) {
        wasAdded = false;
        return prev;
      }
      const newLead: ArtistProfile = {
        id: artist.id,
        name: artist.name,
        bio: artist.bio,
        email: '',
        location: '',
        status: ApprovalStatus.PENDING,
        leadStatus: 'New',
        role: UserRole.ARTIST,
        avatar: 'https://ui-avatars.com/api/?name=' + artist.name.replace(/ /g, '+'),
        coverImage: '',
        genres: [],
        verified: false,
        pressKit: { photos: [], topTracks: [], techRiderUrl: '', socials: [] },
        stats: { gigsCompleted: 0, activeGigs: 0, rating: 0, responseTime: 'N/A' },
        xp: 0,
        level: 1,
      };
      wasAdded = true;
      return [newLead, ...prev];
    });
    return wasAdded;
  };
  
  const updateLeadStatus = (leadId: string, status: ArtistProfile['leadStatus']) => {
    setAllLeads(prev => prev.map(lead => lead.id === leadId ? { ...lead, leadStatus: status } : lead));
  };

  const removeLead = (leadId: string) => {
    setAllLeads(prev => prev.filter(lead => lead.id !== leadId));
  };

  const purgeMockData = () => {
    if (window.confirm("WARNING: This will delete all 'Working Example' data. This action cannot be undone. Are you sure?")) {
      setAllUsers((prev) => prev.filter((u) => !u.isMock));
      setAllMarketItems((prev) => prev.filter((i) => !i.isMock));
      setAllProposals((prev) => prev.filter((p) => !p.isMock));
    }
  };

  const findUserByEmail = (email: string) => allUsers.find((u) => u.subscriberOnly?.email?.toLowerCase() === email.toLowerCase());
  const findUserByWallet = (address: string) => allUsers.find((u) => u.walletAddress?.toLowerCase() === address.toLowerCase());
  const getUserById = (id: string) => allUsers.find((u) => u.id === id);

  const visibleUsers = allUsers.filter(u => u.status === ApprovalStatus.APPROVED && !u.isMock);
  const visibleLeads = isDemoMode ? allLeads.filter(l => l.status === ApprovalStatus.PENDING) : allLeads.filter(l => l.status === ApprovalStatus.PENDING && !l.isMock);
  const visibleProposals = isDemoMode ? allProposals : allProposals.filter((p) => !p.isMock);
  
  // PERMANENT FIX: Join seller data with marketplace items
  const visibleMarket = allMarketItems.map(item => {
    const seller = getUserById(item.sellerId);
    return {
      ...item,
      title: item.name, // Map name to title for the UI component
      seller: seller ? {
        name: seller.name,
        avatar: seller.avatar,
        verified: seller.verified,
      } : {
        name: "Unknown Seller",
        avatar: "",
        verified: false,
      }
    };
  });

  const stats = {
    totalMembers: visibleUsers.length,
    activeGigs: visibleProposals.filter((p) => p.status === 'Active').length,
    totalTransactions: isDemoMode ? (12 + visibleUsers.filter((u) => !u.isMock).length).toString() : '0',
  };

  return (
    <DataContext.Provider
      value={{
        users: visibleUsers,
        marketItems: visibleMarket,
        proposals: visibleProposals,
        leads: visibleLeads,
        notifications,
        addUser,
        updateUser,
        addMarketItem,
        addLead,
        updateLeadStatus,
        removeLead,
        addNotification,
        markNotificationsAsRead,
        purgeMockData,
        isDemoMode,
        setDemoMode: setIsDemoMode,
        demoModeAvailable,
        setDemoModeAvailable,
        stats,
        findUserByEmail,
        findUserByWallet,
        getUserById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
