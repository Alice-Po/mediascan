import { useState, useCallback } from 'react';
import { fetchAllSources, apiCreateSource } from '../api/sourcesApi';

export const useSources = () => {
  const [allSources, setAllSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Ajouter une source personnalisée
  const createSource = useCallback(async (sourceData) => {
    try {
      setLoading(true);
      return await apiCreateSource(sourceData);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    allSources,
    loading,
    error,
    loadAllSources,
    createSource,
  };
};
