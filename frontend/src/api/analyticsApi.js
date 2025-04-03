import api from './index';

/**
 * Récupérer les données de diversité
 * @returns {Promise} Données sur la diversité des sources consultées
 */
export const fetchDiversityData = async () => {
  try {
    const response = await api.get('/analytics/diversity');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupérer les statistiques de lecture
 * @returns {Promise} Statistiques de lecture de l'utilisateur
 */
export const fetchReadingStats = async () => {
  try {
    const response = await api.get('/analytics/reading');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Enregistrer un événement analytique
 * @param {Object} eventData - Données de l'événement
 * @param {string} eventData.eventType - Type d'événement
 * @param {Object} eventData.metadata - Métadonnées de l'événement
 * @returns {Promise} Événement enregistré
 */
export const trackEvent = async (eventData) => {
  try {
    const response = await api.post('/analytics/track', eventData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Réinitialiser l'historique analytique
 * @returns {Promise} Statut de la réinitialisation
 */
export const resetAnalytics = async () => {
  try {
    const response = await api.delete('/analytics/history');
    return response.data;
  } catch (error) {
    throw error;
  }
};
