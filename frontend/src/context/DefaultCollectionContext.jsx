import React, { createContext, useState, useContext, useEffect } from 'react';
import { getDefaultCollection, updateDefaultCollection } from '../api/authApi';
import { useAuth } from './AuthContext';

// Création du contexte
export const DefaultCollectionContext = createContext(null);

// Hook personnalisé pour utiliser le contexte
export const useDefaultCollection = () => {
  const context = useContext(DefaultCollectionContext);
  if (!context) {
    throw new Error(
      "useDefaultCollection doit être utilisé à l'intérieur d'un DefaultCollectionProvider"
    );
  }
  return context;
};

// Provider du contexte
export const DefaultCollectionProvider = ({ children }) => {
  const { user } = useAuth();
  const [defaultCollection, setDefaultCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger la collection par défaut
  useEffect(() => {
    const fetchDefaultCollection = async () => {
      if (!user) {
        setDefaultCollection(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getDefaultCollection();
        if (response.success && response.defaultCollection) {
          setDefaultCollection(response.defaultCollection);
        } else {
          setDefaultCollection(null);
        }
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération de la collection par défaut:', err);
        setError(err);
        setDefaultCollection(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultCollection();
  }, [user]);

  // Mettre à jour la collection par défaut
  const setAsDefault = async (collectionId) => {
    if (!user) return false;

    try {
      setLoading(true);
      const response = await updateDefaultCollection(collectionId);
      if (response.success) {
        // Mettre à jour la collection par défaut dans l'état
        const updatedResponse = await getDefaultCollection();
        if (updatedResponse.success && updatedResponse.defaultCollection) {
          setDefaultCollection(updatedResponse.defaultCollection);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la collection par défaut:', err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si une collection est la collection par défaut
  const isDefaultCollection = (collectionId) => {
    return defaultCollection?._id === collectionId;
  };

  const value = {
    defaultCollection,
    loading,
    error,
    setAsDefault,
    isDefaultCollection,
  };

  return (
    <DefaultCollectionContext.Provider value={value}>{children}</DefaultCollectionContext.Provider>
  );
};
