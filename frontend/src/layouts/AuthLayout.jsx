import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthLayout = () => {
  const { user, loading } = useAuth();

  console.log('AuthLayout rendering:', { user, loading });

  if (loading) {
    console.log('AuthLayout: Loading...');
    return <div>Chargement...</div>;
  }

  if (!user) {
    console.log('AuthLayout: No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('AuthLayout: Rendering children');
  return <Outlet />;
};

export default AuthLayout;
