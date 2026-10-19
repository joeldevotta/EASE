import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, AuthUser, UserRole } from '../services/authService';
import { studentAuthApi } from '../services/studentAuthApi';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  loginStudent: (identifier: string, password: string) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  loginStaff: (identifier: string, password: string) => { success: boolean; error?: string; user?: AuthUser };
  loginAdmin: (identifier: string, password: string) => { success: boolean; error?: string; user?: AuthUser };
  loginOfficial: (identifier: string, password: string) => { success: boolean; error?: string; user?: AuthUser };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getSession());

  useEffect(() => {
    const handleStorageChange = () => setUser(authService.getSession());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (user?.role !== 'student') return;
    let cancelled = false;
    studentAuthApi.currentUser()
      .then(validUser => { if (!cancelled) { authService.setSession(validUser); setUser(validUser); } })
      .catch(() => { if (!cancelled) { studentAuthApi.clearToken(); authService.clearSession(); setUser(null); } });
    return () => { cancelled = true; };
  // Validate a stored student session on app start, not after every state update.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginStudent = async (identifier: string, password: string) => {
    const result = await studentAuthApi.login(identifier, password);
    setUser(result.user);
    return { success: true, user: result.user };
  };
  const loginStaff = (identifier: string, password: string) => {
    const result = authService.loginStaff(identifier, password);
    if (result.success && result.user) setUser(result.user);
    return result;
  };
  const loginAdmin = (identifier: string, password: string) => {
    const result = authService.loginAdmin(identifier, password);
    if (result.success && result.user) setUser(result.user);
    return result;
  };
  const loginOfficial = (identifier: string, password: string) => {
    const result = authService.loginOfficial(identifier, password);
    if (result.success && result.user) setUser(result.user);
    return result;
  };
  const logout = () => {
    studentAuthApi.clearToken();
    authService.clearSession();
    setUser(null);
  };

  const value: AuthContextType = { user, isAuthenticated: !!user, role: user?.role || null, loginStudent, loginStaff, loginAdmin, loginOfficial, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
