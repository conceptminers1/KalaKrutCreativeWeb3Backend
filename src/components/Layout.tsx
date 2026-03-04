
import React, { useState, startTransition } from 'react';
import {
  LayoutGrid,
  Users,
  UserCheck,
  Calendar,
  Vote,
  Settings,
  LogOut,
  Menu,
  X,
  ShoppingBag,
  Briefcase,
  BarChart3,
  Contact2,
  Bot,
  MessageSquare,
  UploadCloud,
  Network,
  GitMerge,
  LifeBuoy,
  CreditCard,
  Coins,
  FileText,
  FileSignature,
  AlertTriangle,
  ShieldCheck,
  Trash2,
  PlusCircle
} from 'lucide-react';
import { UserRole } from '../types';
import { useData } from '../hooks/useData';
import SupportWidget from '../components/SupportWidget';
import { useToast } from '../contexts/ToastContext';
import UserNotifications from './UserNotifications';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  onNavigate: (view: string) => void;
  currentView: string;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  userRole,
  onNavigate,
  currentView,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState(false);
  const { isDemoMode, demoModeAvailable, setDemoModeAvailable, purgeMockData } =
    useData();
  const { notify } = useToast();
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);

  const handleSettings = () => {
    if (userRole === UserRole.SYSTEM_ADMIN_LIVE || userRole === UserRole.ADMIN) {
      setIsAdminSettingsOpen(true);
    } else {
      notify(
        'Global Settings are restricted to Administrators only.',
        'warning'
      );
    }
  };

  const handleToggleDemoAvailability = () => {
    if (isDemoMode) {
      notify(
        'System settings are read-only in Demo Mode. Login to Live Mode to make changes.',
        'warning'
      );
      return;
    }
    const newState = !demoModeAvailable;
    setDemoModeAvailable(newState);
    notify(
      `Demo Mode has been ${newState ? 'ENABLED' : 'DISABLED'} for all users.`,
      'success'
    );
  };

  const handlePurge = () => {
    if (isDemoMode) {
      notify('Cannot purge data in Demo Mode.', 'warning');
      return;
    }
    purgeMockData();
    notify('Mock data has been purged.', 'success');
    setShowPurgeConfirm(false);
    setIsAdminSettingsOpen(false);
  };

  const NavItem = ({
    id,
    icon: Icon,
    label,
  }: {
    id: string;
    icon: any;
    label: string;
  }) => (
    <button
      onClick={() => {
        startTransition(() => {
          onNavigate(id);
        });
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
        currentView === id
          ? 'bg-kala-secondary/10 text-kala-secondary border-r-2 border-kala-secondary'
          : 'text-slate-400 hover:bg-kala-800 hover:text-white'
      }`}>
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  const mainNavItems = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { id: 'marketplace', icon: ShoppingBag, label: 'Marketplace' },
    { id: 'services', icon: Briefcase, label: 'Services Hub' },
    { id: 'booking', icon: Calendar, label: 'Proposals & Bookings' },
    { id: 'studio', icon: UploadCloud, label: 'Creative Studio' },
  ];

  const communityNavItems = [
    { id: 'roster', icon: Contact2, label: 'Roster / Members' },
    { id: 'forum', icon: MessageSquare, label: 'Forum' },
    { id: 'my_network', icon: Users, label: 'My Network' },
    { id: 'membership', icon: CreditCard, label: 'Membership & Plans' },
  ];

  const systemNavItems = [
    { id: 'sitemap', icon: Network, label: 'Site Map' },
    { id: 'whitepaper', icon: FileText, label: 'Whitepaper & Docs' },
  ];

  const getAdminNavItems = () => {
    const allAdminItems = [
      { id: 'admin_review', icon: UserCheck, label: 'User Onboarding' },
      { id: 'governance', icon: Vote, label: 'DAO Governance' },
      { id: 'contracts', icon: FileSignature, label: 'Contracts & Agreements' },
      { id: 'treasury', icon: Coins, label: 'Treasury' },
      { id: 'hrds', icon: Briefcase, label: 'HRD & Team' },
      { id: 'analytics', icon: BarChart3, label: 'Analytics' },
      { id: 'admin_support', icon: LifeBuoy, label: 'Support Center' },
      { id: 'leads', icon: Bot, label: 'Leads & AI' },
      { id: 'system_docs', icon: GitMerge, label: 'Architecture & ERD' },
      {
        id: 'admin_email_templates',
        icon: FileText,
        label: 'Email Templates',
      },
    ];

    if (userRole === UserRole.ADMIN || userRole === UserRole.SYSTEM_ADMIN_LIVE) {
      return allAdminItems;
    }

    const daoItems = [];
    if (userRole === UserRole.DAO_MEMBER || userRole === UserRole.DAO_GOVERNOR) {
      daoItems.push(
        { id: 'governance', icon: Vote, label: 'DAO Governance' },
        { id: 'contracts', icon: FileSignature, label: 'Contracts & Agreements' },
      );
    }
    if (userRole === UserRole.DAO_GOVERNOR) {
      daoItems.push({ id: 'treasury', icon: Coins, label: 'Treasury' });
    }

    return daoItems;
  };

  const adminNavItems = getAdminNavItems();

  return (
    <div className="min-h-screen bg-kala-900 flex text-slate-200 font-sans selection:bg-kala-secondary selection:text-kala-900 relative">
      <div className="lg:hidden fixed top-0 w-full bg-kala-900/90 backdrop-blur border-b border-kala-700 z-50 px-4 py-3 flex justify-between items-center">
        <div className="font-bold text-xl tracking-tighter text-white">
          Kala<span className="text-kala-secondary">Krut</span>
        </div>
        <div className="flex items-center gap-4">
          <UserNotifications />
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <aside
        className={`
        fixed lg:static top-0 left-0 z-40 h-full w-64 bg-kala-900 border-r border-kala-800 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-kala-800">
          <div className="font-bold text-2xl tracking-tighter text-white">
            Kala<span className="text-kala-secondary">Krut</span>
            <span className="text-[10px] ml-1 bg-kala-700 text-kala-300 px-1.5 py-0.5 rounded">
              v3.0
            </span>
          </div>
          <p className="text-xs text-kala-500 mt-1">Creative Portal</p>
        </div>

        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-180px)] custom-scrollbar">
          <div className="text-xs font-bold text-kala-600 uppercase px-4 py-2">
            Main
          </div>
          {mainNavItems.map((item) => (
            <NavItem key={item.id} {...item} />
          ))}

          <div className="text-xs font-bold text-kala-600 uppercase px-4 py-2 mt-4">
            Community
          </div>
          {communityNavItems.map((item) => (
            <NavItem key={item.id} {...item} />
          ))}

          <div className="text-xs font-bold text-kala-600 uppercase px-4 py-2 mt-4">
            System
          </div>
          {systemNavItems.map((item) => (
            <NavItem key={item.id} {...item} />
          ))}

          {adminNavItems.length > 0 && (
            <>
              <div className="text-xs font-bold text-kala-600 uppercase px-4 py-2 mt-4">
                Admin / DAO
              </div>
              {adminNavItems.map((item) => (
                <NavItem key={item.id} {...item} />
              ))}
            </>
          )}
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-kala-800 bg-kala-900">
          <button
            onClick={handleSettings}
            className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-white transition-colors w-full">
            <Settings className="w-5 h-5" /> Settings
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 transition-colors w-full mt-1">
            <LogOut className="w-5 h-5" /> Disconnect
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-screen relative bg-kala-900">
        <div className="absolute top-4 right-8 z-10 hidden lg:flex items-center gap-4">
          <UserNotifications />
        </div>

        {isDemoMode && (
          <div className="bg-gradient-to-r from-yellow-600/90 to-orange-600/90 text-white text-xs font-bold text-center py-1.5 flex items-center justify-center gap-2 sticky top-0 z-30 backdrop-blur">
            <AlertTriangle className="w-3 h-3 text-white" />
            DEMO MODE ACTIVE: Using sample data. Actions will not persist to
            mainnet.
          </div>
        )}

        <div className="p-4 lg:p-8 pt-20 lg:pt-8 max-w-7xl mx-auto">
          {children}
        </div>
        <SupportWidget />
      </main>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {isAdminSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-kala-900 border border-kala-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-kala-800 flex justify-between items-center bg-kala-800/50">
              <h3 className="text-white font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-kala-secondary" /> System
                Configuration
              </h3>
              <button
                onClick={() => setIsAdminSettingsOpen(false)}
                className="text-kala-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {userRole === UserRole.SYSTEM_ADMIN_LIVE || userRole === UserRole.ADMIN ? (
                <>
                  <div
                    className={`bg-kala-800 p-4 rounded-xl border border-kala-700 flex items-center justify-between ${isDemoMode ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div>
                      <h4 className="text-white font-bold text-sm">
                        Enable Demo Mode
                      </h4>
                      <p className="text-xs text-kala-400 mt-1">
                        When enabled, users can log in to a "Demo Mode" with
                        pre-loaded sample data.
                      </p>
                    </div>
                    <button
                      onClick={handleToggleDemoAvailability}
                      disabled={isDemoMode}
                      className={`relative w-12 h-6 rounded-full transition-colors ${demoModeAvailable ? 'bg-green-500' : 'bg-kala-700'} ${isDemoMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${demoModeAvailable ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                  </div>

                  <div
                    className={`bg-red-900/20 p-4 rounded-xl border border-red-500/30 ${isDemoMode ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-red-300 font-bold text-sm">
                          Purge Demo Data
                        </h4>
                        <p className="text-xs text-red-400/80 mt-1">
                          Permanently delete all mock users, proposals, and
                          market items from the database.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowPurgeConfirm(true)}
                        disabled={isDemoMode}
                        className="bg-red-600/50 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-600/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <Trash2 className="w-4 h-4" /> Purge
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-200">
                    Permission Denied. Your role ({userRole}) does not have
                    permission to change these settings. Access is restricted to
                    designated administrators in Live Mode.
                  </p>
                </div>
              )}

              <div className="text-xs text-center text-kala-500 pt-2">
                Changes take effect immediately.
              </div>
            </div>
            <div className="p-4 bg-kala-800/50 border-t border-kala-800 flex justify-end">
              <button
                onClick={() => setIsAdminSettingsOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-kala-700">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showPurgeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-kala-900 border border-red-500/50 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-red-500/30 flex justify-between items-center bg-red-900/20">
              <h3 className="text-white font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" /> Confirm Purge
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-300">
                This is a destructive action and cannot be undone. Are you sure
                you want to permanently delete all mock data from the portal?
              </p>
            </div>
            <div className="p-4 bg-kala-800/50 border-t border-kala-800 flex justify-end gap-2">
              <button
                onClick={() => setShowPurgeConfirm(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-kala-700">
                Cancel
              </button>
              <button
                onClick={handlePurge}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
