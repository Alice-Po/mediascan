import { useState, useCallback } from 'react';
import {
  fetchUserSources,
  fetchAllSources,
  addUserSource,
  enableUserSource,
  disableUserSource,
  deleteUserSource,
} from '../api/sourcesApi';

export const useSources = () => {
  const [sources, setSources] = useState([]);
  const [allSources, setAllSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les sources de l'utilisateur
  const loadUserSources = useCallback(async () => {
    try {
      setLoading(true);
      const userSources = await fetchUserSources();
      setSources(userSources);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger toutes les sources disponibles
  const loadAllSources = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAllSources();
      setAllSources(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Activer une source
  const enableSource = useCallback(
    async (sourceId) => {
      try {
        setLoading(true);
        await enableUserSource(sourceId);
        await loadUserSources(); // Recharger les sources
        return true;
      } catch (error) {
        setError(error.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadUserSources]
  );

  // Désactiver une source
  const disableSource = useCallback(
    async (sourceId) => {
      try {
        setLoading(true);
        await disableUserSource(sourceId);
        await loadUserSources(); // Recharger les sources
        return true;
      } catch (error) {
        setError(error.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadUserSources]
  );

  // Ajouter une source personnalisée
  const addSource = useCallback(
    async (sourceData) => {
      try {
        setLoading(true);
        const result = await addUserSource(sourceData);
        await loadUserSources(); // Recharger les sources
        return result;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [loadUserSources]
  );

  return {
    sources,
    allSources,
    loading,
    error,
    loadUserSources,
    loadAllSources,
    enableSource,
    disableSource,
    addSource,
  };
};
