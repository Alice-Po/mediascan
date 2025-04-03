import api from './index';

/**
 * Récupérer les sources activées par l'utilisateur
 * @returns {Promise} Liste des sources activées par l'utilisateur
 */
export const fetchUserSources = async () => {
  try {
    console.log('Fetching user sources...');
    const response = await api.get('/sources/user');
    console.log('User sources API response:', {
      status: response.status,
      data: response.data,
    });

    // S'assurer que les sources sont marquées comme enabled
    const sources = Array.isArray(response.data)
      ? response.data.map((source) => ({ ...source, enabled: true }))
      : [];

    console.log('Processed user sources:', sources);
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
    console.log('Updating source:', { sourceId, data });
    const response = await api.put(`/sources/user/${sourceId}`, data);
    console.log('Update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating source:', error);
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
