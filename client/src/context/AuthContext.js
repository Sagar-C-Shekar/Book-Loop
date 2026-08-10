import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('bl_token'));

  const setAuthToken = useCallback((t) => {
    if (t) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
      localStorage.setItem('bl_token', t);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('bl_token');
    }
    setToken(t);
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/auth/me');
      setUser(data);
    } catch {
      setAuthToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setAuthToken]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [token, fetchMe]);

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password, location) => {
    const { data } = await axios.post('/api/auth/register', { name, email, password, location });
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => { setAuthToken(null); setUser(null); };
  const updateUser = (updates) => setUser(prev => ({ ...prev, ...updates }));
  const refreshUser = () => fetchMe();

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
