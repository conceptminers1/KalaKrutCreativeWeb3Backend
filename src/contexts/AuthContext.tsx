import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { useToast } from '../contexts/ToastContext';
import { useData } from '../contexts/DataContext';
import { RosterMember, UserRole, ArtistProfile } from '../types';
import { useWallet } from './WalletContext';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

// Helper for safe storage
const createSafeStorage = () => {
  const inMemoryStore: { [key: string]: string } = {};
  try {
    // Try to access localStorage to see if it's available
    window.localStorage.setItem('__test', '1');
    window.localStorage.removeItem('__test');
    return window.localStorage;
  } catch (e) {
    // If localStorage is not available, return an in-memory store
    console.warn('localStorage is not available. Using in-memory storage. Session will not persist across page reloads.');
    return {
      getItem: (key: string) => inMemoryStore[key] || null,
      setItem: (key: string, value: string) => { inMemoryStore[key] = value; },
      removeItem: (key: string) => { delete inMemoryStore[key]; },
      clear: () => { for (const key in inMemoryStore) delete inMemoryStore[key]; }
    };
  }
};

const safeStorage = createSafeStorage();

interface AuthContextType {
  currentUser: RosterMember | null;
  loading: boolean;
  login: (
    role: UserRole,
    method: 'web2' | 'web3',
    credentials: any
  ) => Promise<void>;
  logout: () => void;
  signup: (profile: ArtistProfile) => Promise<void>;
  setCurrentUser: (user: RosterMember | null) => void;
  connectWallet: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<RosterMember | null>(null);
  const [loading, setLoading] = useState(true);
  const { users, addUser, findUserByEmail } = useData();
  const { showToast } = useToast();

  const { open: openWalletModal } = useWallet();
  const { address, isConnected } = useWeb3ModalAccount();

  useEffect(() => {
    try {
      const storedUser = safeStorage.getItem('kk_currentUser');
      if (storedUser) {
        const user: RosterMember = JSON.parse(storedUser);
        if (users.find((u) => u.id === user.id)) {
          setCurrentUser(user);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [users]);

  useEffect(() => {
    if (isConnected && address) {
      setLoading(true);
      
      const findUserByWalletAddress = (walletAddress: string): RosterMember | undefined => {
        return users.find(user => 
          (user as any).accounts?.some((acc: any) => acc.providerAccountId.toLowerCase() === walletAddress.toLowerCase())
        );
      };

      const existingUser = findUserByWalletAddress(address);

      if (existingUser) {
        setCurrentUser(existingUser);
        safeStorage.setItem('kk_currentUser', JSON.stringify(existingUser));
        showToast(`Wallet connected. Welcome back, ${existingUser.name}!`, 'success');
      } else {
        setCurrentUser(null);
        safeStorage.removeItem('kk_currentUser');
        showToast('Wallet connected. No user profile found. Please register.', 'info');
      }
      setLoading(false);
    }
  }, [isConnected, address, users, showToast]);

  const connectWallet = () => {
    openWalletModal();
  };

  const login = useCallback(
    async (role: UserRole, method: 'web2' | 'web3', credentials: any) => {
      if (method === 'web3') {
        connectWallet();
        return;
      }
      
      setLoading(true);
      const { email, password, isDemo } = credentials;

      if (isDemo) {
        const demoUser: RosterMember = {
          id: `demo_${role.toLowerCase()}_${Date.now()}`,
          name: `Demo ${role}`,
          role: role,
          avatar: `https://ui-avatars.com/api/?name=Demo+${role}&background=random`,
          location: 'Virtual Space',
          verified: true,
          rating: 5,
          assets: { ips: [], contents: [], events: [], products: [], services: [], equipment: [], instruments: [], tickets: [] },
          subscriberOnly: { email: 'demo@kalakrut.io', phone: 'N/A', agentContact: 'System' },
          isMock: true,
          onboardingComplete: true,
        };
        setCurrentUser(demoUser);
        safeStorage.setItem('kk_currentUser', JSON.stringify(demoUser));
        showToast(`Logged in as Demo ${role}: Explore the platform with sample data.`, 'success');
        setLoading(false);
        return;
      }

      const existingUser = findUserByEmail(email);

      if (existingUser) {
        if (existingUser.password === password) {
          if (existingUser.role !== role) {
            showToast(`Role Mismatch: Your account is a ${existingUser.role}, not a ${role}.`,'error');
          } else {
            setCurrentUser(existingUser);
            safeStorage.setItem('kk_currentUser', JSON.stringify(existingUser));
            showToast(`Welcome back, ${existingUser.name}!`, 'success');
          }
        } else {
          showToast('Invalid Credentials: The password you entered is incorrect.','error');
        }
      } else {
        showToast('New User? Creating Account... You will be guided through onboarding.','info');
        const newProfile: ArtistProfile = {
          id: `user_${Date.now()}`,
          name: email.split('@')[0],
          email,
          password,
          role,
          onboardingComplete: false,
        };
        await addUser(newProfile);
        const newUser = findUserByEmail(email);
        if (newUser) {
          setCurrentUser(newUser);
          safeStorage.setItem('kk_currentUser', JSON.stringify(newUser));
          showToast(`Account created for ${newUser.name}!`, 'success');
        } else {
          showToast('Error creating account. Please try again.', 'error');
        }
      }
      setLoading(false);
    },
    [findUserByEmail, addUser, showToast, users, openWalletModal]
  );

  const signup = useCallback(
    async (profile: ArtistProfile) => {
      if (findUserByEmail(profile.email)) {
        showToast('Registration Failed: An account with this email already exists.', 'error');
        return;
      }
      await addUser(profile);
      const newUser = findUserByEmail(profile.email);
      if (newUser) {
        setCurrentUser(newUser);
        safeStorage.setItem('kk_currentUser', JSON.stringify(newUser));
        showToast(`Account created for ${newUser.name}! Please complete your profile.`, 'success');
      } else {
        showToast('Error creating account.', 'error');
      }
    },
    [findUserByEmail, addUser, showToast]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    safeStorage.removeItem('kk_currentUser');
    showToast('You have been logged out.', 'success');
  }, [showToast]);

  const value = { currentUser, loading, login, logout, signup, setCurrentUser, connectWallet };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
