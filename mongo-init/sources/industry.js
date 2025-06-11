// Sources industrielles

// Création de la collection Industrie
const industryCollection = db.collections.insertOne({
  name: 'Industrie [Demo]',
  description:
    "Sources d'actualités sur l'industrie, l'innovation et les transformations technologiques",
  userId: industryUser.insertedId,
  isPublic: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

print('Collection Industrie créée avec succès. ID: ' + industryCollection.insertedId);

// Mise à jour de l'avatar de l'utilisateur
db.users.updateOne(
  { _id: industryUser.insertedId },
  {
    $set: {
      avatar: 'https://avatar.iran.liara.run/public/girl?username=industry',
      avatarType: 'url',
      defaultCollection: industryCollection.insertedId,
    },
  }
);

// Préparation des sources
const sources = [
  {
    name: "L'Usine Nouvelle",
    url: 'https://www.usinenouvelle.com/',
    rssUrl: 'https://www.usinenouvelle.com/rss/',
    faviconUrl: 'https://www.usinenouvelle.com/favicon.ico',
    description:
      "Média français de référence sur l'actualité industrielle. Couverture des secteurs, innovations technologiques et stratégies d'entreprises.",
    funding: {
      type: 'private',
      details: 'Groupe Infopro Digital',
    },
    orientations: ['industry', 'news'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    collectionId: industryCollection.insertedId,
    createdBy: systemUser._id,
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
    name: "Le Journal de l'Automobile",
    url: 'https://www.journalauto.com/',
    rssUrl: 'https://www.journalauto.com/feed/',
    faviconUrl: 'https://www.journalauto.com/favicon.ico',
    description:
      "Journal spécialisé dans l'industrie automobile. Actualités et analyses du secteur automobile français et international.",
    funding: {
      type: 'private',
      details: 'Groupe de presse spécialisée',
    },
    orientations: ['industry', 'automotive'],
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
    name: 'AéroBuzz',
    url: 'https://www.aerobuzz.fr/',
    rssUrl: 'https://www.aerobuzz.fr/feed/',
    faviconUrl: 'https://www.aerobuzz.fr/favicon.ico',
    description:
      "Actualité aéronautique française. Couverture de l'industrie aéronautique, des compagnies aériennes et de l'aviation générale.",
    funding: {
      type: 'private',
      details: 'Média indépendant spécialisé',
    },
    orientations: ['industry', 'aerospace'],
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
    name: 'Le Moniteur',
    url: 'https://www.lemoniteur.fr/',
    rssUrl: 'https://www.lemoniteur.fr/rss',
    faviconUrl: 'https://www.lemoniteur.fr/favicon.ico',
    description:
      'Journal de référence du BTP. Actualités et analyses du secteur de la construction et des travaux publics.',
    funding: {
      type: 'private',
      details: 'Groupe Infopro Digital',
    },
    orientations: ['industry', 'construction'],
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
    name: "La Tribune de l'Industrie",
    url: 'https://www.latribune.fr/Entreprises-secteurs.html',
    rssUrl: 'https://www.latribune.fr/rss/rubriques/entreprises.html',
    faviconUrl: 'https://www.latribune.fr/favicon.ico',
    description:
      'Section industrie de La Tribune. Analyses économiques et stratégiques des secteurs industriels.',
    funding: {
      type: 'private',
      details: 'Journal économique indépendant',
    },
    orientations: ['industry', 'economics'],
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
    name: "Techniques de l'Ingénieur",
    url: 'https://www.techniques-ingenieur.fr/',
    rssUrl: 'https://www.techniques-ingenieur.fr/actualite/rss',
    faviconUrl: 'https://www.techniques-ingenieur.fr/favicon.ico',
    description:
      'Ressource technique de référence pour les ingénieurs. Articles approfondis sur les technologies industrielles.',
    funding: {
      type: 'private',
      details: 'Édition technique professionnelle',
    },
    orientations: ['industry', 'technical'],
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
    name: 'Industrie du Futur',
    url: 'http://www.industrie-dufutur.org/',
    rssUrl: 'http://www.industrie-dufutur.org/feed',
    faviconUrl: 'https://www.industrie-dufutur.org/favicon.ico',
    description:
      "Alliance pour l'Industrie du Futur. Actualités et ressources sur la transformation numérique de l'industrie.",
    funding: {
      type: 'non-profit',
      details: "Alliance d'acteurs industriels",
    },
    orientations: ['industry', 'innovation'],
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
    name: 'CETIM',
    url: 'https://www.cetim.fr/',
    rssUrl: 'https://www.cetim.fr/fr/rss',
    faviconUrl: 'https://www.cetim.fr/favicon.ico',
    description:
      'Centre technique des industries mécaniques. Veille technologique et innovations en mécanique industrielle.',
    funding: {
      type: 'semi-public',
      details: 'Centre technique industriel',
    },
    orientations: ['industry', 'mechanical'],
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
    name: 'Plastiques & Caoutchoucs Magazine',
    url: 'https://www.usinenouvelle.com/plasturgie/',
    rssUrl: 'https://www.usinenouvelle.com/rss/plasturgie/',
    faviconUrl: 'https://www.plastiques-caoutchoucs.com/favicon.ico',
    description:
      "Magazine spécialisé dans l'industrie des plastiques et caoutchoucs. Actualités techniques et économiques du secteur.",
    funding: {
      type: 'private',
      details: 'Presse professionnelle spécialisée',
    },
    orientations: ['industry', 'materials'],
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
    name: 'Contrôles Essais Mesures',
    url: 'https://www.controles-essais-mesures.fr/',
    rssUrl: 'https://www.controles-essais-mesures.fr/rss',
    faviconUrl: 'https://www.controles-essais-mesures.fr/favicon.ico',
    description:
      'Magazine sur les technologies de mesure et contrôle industriel. Actualités techniques et nouveaux équipements.',
    funding: {
      type: 'private',
      details: 'Presse technique spécialisée',
    },
    orientations: ['industry', 'metrology'],
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
    name: 'Jautomatise',
    url: 'https://www.jautomatise.com/',
    rssUrl: 'https://www.jautomatise.com/feed/',
    faviconUrl: 'https://www.jautomatise.com/favicon.ico',
    description:
      "Magazine sur l'automatisation industrielle. Actualités et dossiers techniques sur les automatismes et la robotique.",
    funding: {
      type: 'private',
      details: 'Presse technique indépendante',
    },
    orientations: ['industry', 'automation'],
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
    name: 'Mesures',
    url: 'https://www.mesures.com/',
    rssUrl: 'https://www.mesures.com/rss',
    faviconUrl: 'https://www.mesures.com/favicon.ico',
    description:
      "Magazine sur l'instrumentation et les systèmes de mesure. Actualités techniques et innovations en métrologie industrielle.",
    funding: {
      type: 'private',
      details: 'Groupe de presse technique',
    },
    orientations: ['industry', 'instrumentation'],
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
  { _id: industryCollection.insertedId },
  {
    $set: {
      sources: Object.values(insertedSources.insertedIds),
      updatedAt: new Date(),
    },
  }
);

print('Sources Industrie ajoutées à la collection avec succès.');
