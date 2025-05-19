import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import { fetchAllSources, checkAllSources } from './services/rssFetcher.js';
import config from './config/env.js';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { networkInterfaces } from 'os';

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
import collectionRoutes from './routes/collectionRoutes.js';

// Variable pour stocker la connexion MongoDB
let mongoConnection;
let server;

// Fonction pour logger les infos de l'application selon le mode
const logAppInfo = (mode) => {
  console.log('\n=== MediaScan Server ===');
  console.log(`Environment: ${mode}`);

  // Déterminer l'interface d'écoute selon le mode
  const listenInterface = mode === 'development' ? '0.0.0.0' : 'localhost';
  console.log(`Server listening on: ${listenInterface}`);

  switch (mode) {
    case 'development':
      console.log('\nDevelopment URLs:');
      console.log(`Frontend: http://localhost:5173`);
      console.log(`API: http://localhost:${config.port}/api`);

      // Afficher les adresses IP locales en développement uniquement
      console.log('\nLocal Network Access:');
      const interfaces = networkInterfaces();
      Object.keys(interfaces).forEach((interfaceName) => {
        interfaces[interfaceName].forEach((iface) => {
          if (iface.family === 'IPv4' && !iface.internal) {
            console.log(`http://${iface.address}:${config.port}`);
          }
        });
      });
      break;

    case 'preview':
      console.log('\nPreview URLs:');
      console.log(`Frontend: http://localhost:4173`); // Port par défaut de Vite preview
      console.log(`API: http://localhost:${config.port}/api`);
      console.log('\nTesting production build locally');
      break;

    case 'production':
      console.log('\nProduction URLs:');
      console.log(`App: http://localhost:${config.port}`);
      console.log(`API: http://localhost:${config.port}/api`);
      break;
  }
  console.log('\nPress Ctrl+C to stop the server\n');
};

// Initialisation de l'application Express
const app = express();

// Activer CORS avant tout autre middleware
app.use(
  cors({
    origin: true, // Autorise l'origine de la requête
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  })
);

// Middleware de debug CORS en développement
if (config.mode === 'development') {
  app.use((req, res, next) => {
    next();
  });
}

// Configuration de la sécurité
app.set('trust proxy', config.security.trustedProxies);

// Middleware de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/sources', sourceRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/collections', collectionRoutes);

// Route de test API uniquement en développement
if (config.mode === 'development') {
  app.get('/api', (req, res) => {
    res.json({ message: "Bienvenue sur l'API de MediaScan (Development)" });
  });
}

// En preview et production, servir le frontend
if (config.mode !== 'development') {
  // Servir les fichiers statiques
  const distPath = path.resolve(__dirname, '../frontend/dist');
  console.log('Serving frontend from:', distPath);

  // Servir les fichiers statiques
  app.use(express.static(distPath));

  // Route catch-all pour le frontend
  app.get('/', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  // Route catch-all pour les sous-routes
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Gestion des erreurs avec plus de détails en développement
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    error: config.mode === 'development' ? err.message : 'Une erreur est survenue',
    ...(config.mode === 'development' && { stack: err.stack }),
  });
});

// CRON jobs avec logs conditionnels
cron.schedule('*/30 * * * *', async () => {
  if (config.mode === 'development') console.log('Exécution du service: récupération des flux RSS');
  try {
    await fetchAllSources();
    if (config.mode === 'development')
      console.log('Récupération des flux RSS terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de la récupération des flux RSS:', error);
  }
});

// Exécuter la récupération des flux RSS au démarrage
fetchAllSources().catch((error) => {
  console.error('Erreur lors de la récupération initiale des flux RSS:', error);
});

// Fonction pour arrêter proprement le serveur
const gracefulShutdown = async () => {
  console.log('\nArrêt du serveur...');

  // Arrêter le serveur HTTP
  if (server) {
    await new Promise((resolve) => {
      server.close(resolve);
    });
    console.log('Serveur HTTP arrêté');
  }

  // Fermer la connexion MongoDB
  if (mongoConnection) {
    await mongoose.disconnect();
    console.log('Connexion MongoDB fermée');
  }

  process.exit(0);
};

// Gestion de l'arrêt propre du serveur
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Connexion MongoDB et démarrage du serveur
if (config.mode !== 'test') {
  mongoose
    .connect(config.mongoUri)
    .then((conn) => {
      mongoConnection = conn;
      console.log('Connected to MongoDB');
      // En production, on écoute sur toutes les interfaces
      const listenInterface =
        config.mode === 'production' ? '0.0.0.0' : config.security.listenInterface;

      server = app.listen(config.port, listenInterface, async () => {
        logAppInfo(config.mode);

        // Lancer la vérification des sources uniquement en développement
        if (process.env.NODE_ENV === 'development') {
          await checkAllSources();
        }
      });
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
}

export default app;
