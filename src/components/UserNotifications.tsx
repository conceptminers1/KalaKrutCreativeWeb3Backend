import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Bell, CheckCircle, XCircle, Info } from 'lucide-react';
import { Notification } from '../types';

const UserNotifications: React.FC = () => {
  const { notifications, markNotificationsAsRead } = useData();
  const { currentUser } = useAuth(); // Correctly use currentUser from useAuth
  const [isOpen, setIsOpen] = useState(false);
  const [userNotifications, setUserNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (currentUser) {
      setUserNotifications(
        notifications.filter(n => n.userId === currentUser.id)
      );
    }
  }, [notifications, currentUser]);

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0 && currentUser) {
      // Mark notifications as read when the panel is opened
      markNotificationsAsRead(currentUser.id);
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="relative">
      <button onClick={handleToggle} className="relative">
        <Bell className="text-white hover:text-kala-secondary transition-colors" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-kala-800 border border-kala-700 rounded-lg shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-3 border-b border-kala-700">
            <h4 className="text-white font-bold">Notifications</h4>
          </div>
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {userNotifications.length === 0 ? (
              <p className="text-kala-400 text-sm text-center p-6">You have no new notifications.</p>
            ) : (
              <div>
                {userNotifications.map(notif => (
                  <div key={notif.id} className={`p-3 flex items-start gap-3 border-b border-kala-700/50 ${notif.read ? 'opacity-60' : 'bg-kala-900/50'}`}>
                    <div className="shrink-0 mt-1">{getIcon(notif.type)}</div>
                    <div>
                      <p className="text-sm text-white">{notif.message}</p>
                      <p className="text-xs text-kala-400 mt-1">{new Date(notif.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-2 bg-kala-900/50 border-t border-kala-700 text-center">
            <button onClick={() => setIsOpen(false)} className="text-xs text-kala-300 hover:text-white">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNotifications;
