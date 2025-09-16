// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = ({ children, requiredRole = 'client' }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // If user is not authenticated, save current path and redirect to login
  if (!isAuthenticated()) {
    // Store the path they were trying to access
    localStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but doesn't have required role
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on user's actual role
    if (user?.role === 'admin') {
      return <Navigate to="/admin/halls" replace />;
    } else if (user?.role === 'hall_owner') {
      return <Navigate to="/owner/halls" replace />;
    } else {
      return <Navigate to="/client" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;