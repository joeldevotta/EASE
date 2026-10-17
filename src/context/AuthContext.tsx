import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, AuthUser, UserRole } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  loginStudent: (identifier: string, password: string) => { success: boolean; error?: string; user?: AuthUser };
  loginStaff: (identifier: string, password: string) => { success: boolean; error?: string; user?: AuthUser };
  loginAdmin: (identifier: string, password: string) => { success: boolean; error?: string; user?: AuthUser };
  loginOfficial: (identifier: string, password: string) => { success: boolean; error?: string; user?: AuthUser };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getSession());

  // Listen to window storage events (in case user logs out or modifies session in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(authService.getSession());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loginStudent = (identifier: string, password: string) => {
    const result = authService.loginStudent(identifier, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const loginStaff = (identifier: string, password: string) => {
    const result = authService.loginStaff(identifier, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const loginAdmin = (identifier: string, password: string) => {
    const result = authService.loginAdmin(identifier, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const loginOfficial = (identifier: string, password: string) => {
    const result = authService.loginOfficial(identifier, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    authService.clearSession();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    role: user?.role || null,
    loginStudent,
    loginStaff,
    loginAdmin,
    loginOfficial,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
