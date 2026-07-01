import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useContext(AdminAuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
