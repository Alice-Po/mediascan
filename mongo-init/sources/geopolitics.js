// Sources Géopolitique

// Création de la collection Géopolitique
const geoCollection = db.collections.insertOne({
  name: 'Géopolitique [Demo]',
  description:
    "Sources d'actualités sur la géopolitique, les relations internationales et les enjeux stratégiques",
  userId: geopoliticsUser.insertedId,
  isPublic: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

print('Collection Géopolitique créée avec succès. ID: ' + geoCollection.insertedId);

// Mise à jour de l'avatar de l'utilisateur
db.users.updateOne(
  { _id: geopoliticsUser.insertedId },
  {
    $set: {
      avatar: 'https://avatar.iran.liara.run/public/girl?username=geopolitics',
      avatarType: 'url',
      defaultCollection: geoCollection.insertedId,
    },
  }
);

// Insertion des sources
const sources = [
  {
    name: 'Le Monde Diplomatique',
    url: 'https://www.monde-diplomatique.fr/',
    rssUrl: 'https://www.monde-diplomatique.fr/rss',
    faviconUrl: 'https://www.monde-diplomatique.fr/favicon.ico',
    description:
      'Mensuel français de référence en géopolitique et relations internationales. Analyses approfondies et enquêtes sur les dynamiques globales',
    funding: {
      type: 'private',
      details: 'Groupe Le Monde',
    },
    orientations: ['geopolitics', 'analysis'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
    status: 'active',
  },
  {
    name: 'Le Monde - Géopolitique',
    url: 'https://www.lemonde.fr/podcasts/geopolitique/',
    rssUrl: 'https://www.lemonde.fr/geopolitique/rss_full.xml',
    faviconUrl: 'https://www.lemonde.fr/favicon.ico',
    description:
      'Podcast du Monde analysant les grands enjeux géopolitiques mondiaux avec des experts et journalistes.',
    funding: {
      type: 'private',
      details: 'Groupe Le Monde',
    },
    orientations: ['geopolitics', 'podcast'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
    status: 'active',
  },
  {
    name: 'The Foreign Policy Podcast',
    url: 'https://foreignpolicy.com/podcasts/',
    rssUrl: 'https://foreignpolicy.com/podcasts/feed/',
    faviconUrl: 'https://foreignpolicy.com/favicon.ico',
    description:
      'Podcast de Foreign Policy abordant les dynamiques géopolitiques globales avec des experts et des décideurs.',
    funding: {
      type: 'private',
      details: 'Foreign Policy (média commercial)',
    },
    orientations: ['geopolitics', 'podcast'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
    status: 'active',
  },
  {
    name: 'Ifri (Institut français des relations internationales)',
    url: 'https://www.ifri.org/fr',
    rssUrl: 'https://www.ifri.org/rss.xml',
    faviconUrl: 'https://www.ifri.org/favicon.ico',
    description:
      'Think tank français analysant les dynamiques géopolitiques et stratégiques mondiales. Rapports et études approfondies.',
    funding: {
      type: 'non-profit',
      details: 'Financement par subventions et partenariats',
    },
    orientations: ['geopolitics', 'research'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
    status: 'active',
  },
  {
    name: 'r/geopolitics',
    url: 'https://www.reddit.com/r/geopolitics/',
    rssUrl: 'https://www.reddit.com/r/geopolitics/.rss',
    faviconUrl: 'https://www.reddit.com/favicon.ico',
    description:
      'Subreddit international dédié aux discussions sur la géopolitique, les relations internationales et les conflits.',
    funding: {
      type: 'community',
      details: 'Reddit (communauté)',
    },
    orientations: ['geopolitics', 'community'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
    status: 'active',
  },
  {
    name: 'European Council on Foreign Relations',
    url: 'https://ecfr.eu/',
    rssUrl: 'https://ecfr.eu/rss',
    faviconUrl: 'https://ecfr.eu/favicon.ico',
    description:
      "Think tank européen analysant les relations internationales et les politiques étrangères de l'UE.",
    funding: {
      type: 'non-profit',
      details: 'Financement par dons et subventions',
    },
    orientations: ['geopolitics', 'research'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
    status: 'active',
  },
  {
    name: 'Diploweb',
    url: 'https://www.diploweb.com/',
    rssUrl: 'https://www.diploweb.com/spip.php?page=backend',
    faviconUrl: 'https://www.diploweb.com/favicon.ico',
    description:
      'Revue géopolitique en ligne. Analyses approfondies des relations internationales.',
    funding: {
      type: 'independent',
      details: 'Association à but non lucratif',
    },
    orientations: ['geopolitics', 'analysis'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    fetchStatus: {
      success: true,
      message: '',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
    status: 'active',
  },
];

// Insertion des sources et récupération de leurs IDs
const insertedSources = db.sources.insertMany(sources);

// Mise à jour de la collection avec les références des sources
db.collections.updateOne(
  { _id: geoCollection.insertedId },
  {
    $set: {
      sources: Object.values(insertedSources.insertedIds),
      updatedAt: new Date(),
    },
  }
);

print('Sources Géopolitique ajoutées à la collection avec succès.');
