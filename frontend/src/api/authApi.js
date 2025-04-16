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
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error("Erreur d'inscription:", error);
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
 * @param {Object} userData - Nouvelles données utilisateur
 * @returns {Promise} Données utilisateur mises à jour
 */
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  } catch (error) {
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
