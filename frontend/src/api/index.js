import axios from 'axios';

console.log('Environment variables:', import.meta.env);

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
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

// Intercepteur pour les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default api;
