import React, { createContext, useState, useEffect } from 'react';
import { getAdminProfile, logoutAdmin } from '../services/adminApi';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (token) {
          const res = await getAdminProfile();
          if (res.success) {
            setAdmin(res.data);
          } else {
            logoutAdmin();
            setAdmin(null);
          }
        }
      } catch (error) {
        console.error("Admin session verification failed", error);
        logoutAdmin();
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = (data) => {
    setAdmin(data);
  };

  const logout = () => {
    logoutAdmin();
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
