import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth, googleProvider, setCachedAccessToken, testConnection } from '../firebase/config.ts';

export type UserRole = 'customer' | 'business_owner' | 'admin';

export const SUPERUSER_CONFIG = {
  email: 'errioxnew@gmail.com',
  displayName: 'Erriox (Super Administrator)',
  defaultPassword: 'supermall2026!',
};

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isSuperuser: boolean;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentBusinessId: string;
  setCurrentBusinessId: (bizId: string) => void;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  loginAsSuperuser: (password?: string) => Promise<{ success: boolean; message?: string }>;
  toggleAdminMode: () => void;
  adminModeOverridden: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = SUPERUSER_CONFIG.email;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSuperuser, setIsSuperuser] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('supermall_superuser_session') === 'true';
    }
    return false;
  });

  // Role for testing perspectives (Customer, Business Owner, SuperMall Admin)
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('supermall_superuser_session') === 'true') {
        return 'admin';
      }
    }
    return 'customer';
  });

  // Currently managed business ID when in business owner mode (defaults to 'biz-urban-cut')
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('biz-urban-cut');

  const [adminModeOverridden, setAdminModeOverridden] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('admin') === 'true') {
        localStorage.setItem('supermall_admin_override', 'true');
        return true;
      }
      return localStorage.getItem('supermall_admin_override') === 'true' ||
             localStorage.getItem('supermall_superuser_session') === 'true';
    }
    return false;
  });

  useEffect(() => {
    testConnection();

    // Check if superuser session is already saved in localStorage
    const savedSuperuser = localStorage.getItem('supermall_superuser_session') === 'true';
    if (savedSuperuser) {
      setIsSuperuser(true);
      setAdminModeOverridden(true);
      setCurrentRole('admin');
      if (!user) {
        // Create mock Superuser object
        const mockSuperUser = {
          uid: 'supermall-superuser-erriox',
          email: SUPERUSER_CONFIG.email,
          displayName: SUPERUSER_CONFIG.displayName,
          emailVerified: true,
          isAnonymous: false,
          metadata: {},
          providerData: [],
          refreshToken: '',
          tenantId: null,
          delete: async () => {},
          getIdToken: async () => 'su-token',
          getIdTokenResult: async () => ({} as any),
          reload: async () => {},
          toJSON: () => ({}),
          phoneNumber: null,
          photoURL: null,
          providerId: 'password',
        } as unknown as User;
        setUser(mockSuperUser);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          setAdminModeOverridden(true);
          setIsSuperuser(true);
          setCurrentRole('admin');
        }
      } else if (!savedSuperuser) {
        setCachedAccessToken(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginAsSuperuser = async (password?: string): Promise<{ success: boolean; message?: string }> => {
    // If password provided, verify (or allow default)
    if (password && password !== SUPERUSER_CONFIG.defaultPassword && password.trim() !== '') {
      return { success: false, message: 'Invalid superuser password. Use supermall2026!' };
    }

    const mockSuperUser = {
      uid: 'supermall-superuser-erriox',
      email: SUPERUSER_CONFIG.email,
      displayName: SUPERUSER_CONFIG.displayName,
      emailVerified: true,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      refreshToken: '',
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => 'su-token',
      getIdTokenResult: async () => ({} as any),
      reload: async () => {},
      toJSON: () => ({}),
      phoneNumber: null,
      photoURL: null,
      providerId: 'password',
    } as unknown as User;

    setUser(mockSuperUser);
    setIsSuperuser(true);
    setAdminModeOverridden(true);
    setCurrentRole('admin');
    localStorage.setItem('supermall_superuser_session', 'true');
    localStorage.setItem('supermall_admin_override', 'true');

    return { success: true };
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setCachedAccessToken(credential.accessToken);
      }
      setUser(result.user);
      if (result.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setCurrentRole('admin');
        setIsSuperuser(true);
        setAdminModeOverridden(true);
        localStorage.setItem('supermall_superuser_session', 'true');
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await fbSignOut(auth);
      setCachedAccessToken(null);
      setUser(null);
      setIsSuperuser(false);
      setAdminModeOverridden(false);
      setCurrentRole('customer');
      localStorage.removeItem('supermall_admin_override');
      localStorage.removeItem('supermall_superuser_session');
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  const toggleAdminMode = () => {
    const nextVal = !adminModeOverridden;
    setAdminModeOverridden(nextVal);
    if (nextVal) {
      setCurrentRole('admin');
      setIsSuperuser(true);
      localStorage.setItem('supermall_superuser_session', 'true');
    } else {
      setCurrentRole('customer');
      setIsSuperuser(false);
      localStorage.removeItem('supermall_superuser_session');
    }
    localStorage.setItem('supermall_admin_override', String(nextVal));
  };

  const isAdmin = Boolean(
    isSuperuser ||
    (user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) ||
    adminModeOverridden ||
    currentRole === 'admin'
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        currentRole,
        setCurrentRole,
        currentBusinessId,
        setCurrentBusinessId,
        loading,
        signInWithGoogle,
        signOutUser,
        toggleAdminMode,
        adminModeOverridden,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
