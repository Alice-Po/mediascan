// Sources écologie et développement durable

// Création de la collection Écologie
const ecoCollection = db.collections.insertOne({
  name: 'Écologie [Demo]',
  description: "Sources d'actualités sur l'écologie, l'environnement et le développement durable",
  userId: ecoUser.insertedId,
  isPublic: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

print('Collection Écologie créée avec succès. ID: ' + ecoCollection.insertedId);

// Mise à jour de l'avatar de l'utilisateur
db.users.updateOne(
  { _id: ecoUser.insertedId },
  {
    $set: {
      avatar: 'https://avatar.iran.liara.run/public/boy?username=ecology',
      avatarType: 'url',
      defaultCollection: ecoCollection.insertedId,
    },
  }
);

// Insertion des sources
const sources = [
  {
    name: 'Reporterre',
    url: 'https://reporterre.net/',
    rssUrl: 'https://reporterre.net/spip.php?page=backend',
    faviconUrl: 'https://reporterre.net/favicon.ico',
    description:
      "Média indépendant français spécialisé dans l'écologie. Enquêtes et reportages sur les enjeux environnementaux.",
    funding: {
      type: 'independent',
      details: 'Financement participatif et dons',
    },
    orientations: ['ecology', 'investigation'],
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
    name: 'Vert.eco',
    url: 'https://vert.eco/',
    rssUrl: 'https://vert.eco/feed',
    faviconUrl: 'https://vert.eco/wp-content/themes/verteco/favicon.ico',
    description:
      "Média indépendant sur l'écologie avec des enquêtes approfondies et des solutions concrètes.",
    funding: {
      type: 'independent',
      details: 'Financement participatif',
    },
    orientations: ['ecology', 'solutions'],
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
    name: 'ADEME Presse',
    url: 'https://presse.ademe.fr/',
    rssUrl: 'https://www.ademe.fr/feed',
    faviconUrl: 'https://presse.ademe.fr/favicon.ico',
    description:
      "Actualités de l'Agence de la Transition Écologique (ADEME), source officielle française.",
    funding: {
      type: 'government',
      details: 'Agence gouvernementale',
    },
    orientations: ['ecology', 'policy'],
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
    name: 'Our World in Data - Environment',
    url: 'https://ourworldindata.org/environmental-impacts-of-food',
    rssUrl: 'https://ourworldindata.org/atom.xml',
    faviconUrl: 'https://ourworldindata.org/favicon.ico',
    description:
      'Données et analyses factuelles sur les impacts environnementaux globaux (en anglais).',
    funding: {
      type: 'non-profit',
      details: "Université d'Oxford",
    },
    orientations: ['ecology', 'data'],
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
    name: 'Novethic',
    url: 'https://www.novethic.fr/',
    rssUrl: 'https://www.novethic.fr/feed',
    faviconUrl: 'https://www.novethic.fr/favicon.ico',
    description:
      'Média expert du développement durable. Actualités et analyses sur la transition écologique et la RSE.',
    funding: {
      type: 'private',
      details: 'Caisse des Dépôts',
    },
    orientations: ['ecology', 'sustainable-development'],
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
    name: 'Le Réveilleur (YouTube)',
    url: 'https://www.youtube.com/channel/UC1EacOJoqsKaYxaDomTCTEQ',
    rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC1EacOJoqsKaYxaDomTCTEQ',
    faviconUrl: 'https://www.youtube.com/favicon.ico',
    description:
      'Chaîne YouTube française de vulgarisation scientifique sur les enjeux environnementaux et énergétiques.',
    funding: {
      type: 'independent',
      details: 'YouTube, sponsors',
    },
    orientations: ['ecology', 'tech-educational'],
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
    name: 'Bon Pote',
    url: 'https://bonpote.com/',
    rssUrl: 'https://bonpote.com/feed/',
    faviconUrl: 'https://bonpote.com/favicon.ico',
    description:
      'Média indépendant dédié à la vulgarisation scientifique sur les enjeux climatiques et environnementaux',
    funding: {
      type: 'independent',
      details: 'Financement participatif, dons et adhésions',
    },
    orientations: ['ecology', 'climate'],
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
    name: 'Réseau Action Climat',
    url: 'https://reseauactionclimat.org/',
    rssUrl: 'https://reseauactionclimat.org/feed/',
    faviconUrl: 'https://reseauactionclimat.org/favicon.ico',
    description:
      "Fédération d'associations environnementales. Actualités et analyses sur les politiques climatiques.",
    funding: {
      type: 'non-profit',
      details: 'Fédération associative',
    },
    orientations: ['ecology', 'policy'],
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
    name: 'Heu?reka (YouTube)',
    url: 'https://www.youtube.com/channel/UC7sXGI8p8PvKosLWagkK9wQ',
    rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC7sXGI8p8PvKosLWagkK9wQ',
    faviconUrl: 'https://www.youtube.com/favicon.ico',
    description:
      "Chaîne YouTube française sur l'économie avec un focus régulier sur les enjeux écologiques et la transition.",
    funding: {
      type: 'independent',
      details: 'YouTube, sponsors',
    },
    orientations: ['ecology', 'economics'],
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
    name: 'Natura Sciences',
    url: 'https://www.natura-sciences.com/',
    rssUrl: 'https://www.natura-sciences.com/feed/',
    faviconUrl: 'https://www.natura-sciences.com/favicon.ico',
    description:
      "Magazine en ligne sur l'environnement et les sciences. Articles de vulgarisation sur l'écologie et la biodiversité.",
    funding: {
      type: 'private',
      details: 'Média indépendant avec publicité',
    },
    orientations: ['ecology', 'science'],
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
    name: 'Actu-Environnement',
    url: 'https://www.actu-environnement.com/',
    rssUrl: 'https://www.actu-environnement.com/ae/news/archives/rss.php4',
    faviconUrl: 'https://www.actu-environnement.com/favicon.ico',
    description:
      "Journal professionnel sur l'environnement. Actualités réglementaires et techniques sur l'écologie.",
    funding: {
      type: 'private',
      details: 'Média professionnel avec abonnements',
    },
    orientations: ['ecology', 'professional'],
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
    name: 'GreenIT.fr',
    url: 'https://www.greenit.fr/',
    rssUrl: 'https://www.greenit.fr/feed/',
    faviconUrl: 'https://www.greenit.fr/favicon.ico',
    description:
      "Site de référence sur l'impact environnemental du numérique. Articles et guides sur le numérique responsable.",
    funding: {
      type: 'private',
      details: 'Cabinet de conseil avec publicité',
    },
    orientations: ['ecology', 'digital'],
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
    name: 'EcoInfo CNRS',
    url: 'https://ecoinfo.cnrs.fr/',
    rssUrl: 'https://ecoinfo.cnrs.fr/feed/',
    faviconUrl: 'https://ecoinfo.cnrs.fr/favicon.ico',
    description:
      "Groupe de recherche du CNRS sur l'impact environnemental du numérique. Publications scientifiques et recommandations.",
    funding: {
      type: 'government',
      details: 'CNRS (recherche publique)',
    },
    orientations: ['ecology', 'research'],
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
    name: 'r/ClimateActionPlan',
    url: 'https://www.reddit.com/r/ClimateActionPlan/',
    rssUrl: 'https://www.reddit.com/r/ClimateActionPlan/.rss',
    faviconUrl: 'https://www.reddit.com/favicon.ico',
    description:
      'Subreddit focalisé sur les solutions concrètes et les avancées positives dans la lutte contre le changement climatique.',
    funding: {
      type: 'community',
      details: 'Reddit (communauté)',
    },
    orientations: ['ecology', 'solutions'],
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
    name: 'r/environment',
    url: 'https://www.reddit.com/r/environment/',
    rssUrl: 'https://www.reddit.com/r/environment/.rss',
    faviconUrl: 'https://www.reddit.com/favicon.ico',
    description:
      "Subreddit principal sur l'environnement. Actualités et discussions sur les enjeux écologiques mondiaux.",
    funding: {
      type: 'community',
      details: 'Reddit (communauté)',
    },
    orientations: ['ecology', 'news'],
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
    name: 'The Shift Project',
    url: 'https://theshiftproject.org/',
    rssUrl: 'https://theshiftproject.org/feed/',
    faviconUrl: 'https://theshiftproject.org/favicon.ico',
    description:
      "Think tank français sur la transition carbone. Publications et rapports sur la décarbonation de l'économie.",
    funding: {
      type: 'non-profit',
      details: 'Association avec mécénat',
    },
    orientations: ['ecology', 'research'],
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
    name: 'Splann !',
    url: 'https://splann.org',
    rssUrl: 'https://splann.org/feed',
    faviconUrl: 'https://splann.org/wp-content/uploads/2022/12/cropped-FAVICON-SPLANN--32x32.jpg',
    description:
      "ONG d'enquêtes journalistiques en Bretagne, spécialisée dans les investigations sur l'environnement et l'agro-industrie.",
    funding: {
      type: 'non-profit',
      details: 'ONG indépendante',
    },
    orientations: ['ecology', 'investigation', 'local'],
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
    name: 'Topophile',
    url: 'https://topophile.net',
    rssUrl: 'https://topophile.net/feed',
    faviconUrl: 'https://topophile.net/favicon.ico',
    description:
      "Média indépendant qui explore les liens entre l'écologie, les territoires et les modes de vie.",
    funding: {
      type: 'independent',
      details: 'Média indépendant',
    },
    orientations: ['ecology', 'territory', 'lifestyle'],
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
    name: 'Terrestres',
    url: 'https://www.terrestres.org',
    rssUrl: 'https://www.terrestres.org/feed',
    faviconUrl: 'https://www.terrestres.org/favicon.ico',
    description:
      'Revue des idées écologiques qui propose des réflexions approfondies sur les enjeux environnementaux et sociétaux.',
    funding: {
      type: 'independent',
      details: 'Revue indépendante',
    },
    orientations: ['ecology', 'philosophy', 'society'],
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
  { _id: ecoCollection.insertedId },
  {
    $set: {
      sources: Object.values(insertedSources.insertedIds),
      updatedAt: new Date(),
    },
  }
);

print('Sources Écologie ajoutées à la collection avec succès.');
