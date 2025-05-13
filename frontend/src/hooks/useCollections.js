import { useState, useEffect, useCallback } from 'react';
import {
  fetchCollections,
  fetchCollectionById,
  createCollection as apiCreateCollection,
  updateCollection as apiUpdateCollection,
  deleteCollection as apiDeleteCollection,
  addSourceToCollection as apiAddSourceToCollection,
  removeSourceFromCollection as apiRemoveSourceFromCollection,
} from '../api/collectionsApi';

/**
 * Hook personnalisé pour gérer les collections de sources
 *
 * @param {Object} user - L'utilisateur actuel
 * @param {Function} setGlobalError - Fonction optionnelle pour mettre à jour l'erreur globale
 * @returns {Object} État et fonctions pour gérer les collections
 */
export function useCollections(user, setGlobalError) {
  // États
  const [collections, setCollections] = useState([]);
  const [currentCollection, setCurrentCollection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper pour gérer les erreurs
  const handleError = useCallback(
    (errorMessage, errorObj) => {
      console.error(errorMessage, errorObj);
      setError(errorMessage);

      // Propager l'erreur au contexte parent si la fonction est fournie
      if (setGlobalError) {
        setGlobalError(errorMessage);
      }
    },
    [setGlobalError]
  );

  /**
   * Charger toutes les collections de l'utilisateur
   */
  const loadCollections = useCallback(async () => {
    // Log pour déboguer le problème de chargement des collections
    console.log(
      'loadCollections appelé avec user:',
      user ? `ID: ${user._id}` : 'aucun utilisateur'
    );

    if (!user) {
      console.warn('Tentative de chargement des collections sans utilisateur connecté');
      return;
    }

    try {
      console.log('Début du chargement des collections pour', user._id);
      setLoading(true);
      const collectionsData = await fetchCollections();
      console.log('Collections récupérées:', collectionsData.length);

      // Ajouter le nom du créateur à chaque collection
      const enhancedCollections = collectionsData.map((collection) => {
        // Si la collection appartient à l'utilisateur actuel, ajouter son nom
        // Sinon, laisser le creator comme undefined ou tel qu'il est
        if (collection.userId === user._id) {
          return {
            ...collection,
            creator: user.name || 'Vous',
          };
        }
        return collection;
      });

      setCollections(enhancedCollections);
      setError(null);
      return enhancedCollections;
    } catch (err) {
      console.error('Erreur détaillée lors du chargement des collections:', err);
      handleError('Impossible de charger les collections', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, handleError]);

  /**
   * Charger une collection spécifique par son ID
   *
   * @param {string} collectionId - L'ID de la collection à charger
   * @returns {Object} La collection chargée
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
   *
   * @param {Object} collectionData - Données de la collection à créer
   * @returns {Object} La nouvelle collection créée
   */
  const createCollection = useCallback(
    async (collectionData) => {
      try {
        setLoading(true);
        const newCollection = await apiCreateCollection(collectionData);
        setCollections((prev) => [...prev, newCollection]);
        setError(null);
        return newCollection;
      } catch (err) {
        handleError('Impossible de créer la collection', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  /**
   * Mettre à jour une collection existante
   *
   * @param {string} collectionId - L'ID de la collection à mettre à jour
   * @param {Object} collectionData - Nouvelles données de la collection
   * @returns {Object} La collection mise à jour
   */
  const updateCollection = useCallback(
    async (collectionId, collectionData) => {
      try {
        setLoading(true);
        const updatedCollection = await apiUpdateCollection(collectionId, collectionData);

        // Mettre à jour la liste des collections
        setCollections((prev) =>
          prev.map((collection) =>
            collection._id === collectionId ? updatedCollection : collection
          )
        );

        // Mettre à jour la collection courante si nécessaire
        if (currentCollection && currentCollection._id === collectionId) {
          setCurrentCollection(updatedCollection);
        }

        setError(null);
        return updatedCollection;
      } catch (err) {
        handleError('Impossible de mettre à jour la collection', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentCollection, handleError]
  );

  /**
   * Supprimer une collection
   *
   * @param {string} collectionId - L'ID de la collection à supprimer
   * @returns {boolean} Succès de l'opération
   */
  const deleteCollection = useCallback(
    async (collectionId) => {
      try {
        setLoading(true);
        await apiDeleteCollection(collectionId);

        // Supprimer de la liste des collections
        setCollections((prev) => prev.filter((collection) => collection._id !== collectionId));

        // Réinitialiser la collection courante si nécessaire
        if (currentCollection && currentCollection._id === collectionId) {
          setCurrentCollection(null);
        }

        setError(null);
        return true;
      } catch (err) {
        handleError('Impossible de supprimer la collection', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentCollection, handleError]
  );

  /**
   * Ajouter une source à une collection
   *
   * @param {string} collectionId - L'ID de la collection
   * @param {string} sourceId - L'ID de la source à ajouter
   * @returns {Object} La collection mise à jour
   */
  const addSourceToCollection = useCallback(
    async (collectionId, sourceId) => {
      try {
        setLoading(true);
        const updatedCollection = await apiAddSourceToCollection(collectionId, sourceId);

        // Mettre à jour la liste des collections
        setCollections((prev) =>
          prev.map((collection) =>
            collection._id === collectionId ? updatedCollection : collection
          )
        );

        // Mettre à jour la collection courante si nécessaire
        if (currentCollection && currentCollection._id === collectionId) {
          setCurrentCollection(updatedCollection);
        }

        setError(null);
        return updatedCollection;
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
   *
   * @param {string} collectionId - L'ID de la collection
   * @param {string} sourceId - L'ID de la source à retirer
   * @returns {Object} La collection mise à jour
   */
  const removeSourceFromCollection = useCallback(
    async (collectionId, sourceId) => {
      try {
        setLoading(true);
        const updatedCollection = await apiRemoveSourceFromCollection(collectionId, sourceId);

        // Mettre à jour la liste des collections
        setCollections((prev) =>
          prev.map((collection) =>
            collection._id === collectionId ? updatedCollection : collection
          )
        );

        // Mettre à jour la collection courante si nécessaire
        if (currentCollection && currentCollection._id === collectionId) {
          setCurrentCollection(updatedCollection);
        }

        setError(null);
        return updatedCollection;
      } catch (err) {
        handleError('Impossible de retirer la source de la collection', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentCollection, handleError]
  );

  /**
   * Créer une fonction de filtrage par collection pour l'intégration avec AppContext
   *
   * @param {Function} setFilters - Fonction de mise à jour des filtres du contexte
   * @returns {Function} Fonction pour filtrer les articles par collection
   */
  const createFilterByCollection = useCallback((setFilters) => {
    return (collectionId) => {
      setFilters((prev) => ({
        ...prev,
        collection: collectionId,
        // Réinitialiser les sources individuelles si on filtre par collection
        sources: [],
      }));
    };
  }, []);

  // Charger les collections au montage ou quand l'utilisateur change
  useEffect(() => {
    if (user) {
      loadCollections();
    } else {
      // Réinitialiser l'état si l'utilisateur n'est pas connecté
      setCollections([]);
      setCurrentCollection(null);
    }
  }, [user, loadCollections]);

  // Exposer toutes les fonctionnalités et états
  return {
    // États
    collections,
    currentCollection,
    loading,
    error,

    // Setters
    setCurrentCollection,

    // Actions
    loadCollections,
    loadCollectionById,
    createCollection,
    updateCollection,
    deleteCollection,
    addSourceToCollection,
    removeSourceFromCollection,

    // Utilitaires
    createFilterByCollection,
  };
}
