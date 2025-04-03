import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configuration ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import des configurations et services
import connectDB from './config/database.js';
import { fetchAllSources } from './services/rssFetcher.js';

// Import des routes
import authRoutes from './routes/authRoutes.js';
import sourceRoutes from './routes/sourceRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Configuration de l'environnement
const PORT = process.env.PORT || 5000;

// Initialisation de l'application Express
const app = express();

// Connexion à la base de données
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
  console.log('Exécution de la tâche planifiée: récupération des flux RSS');
  try {
    await fetchAllSources();
    console.log('Récupération des flux RSS terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de la récupération des flux RSS:', error);
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
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
