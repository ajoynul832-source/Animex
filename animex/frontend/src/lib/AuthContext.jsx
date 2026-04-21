'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('animex_token');
    if (!token) { setLoading(false); return; }
    try {
      const { user } = await authApi.getMe();
      setUser(user);
    } catch {
      localStorage.removeItem('animex_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (credentials) => {
    const { token, user } = await authApi.login(credentials);
    localStorage.setItem('animex_token', token);
    setUser(user);
    return user;
  };

  const register = async (data) => {
    const { token, user } = await authApi.register(data);
    localStorage.setItem('animex_token', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('animex_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
