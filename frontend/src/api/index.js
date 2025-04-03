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
  console.log('Request:', request);
  const token = localStorage.getItem('token');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

// Intercepteur pour gérer les erreurs de token expiré
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response Error:', error.response || error);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
