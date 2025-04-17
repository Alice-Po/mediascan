import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  getUserProfile,
  refreshToken as apiRefreshToken,
} from '../api/authApi';

// Création du contexte
export const AuthContext = createContext(null);

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};

// Provider du contexte
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculer isAuthenticated en fonction de la présence de l'utilisateur
  const isAuthenticated = !!user;

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { user } = await getUserProfile();
        setUser(user);
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const { token, user } = await apiLogin(credentials);

      if (!user.isVerified) {
        throw new Error('Veuillez vérifier votre email avant de vous connecter');
      }

      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const result = await apiRegister(userData);
      setError(null);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const refreshUserToken = async () => {
    try {
      const { token } = await apiRefreshToken();
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      logout();
      throw error;
    }
  };

  const updateUser = (userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData,
    }));
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUserToken,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
