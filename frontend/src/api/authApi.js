import api from './index';

/**
 * Connexion utilisateur
 * @param {string} email - Adresse email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 * @returns {Promise} Données de l'utilisateur et token
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
};

/**
 * Inscription d'un nouvel utilisateur
 * @param {string} name - Nom de l'utilisateur
 * @param {string} email - Adresse email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 * @returns {Promise} Données de l'utilisateur et token
 */
export const register = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  } catch (error) {
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
    const response = await api.post('/auth/onboarding', preferences);
    return response.data;
  } catch (error) {
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
