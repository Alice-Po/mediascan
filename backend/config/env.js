import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Déterminer le mode d'exécution
const mode = process.env.NODE_ENV || 'development';

// Configuration par défaut pour les tests
const testConfig = {
  MONGODB_URI: 'mongodb://localhost:27017/test',
  JWT_SECRET: 'test-secret-key',
  CORS_ORIGIN: 'http://localhost:5173',
  PORT: 5000,
  MAX_USER_SOURCES: 10,
  ARTICLE_RETENTION_DAYS: 7,
  MAX_ARTICLES_PER_PAGE: 50,
  FRONTEND_URL: 'http://localhost:5173',
  ALLOWED_HOSTS: 'localhost',
  LISTEN_INTERFACE: 'localhost',
  TRUSTED_PROXIES: '127.0.0.1',
  ALLOWED_ORIGINS: 'http://localhost:5173',
};

// En mode test, utiliser la configuration de test
if (mode === 'test') {
  Object.entries(testConfig).forEach(([key, value]) => {
    process.env[key] = value;
  });
} else {
  // Charger le fichier d'environnement approprié pour les autres modes
  const envFile = `.env.${mode}`;
  dotenv.config({ path: path.resolve(__dirname, '..', envFile) });
}

// Vérifier les variables requises
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'CORS_ORIGIN'];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  throw new Error(`Variables d'environnement manquantes: ${missingEnvVars.join(', ')}`);
}

// Configuration centralisée
const config = {
  mode,
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d',
    refreshExpiresIn: '30d',
  },
  cors: {
    origin:
      mode === 'development'
        ? [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://192.168.1.10:5173',
            'https://1d71-2a02-8434-9be0-701-5f05-7f20-f655-fb30.ngrok-free.app',
          ]
        : process.env.CORS_ORIGIN?.split(',') || [],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // 24 heures
  },
  limits: {
    maxUserSources: parseInt(process.env.MAX_USER_SOURCES, 10) || 10,
    articleRetentionDays: parseInt(process.env.ARTICLE_RETENTION_DAYS, 10) || 7,
    maxArticlesPerPage: parseInt(process.env.MAX_ARTICLES_PER_PAGE, 10) || 50,
  },
  email: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_APP_PASSWORD,
  },
  frontendUrl: process.env.FRONTEND_URL,
  isDev: mode === 'development',
  security: {
    allowedHosts: (process.env.ALLOWED_HOSTS || 'localhost').split(','),
    listenInterface: process.env.LISTEN_INTERFACE || 'localhost',
    trustedProxies: (process.env.TRUSTED_PROXIES || '127.0.0.1').split(','),
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(','),
  },
};

export default config;
