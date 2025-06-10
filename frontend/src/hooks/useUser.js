import { useState, useCallback } from 'react';
import { fetchUserDetails, fetchUserPublicCollections } from '../api/userApi';

/**
 * Hook personnalisé pour gérer la logique utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Object} - Objet contenant les données et fonctions liées à l'utilisateur
 */
export const useUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les détails complets de l'utilisateur
  const loadUserDetails = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserDetails(userId);
      setUser(data);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du chargement des détails utilisateur:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Charger les collections publiques de l'utilisateur
  const loadUserPublicCollections = useCallback(async () => {
    if (!userId) return [];

    try {
      const data = await fetchUserPublicCollections(userId);
      return data;
    } catch (err) {
      console.error('Erreur lors du chargement des collections publiques:', err);
      return [];
    }
  }, [userId]);

  return {
    user,
    loading,
    error,
    loadUserDetails,
    loadUserPublicCollections,
  };
};
