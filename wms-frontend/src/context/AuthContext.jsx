import { createContext, useContext, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'wmsAuth';

const getStoredAuth = () => {
  try {
    const storedAuth = localStorage.getItem(STORAGE_KEY);
    return storedAuth ? JSON.parse(storedAuth) : null;
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getStoredAuth);

  const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    const nextAuth = response.data.data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
    setAuth(nextAuth);
    return nextAuth;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  };

  const value = useMemo(() => ({
    token: auth?.token || null,
    user: auth?.user || null,
    isAuthenticated: Boolean(auth?.token),
    isSuperAdmin: auth?.user?.role === 'SUPER_ADMIN',
    isAdmin: auth?.user?.role === 'ADMIN',
    isDemoUser: auth?.user?.role === 'DEMO_USER',
    canEdit: auth?.user?.role === 'SUPER_ADMIN' || auth?.user?.role === 'ADMIN',
    login,
    logout
  }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
