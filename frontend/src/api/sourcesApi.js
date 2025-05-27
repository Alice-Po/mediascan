import api from './index';

/**
 * Récupère la liste complète des sources disponibles dans le système
 * @returns {Promise<{data: Array<Source>, success: boolean}>} Liste des sources et statut de la requête
 * @throws {Error} Si la requête échoue
 * @example
 * const sources = await fetchAllSources();
 * console.log(sources.data); // [{ id: '1', name: 'Source 1', ... }, ...]
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
 * Crée une nouvelle source personnalisée dans le système
 * @param {Object} sourceData - Données de la source à créer
 * @param {string} sourceData.name - Nom de la source
 * @param {string} sourceData.url - URL du flux RSS
 * @param {string} [sourceData.description] - Description optionnelle de la source
 * @param {string[]} [sourceData.categories] - Catégories optionnelles de la source
 * @returns {Promise<{success: boolean, data: Source, message?: string}>} Résultat de la création
 * @throws {Error} Si la création échoue ou si les données sont invalides
 * @example
 * const newSource = await apiCreateSource({
 *   name: 'Mon Blog',
 *   url: 'https://monblog.com/rss',
 *   description: 'Mon blog personnel'
 * });
 */
export const apiCreateSource = async (sourceData) => {
  try {
    const response = await api.post('/sources', sourceData);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erreur lors de la création de la source');
    }
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la création de la source:',
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

/**
 * Supprime une source existante du système
 * @param {string} sourceId - Identifiant unique de la source à supprimer
 * @returns {Promise<{success: boolean, message: string}>} Résultat de la suppression
 * @throws {Error} Si la suppression échoue ou si la source n'existe pas
 * @example
 * await apiDeleteSource('123');
 */
export const apiDeleteSource = async (sourceId) => {
  try {
    const response = await api.delete(`/sources/${sourceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupère les détails d'une source spécifique par son ID
 * @param {string} sourceId - Identifiant unique de la source
 * @returns {Promise<Source>} Détails de la source
 * @throws {Error} Si la source n'existe pas ou si la requête échoue
 * @example
 * const source = await fetchSourceById('123');
 * console.log(source.name); // 'Nom de la source'
 */
export const fetchSourceById = async (sourceId) => {
  try {
    const response = await api.get(`/sources/${sourceId}`);
    return response.data.data;
  } catch (error) {
    console.error('Erreur dans fetchSourceById:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Récupère toutes les sources associées aux collections de l'utilisateur connecté
 * @returns {Promise<Array<Source>>} Liste des sources des collections de l'utilisateur
 * @throws {Error} Si l'utilisateur n'est pas connecté ou si la requête échoue
 * @example
 * const userSources = await fetchSourcesFromUserCollections();
 * console.log(userSources); // [{ id: '1', name: 'Source 1', ... }, ...]
 */
export const fetchSourcesFromUserCollections = async () => {
  try {
    const response = await api.get('/sources/user-collections');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des sources des collections utilisateur:', error);
    throw error;
  }
};

/**
 * Vérifie si une source existe déjà dans le système en se basant sur son URL
 * @param {string} url - URL du flux à vérifier
 * @returns {Promise<{exists: boolean, source?: Source, error?: string}>} Résultat de la vérification
 * @example
 * const { exists, source } = await checkSourceExists('https://monblog.com/rss');
 * if (exists) {
 *   console.log('Source déjà existante:', source);
 * }
 */
export const checkSourceExists = async (url) => {
  try {
    const response = await api.get(`/sources/exists?url=${encodeURIComponent(url)}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'existence de la source:", error);
    return { exists: false, error: error.response?.data?.error || error.message };
  }
};

/**
 * Vérifie la validité d'un flux RSS en le testant via l'API backend
 * @param {string} url - URL du flux RSS à vérifier
 * @returns {Promise<{valid: boolean, data?: Object, error?: string}>} Résultat de la validation
 * @example
 * const { valid, data } = await checkRssFluxIsValid('https://monblog.com/rss');
 * if (valid) {
 *   console.log('Flux RSS valide:', data);
 * }
 */
export const checkRssFluxIsValid = async (url) => {
  try {
    const response = await api.post(
      '/sources/check-rss',
      { rssUrl: url },
      { withCredentials: true }
    );
    return { valid: true, data: response.data };
  } catch (error) {
    return {
      valid: false,
      error: error.response?.data?.error || error.message,
    };
  }
};
