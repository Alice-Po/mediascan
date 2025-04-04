import api from './index';

/**
 * Récupérer les articles en fonction des filtres
 * @param {Object} filters - Filtres pour les articles
 * @param {number} filters.page - Numéro de page
 * @param {number} filters.limit - Nombre d'articles par page
 * @param {Array} filters.sources - IDs des sources
 * @param {Array} filters.categories - Catégories
 * @param {Array} filters.orientation - Orientations (format: "type:valeur")
 * @returns {Promise} Articles filtrés et informations de pagination
 */
export const fetchArticles = async (params) => {
  try {
    const response = await api.get('/articles', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

/**
 * Récupérer les détails d'un article
 * @param {string} articleId - ID de l'article
 * @returns {Promise} Détails de l'article
 */
export const fetchArticleDetails = async (articleId) => {
  try {
    const response = await api.get(`/articles/${articleId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Marquer un article comme lu
 * @param {string} articleId - ID de l'article
 * @returns {Promise} Article mis à jour
 */
export const markArticleAsRead = async (articleId) => {
  try {
    const response = await api.post(`/articles/${articleId}/read`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Sauvegarder un article
 * @param {string} articleId - ID de l'article
 * @returns {Promise} Article mis à jour
 */
export const saveArticle = async (articleId) => {
  try {
    console.log('Calling save API for article:', articleId); // Debug log
    const response = await api.post(`/articles/${articleId}/save`);
    return response.data;
  } catch (error) {
    console.error('Error in saveArticle API call:', error.response?.data);
    throw error;
  }
};

/**
 * Désauvegarder un article
 * @param {string} articleId - ID de l'article
 * @returns {Promise} Article mis à jour
 */
export const unsaveArticle = async (articleId) => {
  try {
    const response = await api.delete(`/articles/${articleId}/save`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupérer les articles sauvegardés
 * @returns {Promise} Liste des articles sauvegardés
 */
export const fetchSavedArticles = async () => {
  try {
    const response = await api.get('/articles/saved');
    return response.data;
  } catch (error) {
    throw error;
  }
};
