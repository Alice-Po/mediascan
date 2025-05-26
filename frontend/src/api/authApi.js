import api from './index';

/**
 * Connexion utilisateur
 * @param {string} email - Adresse email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 * @returns {Promise} Données de l'utilisateur et token
 */
export const login = async (credentials) => {
  try {
    console.log('Tentative de connexion avec:', credentials);
    const response = await api.post('/auth/login', credentials);
    console.log('Réponse du serveur:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur détaillée:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Inscription d'un nouvel utilisateur
 * @param {Object} userData - Données d'inscription (name, email, password)
 * @returns {Promise} Données de l'utilisateur et token
 */
export const register = async (userData) => {
  try {
    console.log('API - Tentative inscription:', userData);
    const response = await api.post('/auth/register', userData);
    console.log('API - Réponse inscription:', response.data);
    return response.data;
  } catch (error) {
    console.error('API - Erreur inscription:', error.response?.data || error);
    throw error;
  }
};

/**
 * Rafraîchissement du token d'authentification
 * @returns {Promise} Nouveau token
 */
export const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mise à jour des préférences d'onboarding
 * @param {Object} preferences - Préférences de l'utilisateur (thématiques, sources)
 * @returns {Promise} Données utilisateur mises à jour
 */
export const completeOnboarding = async (preferences) => {
  try {
    console.log('Envoi des préférences onboarding:', preferences);
    const response = await api.post('/auth/onboarding', preferences);
    console.log('Réponse onboarding API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur API onboarding:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

/**
 * Récupération des données utilisateur
 * @returns {Promise} Données de l'utilisateur
 */
export const getUserProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Mise à jour des données utilisateur
 * @param {Object} profileData - Nouvelles données utilisateur
 * @returns {Promise} Données utilisateur mises à jour
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    throw error;
  }
};

/**
 * Suppression du compte utilisateur
 * @returns {Promise} Statut de la suppression
 */
export const deleteAccount = async () => {
  try {
    const response = await api.delete('/auth/profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupération de la collection par défaut de l'utilisateur
 * @returns {Promise} Collection par défaut de l'utilisateur
 */
export const getDefaultCollection = async () => {
  try {
    const response = await api.get('/auth/default-collection');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la collection par défaut:', error);
    throw error;
  }
};

/**
 * Mise à jour de la collection par défaut de l'utilisateur
 * @param {string} collectionId - ID de la nouvelle collection par défaut
 * @returns {Promise} Données utilisateur mises à jour
 */
export const updateDefaultCollection = async (collectionId) => {
  try {
    const response = await api.put('/auth/default-collection', { collectionId });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la collection par défaut:', error);
    throw error;
  }
};

/**
 * Upload de l'avatar utilisateur (fichier image)
 * @param {File} file - Fichier image à uploader
 * @param {string} token - Token d'authentification
 * @returns {Promise} Résultat de l'upload
 */
export const uploadUserAvatar = async (file, token) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await api.post('/auth/upload/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
