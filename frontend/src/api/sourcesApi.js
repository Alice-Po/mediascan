import api from './index';

/**
 * Récupérer les sources activées par l'utilisateur
 * @returns {Promise} Liste des sources activées par l'utilisateur
 */
export const fetchUserSources = async () => {
  try {
    const response = await api.get('/sources/user');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupérer toutes les sources disponibles
 * @returns {Promise} Liste de toutes les sources disponibles
 */
export const fetchAllSources = async () => {
  try {
    console.log('Calling fetchAllSources API');
    const response = await api.get('/sources');
    console.log('API response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching sources:', error);
    throw error;
  }
};

/**
 * Ajouter une source à l'utilisateur
 * @param {string|Object} source - ID de la source ou objet source personnalisée
 * @returns {Promise} Source ajoutée
 */
export const addUserSource = async (source) => {
  try {
    const response = await api.post(
      '/sources/user',
      typeof source === 'string' ? { sourceId: source } : source
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mettre à jour une source utilisateur (activation/désactivation)
 * @param {string} sourceId - ID de la source
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Source mise à jour
 */
export const updateUserSource = async (sourceId, data) => {
  try {
    const response = await api.put(`/sources/user/${sourceId}`, data);
    return response.data;
  } catch (error) {
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
