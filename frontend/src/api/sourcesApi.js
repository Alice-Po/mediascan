import api from './index';

/**
 * Récupérer les sources activées par l'utilisateur
 * @returns {Promise} Liste des sources activées par l'utilisateur
 */
export const fetchUserSources = async () => {
  try {
    const response = await api.get('/sources/user');

    // S'assurer que les sources sont marquées comme enabled
    const sources = Array.isArray(response.data)
      ? response.data.map((source) => ({ ...source, enabled: true }))
      : [];

    return sources;
  } catch (error) {
    console.error('Error fetching user sources:', error);
    throw error;
  }
};

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
 * Ajouter une source à l'utilisateur
 * @param {Object} sourceData - Données de la source
 * @returns {Promise} Source ajoutée
 */
export const addUserSource = async (sourceData) => {
  try {
    console.log('Adding source with data:', sourceData); // Debug log
    const response = await api.post('/sources/user', {
      ...sourceData,
      isUserAdded: true, // Ajouter ce flag
    });
    return response.data;
  } catch (error) {
    console.error('Error details:', error.response?.data); // Debug log
    throw error;
  }
};

/**
 * Activer une source pour l'utilisateur
 * @param {string} sourceId - ID de la source à activer
 */
export const enableUserSource = async (sourceId) => {
  try {
    const response = await api.post(`/sources/user/${sourceId}/enable`);
    return response.data;
  } catch (error) {
    console.error('Error enabling source:', error);
    throw error;
  }
};

/**
 * Désactiver une source pour l'utilisateur
 * @param {string} sourceId - ID de la source à désactiver
 */
export const disableUserSource = async (sourceId) => {
  try {
    const response = await api.post(`/sources/user/${sourceId}/disable`);
    return response.data;
  } catch (error) {
    console.error('Error disabling source:', error);
    throw error;
  }
};

/**
 * Supprimer une source personnalisée
 * @param {string} sourceId - ID de la source
 * @returns {Promise} Statut de la suppression
 */
export const deleteUserSource = async (sourceId) => {
  try {
    const response = await api.delete(`/sources/user/${sourceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
