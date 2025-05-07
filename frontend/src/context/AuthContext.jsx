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
  const [token, setToken] = useState(null);

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
        setToken(token);
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
      const data = await apiLogin(credentials);

      // Vérifier si l'utilisateur est vérifié
      if (data.user && !data.user.isVerified) {
        throw new Error('Veuillez vérifier votre email avant de vous connecter');
      }

      // Stocker le token
      localStorage.setItem('token', data.token);

      // Mettre à jour le contexte
      setUser(data.user);
      setToken(data.token);

      // Rediriger vers l'onboarding si nécessaire
      if (data.user && !data.user.onboardingCompleted) {
        window.location.href = '/onboarding';
      } else {
        window.location.href = '/app';
      }

      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
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
    setToken(null);
  };

  const refreshUserToken = async () => {
    try {
      const { token } = await apiRefreshToken();
      localStorage.setItem('token', token);
      setToken(token);
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
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
