import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InfoBanner from '../components/common/InfoBanner';

const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return (
      <>
        <InfoBanner />
        <Navigate to="/login" replace />
      </>
    );
  }

  return (
    <>
      <InfoBanner />
      <Outlet />
    </>
  );
};

export default AuthLayout;
