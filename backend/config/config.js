// Log au début du fichier pour voir les variables d'environnement
console.log("Variables d'environnement:", {
  EMAIL_USER: process.env.EMAIL_USER,
  HAS_EMAIL_PASSWORD: !!process.env.EMAIL_PASSWORD,
});

const config = {
  // Configuration JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '7d',
    refreshExpiresIn: '30d',
  },

  // Limites pour la version gratuite
  limits: {
    maxUserSources: 10,
    articleRetentionDays: 7,
    maxArticlesPerPage: 50,
  },

  mongoUri: process.env.MONGODB_URI,

  email: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

// Vérification détaillée de la configuration au démarrage
console.log('Configuration email:', {
  user: config.email.user,
  hasPassword: !!config.email.password,
  frontendUrl: config.frontendUrl,
});

export default config;
