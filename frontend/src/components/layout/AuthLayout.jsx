import React, { useContext, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

/**
 * Layout pour les pages d'authentification
 * Redirige vers le dashboard si déjà authentifié
 */
const AuthLayout = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Si authentifié, rediriger vers le dashboard
  if (isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }

  // Pendant le chargement, afficher un loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Afficher le contenu des pages d'authentification
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
