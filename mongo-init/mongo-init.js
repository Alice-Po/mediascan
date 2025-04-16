// Script d'initialisation de la base de données MongoDB
// À placer dans un dossier 'mongo-init' à la racine du projet
db = db.getSiblingDB('news_aggregator');

// Création des collections
db.createCollection('sources');
db.createCollection('articles');
db.createCollection('users');
db.createCollection('analytics');

// Ajout des sources préconfigurées
db.sources.insertMany([
  {
    name: 'Le Monde',
    url: 'https://www.lemonde.fr',
    rssUrl: 'https://www.lemonde.fr/rss/une.xml',
    faviconUrl: 'https://www.lemonde.fr/favicon.ico',
    categories: ['politique', 'économie', 'international'],
    orientation: {
      political: 'centre',
    },
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date(),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Le Figaro',
    url: 'https://www.lefigaro.fr',
    rssUrl: 'https://www.lefigaro.fr/rss/figaro_actualites.xml',
    faviconUrl: 'https://www.lefigaro.fr/favicon.ico',
    categories: ['politique', 'économie', 'société'],
    orientation: {
      political: 'droite',
    },
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date(),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'France Info',
    url: 'https://www.francetvinfo.fr',
    rssUrl: 'https://www.francetvinfo.fr/titres.rss',
    faviconUrl: 'https://www.francetvinfo.fr/favicon.ico',
    categories: ['actualité', 'politique', 'société', 'international'],
    orientation: {
      political: 'centre',
    },
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date(),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Le Point',
    url: 'https://www.lepoint.fr',
    rssUrl: 'https://www.lepoint.fr/rss.xml',
    faviconUrl: 'https://www.lepoint.fr/favicon.ico',
    categories: ['politique', 'économie', 'culture', 'société'],
    orientation: {
      political: 'centre-droit',
    },
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date(),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "L'Express",
    url: 'https://www.lexpress.fr',
    rssUrl: 'https://www.lexpress.fr/rss/alaune.xml',
    faviconUrl: 'https://www.lexpress.fr/favicon.ico',
    categories: ['politique', 'économie', 'société', 'international'],
    orientation: {
      political: 'centre-droit',
    },
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date(),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Mediapart',
    url: 'https://www.mediapart.fr',
    rssUrl: 'https://www.mediapart.fr/articles/feed',
    faviconUrl: 'https://www.mediapart.fr/favicon.ico',
    categories: ['politique', 'enquête', 'justice', 'société'],
    orientation: {
      political: 'gauche',
    },
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date(),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Le Parisien',
    url: 'https://www.leparisien.fr',
    rssUrl: 'https://feeds.leparisien.fr/leparisien/rss',
    faviconUrl: 'https://www.leparisien.fr/favicon.ico',
    categories: ['actualité', 'société', 'faits divers', 'local'],
    orientation: {
      political: 'centre',
    },
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date(),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'La Croix',
    url: 'https://www.la-croix.com',
    rssUrl: 'https://www.la-croix.com/RSS/UNIVERS',
    faviconUrl: 'https://www.la-croix.com/favicon.ico',
    categories: ['actualité', 'religion', 'société', 'international'],
    orientation: {
      political: 'centre',
    },
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date(),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Le Nouvel Obs',
    url: 'https://www.nouvelobs.com',
    rssUrl: 'https://www.nouvelobs.com/a-la-une/rss.xml',
    faviconUrl: 'https://www.nouvelobs.com/favicon.ico',
    categories: ['politique', 'culture', 'société', 'international'],
    orientation: {
      political: 'centre-gauche',
    },
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date(),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Courrier International',
    url: 'https://www.courrierinternational.com',
    rssUrl: 'https://www.courrierinternational.com/feed/all/rss.xml',
    faviconUrl: 'https://www.courrierinternational.com/favicon.ico',
    categories: ['international', 'géopolitique', 'monde', 'culture'],
    orientation: {
      political: 'centre',
    },
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date(),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "L'Opinion",
    url: 'https://www.lopinion.fr',
    rssUrl: 'https://www.lopinion.fr/rss',
    faviconUrl: 'https://www.lopinion.fr/favicon.ico',
    categories: ['économie', 'politique', 'entreprises', 'finance'],
    orientation: {
      political: 'droite',
    },
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date(),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Ouest France.fr - L'actualité en direct, en continu et en images",
    url: 'https://www.ouest-france.fr/rss/une',
    rssUrl: 'https://www.ouest-france.fr/rss/une',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=https://www.ouest-france.fr/rss/une',
    categories: ['actualité', 'société', 'politique', 'local'],
    orientation: {
      political: 'droite',
    },
    defaultEnabled: false,
    isUserAdded: false,
    addedDate: new Date(),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Reporterre',
    url: 'https://reporterre.net/',
    rssUrl: 'https://reporterre.net/spip.php?page=backend-simple',
    faviconUrl: 'https://reporterre.net/favicon.ico',
    categories: ['environnement'],
    orientation: {
      political: 'écologiste',
    },
    defaultEnabled: false,
    isUserAdded: false,
    addedDate: new Date(),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
  },
]);

// Création des index pour optimiser les requêtes
db.sources.createIndex({ name: 1 }, { unique: true });
db.articles.createIndex({ link: 1 }, { unique: true });
db.articles.createIndex({ publishedAt: -1 });
db.articles.createIndex({ sourceId: 1 });
db.users.createIndex({ email: 1 }, { unique: true });
