import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
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

  if (!allowedRoles.includes(admin.role)) {
    // If a superadmin accidentally hits a regular admin page, bounce them to their panel
    if (admin.role === 'superadmin') {
      return <Navigate to="/admin/superadmin" replace />;
    }
    
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-xl text-center">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p>You do not have the required privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleProtectedRoute;
