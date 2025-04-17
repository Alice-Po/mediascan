import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import { fetchAllSources } from './services/rssFetcher.js';
import config from './config/env.js';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';

// Configuration ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Autres imports qui utilisent les variables d'environnement
import connectDB from './config/database.js';

// Import des routes
import authRoutes from './routes/authRoutes.js';
import sourceRoutes from './routes/sourceRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(
  cors({
    ...config.cors,
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
    error: config.isDev ? err.message : 'Une erreur est survenue',
  });
});

// Planification des tâches (CRON)
// Récupération des articles RSS toutes les 30 minutes
cron.schedule('*/30 * * * *', async () => {
  // console.log('Exécution du service: récupération des flux RSS');
  try {
    await fetchAllSources();
    // console.log('Récupération des flux RSS terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de la récupération des flux RSS:', error);
  }
});

// Exécuter la récupération des flux RSS au démarrage
fetchAllSources().catch((error) => {
  console.error('Erreur lors de la récupération initiale des flux RSS:', error);
});

// Connexion MongoDB
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
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
