'''
import { UserRole } from '../types';

interface NavItem {
  label: string;
  view: string;
  icon?: string; // Optional: for dashboard icons
}

// Centralized list of all views in the application
export const ALL_VIEWS = [
    // Core & Common
    'home',
    'dashboard',
    'profile',
    'search_results',
    'announcements_public',
    'announcements_internal',
    'sitemap',
    'whitepaper',
    'membership',

    // User-specific Hubs
    'booking',
    'marketplace',
    'my_circle',
    'forum',
    'studio',
    'services',
    'governance',
    'roster',
    'leads_and_ai',
    'contracts_dashboard',

    // Registration & Forms
    'register_artist', // Also used for join_request

    // Admin & Governance Main Pages
    'admin', // The main admin dashboard with buttons
    'analytics',
    'treasury_page',
    'hrd_page',
    'admin_support_page',
    'system_docs',

    // Detailed Admin Views (often reached from 'admin' dashboard)
    'admin_email_templates',
    'admin_contracts',
    'admin_review',
    'admin_leads',
    'admin_join_requests',

    // The generic page that holds the data tables
    'tables',

    // Specific Data Table Views managed by 'TablesPage'
    'artists',
    'dao-members',
    'dao-proposals',
    'dao-governors',
    'events',
    'event-tickets',
    'hrds',
    'organizers',
    'revellers',
    'service-providers',
    'sponsors',
    'support-requests',
    'treasury',
    'venues',
    'proposals',
    'roster-bookings',
];


// Navigation items appearing on the user's dashboard
export const ROLE_NAV_CONFIG: Record<UserRole, NavItem[]> = {
  [UserRole.GUEST]: [],

  [UserRole.REVELLER]: [
    { label: 'Marketplace', view: 'marketplace', icon: 'ShoppingCart' },
    { label: 'Booking Hub', view: 'booking', icon: 'Calendar' },
    { label: 'My Circle', view: 'my_circle', icon: 'Users' },
    { label: 'Forum', view: 'forum', icon: 'MessageSquare' },
    { label: 'Membership', view: 'membership', icon: 'Star' },
  ],

  [UserRole.ARTIST]: [
    { label: 'My Profile', view: 'profile', icon: 'User' },
    { label: 'Booking Hub', view: 'booking', icon: 'Calendar' },
    { label: 'Creative Studio', view: 'studio', icon: 'Paintbrush' },
    { label: 'Leads & AI', view: 'leads_and_ai', icon: 'BrainCircuit' },
    { label: 'Contracts', view: 'contracts_dashboard', icon: 'FileText' },
    { label: 'Services Hub', view: 'services', icon: 'Briefcase' },
  ],

  [UserRole.DAO_MEMBER]: [
    { label: 'DAO Governance', view: 'governance', icon: 'Vote' },
    { label: 'Active Proposals', view: 'proposals', icon: 'FileSignature' },
    { label: 'Forum', view: 'forum', icon: 'MessageSquare' },
    { label: 'Contracts', view: 'contracts_dashboard', icon: 'FileText' },
  ],

  [UserRole.DAO_GOVERNOR]: [
    { label: 'DAO Governance', view: 'governance', icon: 'Vote' },
    { label: 'Treasury', view: 'treasury_page', icon: 'Landmark' },
    { label: 'Active Proposals', view: 'proposals', icon: 'FileSignature' },
    { label: 'Contracts', view: 'contracts_dashboard', icon: 'FileText' },
  ],

  [UserRole.ADMIN]: [
    { label: 'Admin Tables', view: 'admin', icon: 'Table' },
    { label: 'Analytics', view: 'analytics', icon: 'BarChart' },
    { label: 'Support Cases', view: 'admin_support_page', icon: 'ShieldCheck' },
    { label: 'HR Dashboard', view: 'hrd_page', icon: 'Users' },
    { label: 'Treasury', view: 'treasury_page', icon: 'Landmark' },
    { label: 'Join Requests', view: 'admin_join_requests', icon: 'UserPlus' },
  ],
  
  [UserRole.SYSTEM_ADMIN_LIVE]: [
    { label: 'Admin Tables', view: 'admin', icon: 'Table' },
    { label: 'Analytics', view: 'analytics', icon: 'BarChart' },
    { label: 'Support Cases', view: 'admin_support_page', icon: 'ShieldCheck' },
    { label: 'HR Dashboard', view: 'hrd_page', icon: 'Users' },
    { label: 'Treasury', view: 'treasury_page', icon: 'Landmark' },
    { label: 'Join Requests', view: 'admin_join_requests', icon: 'UserPlus' },
    { label: 'System Docs', view: 'system_docs', icon: 'FileCode' },
  ],
};

const ADMIN_TABLE_VIEWS = [
    'artists', 'dao-members', 'dao-proposals', 'dao-governors', 'events',
    'event-tickets', 'hrds', 'organizers', 'revellers', 'service-providers',
    'sponsors', 'support-requests', 'treasury', 'venues', 'proposals',
    'roster-bookings', 'marketplace', 'roster'
];

export const canAccessView = (role: UserRole, view: string): boolean => {
  if (!role || role === UserRole.GUEST) {
    return ['home', 'register_artist', 'announcements_public'].includes(view);
  }

  if (role === UserRole.SYSTEM_ADMIN_LIVE) {
    return true;
  }
  
  const commonViews = [
    'dashboard', 
    'profile', 
    'announcements_internal',
    'sitemap',
    'whitepaper',
    'search_results',
  ];
  if (commonViews.includes(view)) {
    return true;
  }

  const roleNavViews = ROLE_NAV_CONFIG[role]?.map(item => item.view) || [];
  if (roleNavViews.includes(view)) {
    return true;
  }

  if (role === UserRole.ADMIN) {
    if (view === 'tables' || ADMIN_TABLE_VIEWS.includes(view)) {
      return true;
    }
    const adminAllowedViews = [
        ...roleNavViews,
        'admin_email_templates', 'admin_contracts', 'admin_review', 'admin_leads', 'admin_join_requests'
    ];
    return adminAllowedViews.includes(view);
  }

  return false;
};
'''