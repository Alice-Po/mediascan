import axios from 'axios';

// URL de base de l'API avec import.meta.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Création d'une instance Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Log pour debug
api.interceptors.request.use((request) => {
  const token = localStorage.getItem('token');

  // Logs détaillés pour le debug
  console.log('🔍 Détails de la requête:', {
    url: request.url,
    baseURL: request.baseURL,
    fullURL: request.baseURL + request.url,
    method: request.method,
    headers: request.headers,
    data: request.data,
  });

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn(`Requête sans authentification vers ${request.url}`);
  }

  return request;
});

// Intercepteur pour les erreurs
api.interceptors.response.use(
  (response) => {
    // Log de la réponse réussie
    console.log('✅ Réponse API réussie:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    // Log détaillé de l'erreur
    console.error('❌ Erreur API détaillée:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
        headers: error.config?.headers,
      },
    });
    return Promise.reject(error);
  }
);

export default api;
