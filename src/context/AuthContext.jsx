import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Function to load the user profile
  const getProfile = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await api.get('/auth/profile');
      setUser(res.data.user);
    } catch (error) {
      console.error('Error fetching profile', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/signup', userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updateData) => {
    const res = await api.put('/auth/profile', updateData);
    setUser(res.data.user);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        getProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
