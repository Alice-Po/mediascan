import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getUserProfile } from '../api/authApi';

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

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const token = localStorage.getItem('token');
    if (token) {
      getUserProfile()
        .then((data) => {
          setUser(data.user);
        })
        .catch((err) => {
          console.error('Erreur lors de la récupération du profil:', err);
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const data = await apiLogin(credentials);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message || 'Erreur lors de la connexion');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const data = await apiRegister(userData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setError(null);
      return data;
    } catch (err) {
      console.error('Register error:', err);
      setError(err.message || "Erreur lors de l'inscription");
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
