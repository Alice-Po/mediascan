import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fetchAllSources } from './services/rssFetcher.js';
import config from './config/config.js';

dotenv.config();

// Configuration ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import des configurations et services
import connectDB from './config/database.js';

// Import des routes
import authRoutes from './routes/authRoutes.js';
import sourceRoutes from './routes/sourceRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Configuration de l'environnement
const PORT = process.env.PORT || 5000;

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sources', sourceRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/analytics', analyticsRoutes);

// Route de base pour tester l'API
app.get('/', (req, res) => {
  res.json({ message: "Bienvenue sur l'API de l'agrégateur d'actualités" });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue',
  });
});

// Planification des tâches (CRON)
// Récupération des articles RSS toutes les 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('Exécution du service: récupération des flux RSS');
  try {
    await fetchAllSources();
    console.log('Récupération des flux RSS terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de la récupération des flux RSS:', error);
  }
});

// Exécuter la récupération des flux RSS au démarrage
fetchAllSources().catch((error) => {
  console.error('Erreur lors de la récupération initiale des flux RSS:', error);
});

// Initialiser les jobs après la connexion à la base de données
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Gestion de l'arrêt propre du serveur
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu. Arrêt du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT reçu. Arrêt du serveur...');
  process.exit(0);
});
