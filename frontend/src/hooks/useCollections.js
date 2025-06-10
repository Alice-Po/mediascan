import { useState, useEffect, useCallback } from 'react';
import {
  fetchOwnedCollections,
  fetchPublicCollections,
  fetchCollectionById,
  apiCreateCollection,
  apiUpdateCollection,
  apiDeleteCollection,
  apiAddSourceToCollection,
  apiRemoveSourceFromCollection,
  apiFollowCollection,
  apiUnfollowCollection,
  apiCheckIfFollowing,
  fetchFollowedCollections,
} from '../api/collectionsApi';

/**
 * Hook personnalisé pour gérer les collections de sources
 *
 * @param {Object} user - L'utilisateur actuel
 * @param {Function} setGlobalError - Fonction optionnelle pour mettre à jour l'erreur globale
 * @returns {Object} État et fonctions pour gérer les collections
 */
export function useCollections(user, setGlobalError) {
  // États pour les différentes catégories de collections
  const [ownedCollections, setOwnedCollections] = useState([]);
  const [followedCollections, setFollowedCollections] = useState([]);
  const [allFollowedAndOwnedCollections, setAllFollowedAndOwnedCollections] = useState([]);
  const [publicCollections, setPublicCollections] = useState([]);
  const [defaultCollection, setDefaultCollection] = useState(null);
  const [currentCollection, setCurrentCollection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper pour gérer les erreurs
  const handleError = useCallback(
    (errorMessage, errorObj) => {
      console.error(errorMessage, errorObj);
      setError(errorMessage);

      if (setGlobalError) {
        setGlobalError(errorMessage);
      }
    },
    [setGlobalError]
  );

  /**
   * Charger toutes les collections de l'utilisateur (personnelles + suivies)
   */
  const loadAllCollections = useCallback(async () => {
    if (!user) {
      console.warn('Tentative de chargement des collections sans utilisateur connecté');
      return;
    }

    try {
      setLoading(true);
      const [ownedData, followedData] = await Promise.all([
        fetchOwnedCollections(),
        fetchFollowedCollections(),
      ]);

      // Enrichir les collections avec des informations supplémentaires
      const enhancedOwnedCollections = ownedData.map((collection) => ({
        ...collection,
        creator:
          collection.userId === user._id ? user.name || 'Vous' : collection.createdBy?.username,
        isFollowed: false,
      }));

      const enhancedFollowedCollections = followedData.map((collection) => ({
        ...collection,
        creator: collection.createdBy?.username,
        isFollowed: true,
      }));

      // Mettre à jour les états
      setOwnedCollections(enhancedOwnedCollections);
      setFollowedCollections(enhancedFollowedCollections);
      setAllFollowedAndOwnedCollections([
        ...enhancedOwnedCollections,
        ...enhancedFollowedCollections,
      ]);

      // Définir la collection par défaut (la plus récente des collections personnelles)
      if (enhancedOwnedCollections.length > 0) {
        const mostRecent = enhancedOwnedCollections[enhancedOwnedCollections.length - 1];
        setDefaultCollection(mostRecent);
      }

      setError(null);
      return [...enhancedOwnedCollections, ...enhancedFollowedCollections];
    } catch (err) {
      console.error('Erreur détaillée lors du chargement des collections:', err);
      handleError('Impossible de charger les collections', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, handleError]);

  /**
   * Charger les collections publiques
   */
  const loadPublicCollections = useCallback(async () => {
    try {
      setLoading(true);
      const publicData = await fetchPublicCollections();
      setPublicCollections(publicData);
      setError(null);
      return publicData;
    } catch (err) {
      console.error('Erreur lors du chargement des collections publiques:', err);
      handleError('Impossible de charger les collections publiques', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  /**
   * Charger uniquement les collections personnelles de l'utilisateur
   */
  const loadOwnedCollections = useCallback(async () => {
    if (!user) {
      console.warn('Tentative de chargement des collections sans utilisateur connecté');
      return;
    }

    try {
      setLoading(true);
      const collectionsData = await fetchOwnedCollections();
      const enhancedCollections = collectionsData.map((collection) => ({
        ...collection,
        creator:
          collection.userId === user._id ? user.name || 'Vous' : collection.createdBy?.username,
        isFollowed: false,
      }));

      setOwnedCollections(enhancedCollections);
      setError(null);
      return enhancedCollections;
    } catch (err) {
      console.error('Erreur lors du chargement des collections personnelles:', err);
      handleError('Impossible de charger les collections personnelles', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, handleError]);

  /**
   * Charger une collection spécifique par son ID
   */
  const loadCollectionById = useCallback(
    async (collectionId) => {
      try {
        setLoading(true);
        const collection = await fetchCollectionById(collectionId);
        setCurrentCollection(collection);
        setError(null);
        return collection;
      } catch (err) {
        handleError('Impossible de charger la collection', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  /**
   * Créer une nouvelle collection
   */
  const createCollection = useCallback(
    async (collectionData) => {
      try {
        const newCollection = await apiCreateCollection(collectionData);
        setOwnedCollections((prev) => [...prev, newCollection]);
        setError(null);
        return newCollection;
      } catch (error) {
        console.error('Error creating collection:', error);
        handleError('Impossible de créer la collection', error);
        throw error;
      }
    },
    [handleError]
  );

  /**
   * Mettre à jour une collection existante
   */
  const updateCollection = useCallback(
    async (collectionId, collectionData) => {
      try {
        const updatedCollection = await apiUpdateCollection(collectionId, collectionData);
        setOwnedCollections((prev) =>
          prev.map((c) => (c.id === collectionId ? updatedCollection : c))
        );
        setError(null);
        return updatedCollection;
      } catch (error) {
        console.error('Error updating collection:', error);
        handleError('Impossible de mettre à jour la collection', error);
        throw error;
      }
    },
    [handleError]
  );

  /**
   * Supprimer une collection
   */
  const deleteCollection = useCallback(
    async (collectionId) => {
      try {
        await apiDeleteCollection(collectionId);
        setOwnedCollections((prev) => prev.filter((c) => c.id !== collectionId));
        setError(null);
        return true;
      } catch (error) {
        console.error('Error deleting collection:', error);
        handleError('Impossible de supprimer la collection', error);
        throw error;
      }
    },
    [handleError]
  );

  /**
   * Ajouter une source à une collection
   */
  const addSourceToCollection = useCallback(
    async (collectionId, sourceId) => {
      try {
        setLoading(true);
        const result = await apiAddSourceToCollection(collectionId, sourceId);
        console.log('[useCollections] addSourceToCollection API response:', result);
        // Mettre à jour la collection courante si c'est celle qui est modifiée
        if (currentCollection?._id === collectionId) {
          setCurrentCollection((prev) => ({
            ...prev,
            sources: [...(prev.sources || []), result.source],
          }));
        }
        setError(null);
        return result;
      } catch (err) {
        handleError("Impossible d'ajouter la source à la collection", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentCollection, handleError]
  );

  /**
   * Retirer une source d'une collection
   */
  const removeSourceFromCollection = useCallback(
    async (collectionId, sourceId) => {
      try {
        setLoading(true);
        await apiRemoveSourceFromCollection(collectionId, sourceId);
        // Mettre à jour la collection courante si c'est celle qui est modifiée
        if (currentCollection?._id === collectionId) {
          setCurrentCollection((prev) => ({
            ...prev,
            sources: prev.sources.filter((s) => s._id !== sourceId),
          }));
        }
        setError(null);
      } catch (err) {
        handleError('Impossible de retirer la source de la collection', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentCollection, handleError]
  );

  const followCollection = useCallback(
    async (collectionId) => {
      try {
        const result = await apiFollowCollection(collectionId);
        setOwnedCollections((prev) => [...prev, result]);
        setError(null);
        return result;
      } catch (error) {
        console.error('Error following collection:', error);
        handleError('Impossible de suivre la collection', error);
        throw error;
      }
    },
    [handleError]
  );

  const unfollowCollection = useCallback(
    async (collectionId) => {
      try {
        await apiUnfollowCollection(collectionId);
        setOwnedCollections((prev) => prev.filter((c) => c.id !== collectionId));
        setError(null);
      } catch (error) {
        console.error('Error unfollowing collection:', error);
        handleError('Impossible de ne plus suivre la collection', error);
        throw error;
      }
    },
    [handleError]
  );

  const checkIfFollowing = useCallback(
    async (collectionId) => {
      try {
        return await apiCheckIfFollowing(collectionId);
      } catch (error) {
        console.error('Error checking if following collection:', error);
        handleError('Impossible de vérifier si on suit la collection', error);
        throw error;
      }
    },
    [handleError]
  );

  // Charger les collections au montage ou quand l'utilisateur change
  useEffect(() => {
    if (user) {
      loadAllCollections();
    } else {
      // Réinitialiser l'état si l'utilisateur n'est pas connecté
      setOwnedCollections([]);
      setFollowedCollections([]);
      setAllFollowedAndOwnedCollections([]);
      setPublicCollections([]);
      setDefaultCollection(null);
      setCurrentCollection(null);
    }
  }, [user, loadAllCollections]);

  // Exposer toutes les fonctionnalités et états
  return {
    // États
    ownedCollections,
    followedCollections,
    allFollowedAndOwnedCollections,
    publicCollections,
    defaultCollection,
    currentCollection,
    loading,
    error,

    // Setters
    setCurrentCollection,

    // Actions
    loadAllCollections,
    loadOwnedCollections,
    loadPublicCollections,
    loadCollectionById,
    createCollection,
    updateCollection,
    deleteCollection,
    addSourceToCollection,
    removeSourceFromCollection,
    followCollection,
    unfollowCollection,
    checkIfFollowing,
  };
}
