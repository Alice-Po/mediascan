// Script d'initialisation de la base de données MongoDB
// À placer dans un dossier 'mongo-init' à la racine du projet

db = db.getSiblingDB('news_aggregator');

// Création des collections
db.createCollection('sources');
db.createCollection('articles');
db.createCollection('users');
db.createCollection('analytics');

// Ajout de quelques sources préconfigurées (exemples)
db.sources.insertMany([
  {
    name: 'Le Monde',
    url: 'https://www.lemonde.fr',
    rssUrl: 'https://www.lemonde.fr/rss/une.xml',
    faviconUrl: 'https://www.lemonde.fr/favicon.ico',
    categories: ['politique', 'économie', 'international'],
    orientation: {
      political: 'centre',
      type: 'mainstream',
      structure: 'institutionnel',
      scope: 'généraliste',
    },
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date(),
  },
  {
    name: 'Le Figaro',
    url: 'https://www.lefigaro.fr',
    rssUrl: 'https://www.lefigaro.fr/rss/figaro_actualites.xml',
    faviconUrl: 'https://www.lefigaro.fr/favicon.ico',
    categories: ['politique', 'économie', 'société'],
    orientation: {
      political: 'droite',
      type: 'mainstream',
      structure: 'institutionnel',
      scope: 'généraliste',
    },
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date(),
  },
  {
    name: 'Libération',
    url: 'https://www.liberation.fr',
    rssUrl: 'https://www.liberation.fr/rss/',
    faviconUrl: 'https://www.liberation.fr/favicon.ico',
    categories: ['politique', 'société', 'culture'],
    orientation: {
      political: 'gauche',
      type: 'mainstream',
      structure: 'institutionnel',
      scope: 'généraliste',
    },
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date(),
  },
  // Tu pourras ajouter les 47 autres sources ici
]);

// Création des index pour optimiser les requêtes
db.sources.createIndex({ name: 1 }, { unique: true });
db.articles.createIndex({ link: 1 }, { unique: true });
db.articles.createIndex({ pubDate: -1 });
db.articles.createIndex({ sourceId: 1 });
db.users.createIndex({ email: 1 }, { unique: true });
