// Script d'initialisation de la base de données MongoDB
// À placer dans un dossier 'mongo-init' à la racine du projet
db = db.getSiblingDB('news_aggregator');

// Création des collections
db.createCollection('sources');
db.createCollection('articles');
db.createCollection('users');
db.createCollection('analytics');
db.createCollection('collections');

// Fonction pour créer un utilisateur thématique
function createThematicUser(theme, displayName) {
  const email = `${theme.toLowerCase()}@mediascan.app`;
  try {
    const avatarUrl = `https://avatar.iran.liara.run/public/girl?username=${theme.toLowerCase()}`;
    const user = db.users.insertOne({
      email: email,
      username: displayName,
      password: '$2a$10$qnIjKn5XIQh42wN8IhNBxeT.NG2xgDlHJpLKxn8heFNpJ7W7P8Sw.', // Hash pour "123456"
      avatar: avatarUrl,
      avatarType: 'url',
      isVerified: true,
      verificationToken: '',
      verificationTokenExpires: new Date('2025-06-10'),
      onboardingCompleted: true,
      savedArticles: [],
      socialLinks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      bio: `Curateur de la collection ${displayName}`,
      name: displayName,
      role: 'curator',
    });
    print(`Utilisateur ${displayName} créé avec succès avec l'avatar: ${avatarUrl}`);
    return user;
  } catch (e) {
    print(`Erreur lors de la création de l'utilisateur ${displayName}: ${e.message}`);
    return null;
  }
}

// Création des utilisateurs thématiques
const aiUser = createThematicUser('ai', 'Caroline Tolken');
const cyberUser = createThematicUser('cybersecurity', 'Bénédicte Laffite');
const ecoUser = createThematicUser('ecology', 'Sophie Gaspard');
const industryUser = createThematicUser('industry', 'Emma Girelles');
const geopoliticsUser = createThematicUser('geopolitics', 'Claudine Duchêne');

// Création de l'utilisateur système Médiascan
const systemUser = db.users.insertOne({
  email: 'system@news-aggregator.app',
  username: 'Médiascan',
  password: '$2a$10$qnIjKn5XIQh42wN8IhNBxeT.NG2xgDlHJpLKxn8heFNpJ7W7P8Sw.', // Hash pour "123456"
  role: 'admin',
  isActive: true,
  avatar: 'https://avatar.iran.liara.run/public/girl?username=mediascan',
  avatarType: 'url',
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Import des sources thématiques
load('mongo-init/sources/ai.js');
// load('mongo-init/sources/cybersecurity.js');
// load('mongo-init/sources/ecology.js');
// load('mongo-init/sources/industry.js');
// load('mongo-init/sources/geopolitics.js');

// Création des index pour optimiser les requêtes
db.sources.createIndex({ name: 1 }, { unique: true });
db.articles.createIndex({ link: 1 }, { unique: true });
db.articles.createIndex({ publishedAt: -1 });
db.articles.createIndex({ sourceId: 1 });
db.users.createIndex({ email: 1 }, { unique: true });

// Ajout des index pour les collections
db.collections.createIndex({ userId: 1 });
db.collections.createIndex({ name: 'text' });
db.collections.createIndex({ isPublic: 1 });
