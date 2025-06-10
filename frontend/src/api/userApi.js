import api from './index';

/**
 * Fonctions d'API pour la gestion des utilisateurs
 */

/**
 * Récupérer les détails d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Les données de l'utilisateur
 */
export const fetchUserDetails = async (userId) => {
  try {
    console.log('📍 Tentative de récupération des détails utilisateur:', {
      userId,
      endpoint: `/users/${userId}/profile`,
    });

    const response = await api.get(`/users/${userId}/profile`);

    console.log('✅ Détails utilisateur reçus:', {
      status: response.status,
      data: response.data,
    });

    return response.data.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des détails utilisateur:', {
      userId,
      error: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      },
    });
    throw error;
  }
};

/**
 * Récupérer les collections publiques d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Array>} Liste des collections publiques
 */
export const fetchUserPublicCollections = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/collections/public`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user public collections:', error);
    throw error;
  }
};
