// Sources Géopolitique

// Création de la collection Géopolitique
const geoCollection = db.collections.insertOne({
  name: 'Veille sur la géopolitique',
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
    name: 'IRIS (Institut de Relations Internationales et Stratégiques)',
    url: 'https://www.iris-france.org/',
    rssUrl: 'https://www.iris-france.org/feed/',
    faviconUrl: 'https://www.iris-france.org/favicon.ico',
    description:
      'Think tank français spécialisé en géopolitique et stratégie. Publications, analyses et rapports sur les enjeux internationaux.',
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
    name: 'Diplomatie Magazine',
    url: 'https://www.diplomatie.gouv.fr/fr/',
    rssUrl: 'https://www.diplomatie.gouv.fr/fr/rss.xml',
    faviconUrl: 'https://www.diplomatie.gouv.fr/favicon.ico',
    description:
      'Site officiel du ministère français des Affaires étrangères. Actualités et positions officielles sur la géopolitique mondiale.',
    funding: {
      type: 'government',
      details: 'Ministère français des Affaires étrangères',
    },
    orientations: ['geopolitics', 'government'],
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
    name: 'Le Dessous des Cartes (Arte)',
    url: 'https://www.youtube.com/c/LeDessousDesCartesARTE',
    rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC3POMx8VItBglVZdD9eHnio',
    faviconUrl: 'https://www.youtube.com/favicon.ico',
    description:
      "Chaîne YouTube de l'émission d'Arte, vulgarisant les enjeux géopolitiques à travers des cartes et analyses accessibles.",
    funding: {
      type: 'public',
      details: 'Arte (financement public européen)',
    },
    orientations: ['geopolitics', 'educational'],
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
    name: 'HugoDécrypte',
    url: 'https://www.youtube.com/c/HugoDecrypte',
    rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC1N2eA3BoPByq4w8DVcC8oQ',
    faviconUrl: 'https://www.youtube.com/favicon.ico',
    description:
      "Chaîne YouTube française expliquant l'actualité géopolitique et internationale de manière claire pour un public jeune.",
    funding: {
      type: 'independent',
      details: 'YouTube, sponsors',
    },
    orientations: ['geopolitics', 'awareness'],
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
    name: 'Foreign Affairs',
    url: 'https://www.foreignaffairs.com/',
    rssUrl: 'https://www.foreignaffairs.com/rss.xml',
    faviconUrl: 'https://www.foreignaffairs.com/favicon.ico',
    description:
      'Revue américaine de référence en géopolitique et relations internationales. Articles approfondis par des experts mondiaux.',
    funding: {
      type: 'private',
      details: 'Council on Foreign Relations',
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
    name: 'The Economist - International',
    url: 'https://www.economist.com/international/',
    rssUrl: 'https://www.economist.com/international/rss.xml',
    faviconUrl: 'https://www.economist.com/favicon.ico',
    description:
      'Section internationale de The Economist. Couverture des dynamiques géopolitiques avec un angle économique et stratégique.',
    funding: {
      type: 'private',
      details: 'The Economist Group',
    },
    orientations: ['geopolitics', 'economics'],
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
    name: 'Carnegie Endowment for International Peace',
    url: 'https://carnegieendowment.org/',
    rssUrl: 'https://carnegieendowment.org/rss',
    faviconUrl: 'https://carnegieendowment.org/favicon.ico',
    description:
      'Think tank international axé sur la paix et la géopolitique. Rapports et analyses sur les conflits et la diplomatie.',
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
    name: 'Le Monde - Géopolitique',
    url: 'https://www.lemonde.fr/podcasts/geopolitique/',
    rssUrl: 'https://radio.lemonde.fr/podcasts/geopolitique/feed',
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
    rssUrl: 'https://foreignpolicy.com/feed/podcast/',
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
    name: 'Geopolitical Intelligence Services',
    url: 'https://www.gisreportsonline.com/',
    rssUrl: 'https://www.gisreportsonline.com/rss',
    faviconUrl: 'https://www.gisreportsonline.com/favicon.ico',
    description:
      'Newsletter internationale offrant des analyses géopolitiques et des prévisions stratégiques pour les décideurs.',
    funding: {
      type: 'private',
      details: 'GIS Reports (abonnements payants)',
    },
    orientations: ['geopolitics', 'newsletter'],
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
    name: 'Chatham House',
    url: 'https://www.chathamhouse.org/',
    rssUrl: 'https://www.chathamhouse.org/rss',
    faviconUrl: 'https://www.chathamhouse.org/favicon.ico',
    description:
      'Think tank britannique de premier plan en géopolitique. Publications et analyses sur les relations internationales.',
    funding: {
      type: 'non-profit',
      details: 'Financement par dons et partenariats',
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
    name: 'Ifri (Institut français des relations internationales)',
    url: 'https://www.ifri.org/fr',
    rssUrl: 'https://www.ifri.org/fr/rss',
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
    name: 'United Nations News',
    url: 'https://news.un.org/fr/',
    rssUrl: 'https://news.un.org/fr/feed/rss',
    faviconUrl: 'https://news.un.org/favicon.ico',
    description:
      'Actualités officielles des Nations Unies sur les enjeux géopolitiques, conflits et diplomatie internationale.',
    funding: {
      type: 'government',
      details: 'Organisation des Nations Unies',
    },
    orientations: ['geopolitics', 'international-organization'],
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
