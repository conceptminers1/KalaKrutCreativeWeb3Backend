
import React from 'react';
import { X, ShieldCheck, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react';
import { useData } from '../hooks/useData';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { UserRole } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, userRole }) => {
  const { isDemoMode, demoModeAvailable, setDemoModeAvailable, purgeMockData } = useData();
  const { logout } = useAuth();
  const { notify } = useToast();

  if (!isOpen) return null;

  const isLiveAdmin = userRole === UserRole.SYSTEM_ADMIN_LIVE;
  const isActionDisabled = !isLiveAdmin || isDemoMode;

  const handleToggleDemoAvailability = () => {
    if (isActionDisabled) {
      notify("This action is restricted to the System Admin (Live) only.", "warning");
      return;
    }
    const newState = !demoModeAvailable;
    setDemoModeAvailable(newState);
    notify(`Public Demo Mode has been ${newState ? 'ENABLED' : 'DISABLED'} for all users.`, "success");
  };

  const handlePurgeAndLogout = () => {
    if (isActionDisabled) {
      notify("This action is restricted to the System Admin (Live) only.", "warning");
      return;
    }
    purgeMockData();
    notify("Mock data has been purged. You will be logged out.", "success");
    setTimeout(() => {
      logout();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-kala-900 border border-kala-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-kala-800 flex justify-between items-center bg-kala-800/50">
          <h3 className="text-white font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-kala-secondary" />
            System Configuration
          </h3>
          <button onClick={onClose} className="text-kala-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {isActionDisabled && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-yellow-300">
                  {isDemoMode ? "Settings are Read-Only in Demo Mode" : "Admin Access Required"}
                </p>
                <p className="text-xs text-yellow-400/80 mt-1">
                  {isDemoMode
                    ? "Global settings can only be changed by a verified Admin in Live Mode."
                    : "These settings are restricted to the System Admin (Live) role."}
                </p>
              </div>
            </div>
          )}

          <div className={`bg-kala-800 p-4 rounded-xl border border-kala-700 flex items-center justify-between transition-opacity ${isActionDisabled ? 'opacity-50' : ''}`}>
            <div>
              <h4 className="text-white font-bold text-sm">Public Demo Mode</h4>
              <p className="text-xs text-kala-400 mt-1">
                Allow visitors to use the platform with mock data.
              </p>
            </div>
            <button
              onClick={handleToggleDemoAvailability}
              disabled={isActionDisabled}
              className="relative w-12 h-6 rounded-full transition-colors disabled:cursor-not-allowed"
            >
              {demoModeAvailable ? <ToggleRight size={32} className="text-green-500" /> : <ToggleLeft size={32} className="text-kala-600"/>}
            </button>
          </div>

          <div className={`bg-red-900/20 p-4 rounded-xl border border-red-700/50 transition-opacity ${isActionDisabled ? 'opacity-50' : ''}`}>
            <h4 className="text-white font-bold text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Purge Mock Data
            </h4>
            <p className="text-xs text-red-300 mt-1">
              Reset all mock data to its original state and log out. This action cannot be undone.
            </p>
            <button
              onClick={handlePurgeAndLogout}
              disabled={isActionDisabled}
              className="mt-4 w-full px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors disabled:bg-red-600/50 disabled:cursor-not-allowed"
            >
              Purge Data and Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
