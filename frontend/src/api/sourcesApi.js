import api from './index';

/**
 * Récupérer toutes les sources disponibles
 * @returns {Promise} Liste de toutes les sources disponibles
 */
export const fetchAllSources = async () => {
  try {
    const response = await api.get('/sources');
    return response.data;
  } catch (error) {
    console.error('Error fetching sources:', error);
    throw error;
  }
};

/**
 * Créer une source personnalisée et l'ajouter à une collection
 * @param {Object} sourceData - Données de la source à ajouter
 * @returns {Promise} Statut de la création
 */
export const createSource = async (sourceData) => {
  try {
    const response = await api.post('/sources', sourceData);
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la création de la source:',
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Supprimer une source personnalisée
 * @param {string} sourceId - ID de la source
 * @returns {Promise} Statut de la suppression
 */
export const deleteSource = async (sourceId) => {
  try {
    const response = await api.delete(`/sources/${sourceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSourceById = async (sourceId) => {
  try {
    const response = await api.get(`/sources/${sourceId}`);
    return response.data.data;
  } catch (error) {
    console.error('Erreur dans fetchSourceById:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchSourcesFromUserCollections = async () => {
  try {
    const response = await api.get('/sources/user-collections');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des sources des collections utilisateur:', error);
    throw error;
  }
};

/**
 * Vérifier si une source existe déjà en base par son URL
 * @param {string} url - L'URL du flux à vérifier
 * @returns {Promise<{exists: boolean, source?: object, error?: string}>}
 */
export const checkSourceExists = async (url) => {
  try {
    const response = await api.get(`/sources/exists?url=${encodeURIComponent(url)}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'existence de la source:", error);
    return { exists: false, error: error.response?.data?.error || error.message };
  }
};
