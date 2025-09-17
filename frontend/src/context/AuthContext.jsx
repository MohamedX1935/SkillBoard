import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';

const AuthContext = createContext();

const storageKey = 'skillboard_auth';

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setToken(parsed.token);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  const login = useCallback(async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    setUser(data.data.user);
    setToken(data.data.token);
    localStorage.setItem(storageKey, JSON.stringify({ user: data.data.user, token: data.data.token }));
    navigate('/');
  }, [navigate]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(storageKey);
    navigate('/login');
  }, [navigate]);

  const value = useMemo(() => ({ user, token, login, logout, loading, setUser }), [user, token, login, logout, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
