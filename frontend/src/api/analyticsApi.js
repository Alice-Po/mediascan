import api from './index';

/**
 * Récupérer les données de lecture
 * @returns {Promise} Données sur la lecture
 */
export const fetchStatisticsData = async () => {
  try {
    const response = await api.get('/analytics/statistics');
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
    console.log('Sending event to API:', eventData); // Log de débogage
    const response = await api.post('/analytics/track', eventData);
    return response.data;
  } catch (error) {
    console.error('Error in trackEvent API call:', error);
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

/**
 * Récupérer les analytics de l'utilisateur pour une période donnée
 * @param {string} period - Période d'analyse ('7days', '30days', '90days')
 */
export const fetchUserAnalytics = async (period = '30days') => {
  try {
    const response = await api.get('/analytics/user', {
      params: { period },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
