import api from './index';

/**
 * Récupérer toutes les collections de l'utilisateur
 * @returns {Promise} Liste des collections de l'utilisateur
 */
export const fetchCollections = async () => {
  try {
    const response = await api.get('/collections');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
};

/**
 * Récupérer une collection par son ID
 * @param {string} collectionId - ID de la collection
 * @returns {Promise} Détails de la collection
 */
export const fetchCollectionById = async (collectionId) => {
  try {
    const response = await api.get(`/collections/${collectionId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching collection:', error);
    throw error;
  }
};

/**
 * Créer une nouvelle collection
 * @param {Object} collectionData - Données de la collection
 * @param {string} collectionData.name - Nom de la collection
 * @param {string} collectionData.description - Description de la collection
 * @param {string} collectionData.imageUrl - URL de l'image de la collection
 * @param {Array} collectionData.sources - Liste des IDs de sources
 * @param {boolean} collectionData.isPublic - Indique si la collection est publique
 * @returns {Promise} Collection créée
 */
export const createCollection = async (collectionData) => {
  try {
    const response = await api.post('/collections', collectionData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating collection:', error);
    throw error;
  }
};

/**
 * Mettre à jour une collection
 * @param {string} collectionId - ID de la collection
 * @param {Object} collectionData - Données à mettre à jour
 * @returns {Promise} Collection mise à jour
 */
export const updateCollection = async (collectionId, collectionData) => {
  try {
    const response = await api.put(`/collections/${collectionId}`, collectionData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating collection:', error);
    throw error;
  }
};

/**
 * Supprimer une collection
 * @param {string} collectionId - ID de la collection
 * @returns {Promise} Résultat de la suppression
 */
export const deleteCollection = async (collectionId) => {
  try {
    const response = await api.delete(`/collections/${collectionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting collection:', error);
    throw error;
  }
};

/**
 * Ajouter une source à une collection
 * @param {string} collectionId - ID de la collection
 * @param {string} sourceId - ID de la source à ajouter
 * @returns {Promise} Collection mise à jour
 */
export const addSourceToCollection = async (collectionId, sourceId) => {
  try {
    const response = await api.post(`/collections/${collectionId}/sources`, { sourceId });
    return response.data.data;
  } catch (error) {
    console.error('Error adding source to collection:', error);
    throw error;
  }
};

/**
 * Retirer une source d'une collection
 * @param {string} collectionId - ID de la collection
 * @param {string} sourceId - ID de la source à retirer
 * @returns {Promise} Collection mise à jour
 */
export const removeSourceFromCollection = async (collectionId, sourceId) => {
  try {
    const response = await api.delete(`/collections/${collectionId}/sources/${sourceId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error removing source from collection:', error);
    throw error;
  }
};
