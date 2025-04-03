const config = {
  // Configuration JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'news-aggregator-secret-dev-key',
    expiresIn: '7d',
    refreshExpiresIn: '30d',
  },

  // Limites pour la version gratuite
  limits: {
    maxUserSources: 10,
    articleRetentionDays: 7,
    maxArticlesPerPage: 50,
  },

  // Catégories disponibles
  categories: [
    'politique',
    'économie',
    'société',
    'culture',
    'sport',
    'sciences',
    'technologie',
    'environnement',
    'santé',
    'international',
  ],

  // Orientations éditoriales
  orientations: {
    political: ['gauche', 'centre-gauche', 'centre', 'centre-droite', 'droite', 'non-spécifié'],
    type: ['mainstream', 'alternatif', 'non-spécifié'],
    structure: ['institutionnel', 'indépendant', 'non-spécifié'],
    scope: ['généraliste', 'spécialisé', 'non-spécifié'],
  },

  mongoUri: process.env.MONGODB_URI,
};

export default config;
