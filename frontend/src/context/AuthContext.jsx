import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, refreshToken } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Vérification du token au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // Vérifier si le token est valide
          const userData = await refreshToken();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          // Token invalide ou expiré
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Fonction de connexion
  const handleLogin = async (email, password) => {
    setError(null);
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);

      // Redirection selon l'état d'onboarding
      if (data.user.onboardingCompleted) {
        navigate('/');
      } else {
        navigate('/onboarding');
      }

      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
      throw err;
    }
  };

  // Fonction d'inscription
  const handleRegister = async (name, email, password) => {
    setError(null);
    try {
      const data = await register(name, email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);

      // Rediriger vers l'onboarding
      navigate('/onboarding');

      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur d'inscription");
      throw err;
    }
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Fonction pour mettre à jour les données utilisateur
  const updateUser = (userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData,
    }));
  };

  // Valeur du contexte
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
