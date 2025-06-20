// Sources Cybersécurité

// Création de la collection Cybersécurité
const cyberCollection = db.collections.insertOne({
  name: 'Cybersécurité [Demo]',
  description:
    "Sources d'actualités sur la cybersécurité, la sécurité informatique et la protection des données",
  userId: cyberUser.insertedId,
  isPublic: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

print('Collection Cybersécurité créée avec succès. ID: ' + cyberCollection.insertedId);

// Mise à jour de l'avatar de l'utilisateur
db.users.updateOne(
  { _id: cyberUser.insertedId },
  {
    $set: {
      avatar: 'https://avatar.iran.liara.run/public/girl?username=cybersecurity',
      avatarType: 'url',
      defaultCollection: cyberCollection.insertedId,
    },
  }
);

// Insertion des sources
const sources = [
  {
    name: 'Le Blog de Zythom',
    url: 'https://zythom.fr/',
    rssUrl: 'https://zythom.fr/feed/',
    faviconUrl: 'https://www.zythom.com/favicon.ico',
    description: "Blog d'un expert français en investigation numérique et cybersécurité.",
    funding: {
      type: 'independent',
      details: 'Expert indépendant',
    },
    orientations: ['cybersecurity', 'forensic'],
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
    name: 'UnderNews',
    url: 'https://www.undernews.fr/',
    rssUrl: 'https://www.undernews.fr/feed/',
    faviconUrl: 'https://www.undernews.fr/favicon.ico',
    description: 'Média francophone spécialisé en sécurité informatique et vie privée.',
    funding: {
      type: 'private',
      details: 'Média indépendant',
    },
    orientations: ['cybersecurity', 'privacy'],
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
    name: 'CERT-FR',
    url: 'https://www.cert.ssi.gouv.fr/',
    rssUrl: 'https://www.cert.ssi.gouv.fr/feed/',
    faviconUrl: 'https://www.cert.ssi.gouv.fr/favicon.ico',
    description:
      "Centre gouvernemental de veille, d'alerte et de réponse aux attaques informatiques. Bulletins de sécurité et alertes officielles.",
    funding: {
      type: 'government',
      details: 'ANSSI - Service gouvernemental',
    },
    orientations: ['cybersecurity', 'government'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    collectionId: cyberCollection.insertedId,
    createdBy: cyberUser.insertedId,
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
    name: 'BleepingComputer',
    url: 'https://www.bleepingcomputer.com/',
    rssUrl: 'https://www.bleepingcomputer.com/feed/',
    faviconUrl: 'https://www.bleepingcomputer.com/favicon.ico',
    description: 'Actualités internationales sur les cybermenaces et la sécurité informatique.',
    funding: {
      type: 'private',
      details: 'Publicité et donations',
    },
    orientations: ['cybersecurity', 'news'],
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
    name: 'Krebs on Security',
    url: 'https://krebsonsecurity.com/',
    rssUrl: 'https://krebsonsecurity.com/feed/',
    faviconUrl: 'https://krebsonsecurity.com/favicon.ico',
    description:
      'Blog de Brian Krebs, journaliste spécialisé en investigations sur la cybersécurité.',
    funding: {
      type: 'independent',
      details: 'Donations',
    },
    orientations: ['cybersecurity', 'investigation'],
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
    name: 'Cyberguerre',
    url: 'https://cyberguerre.numerama.com/',
    rssUrl: 'https://cyberguerre.numerama.com/feed/',
    faviconUrl: 'https://cyberguerre.numerama.com/favicon.ico',
    description:
      'Newsletter et site spécialisé de Numerama sur la cybersécurité, les cyberattaques et la géopolitique numérique.',
    funding: {
      type: 'private',
      details: 'Numerama (groupe Humanoid)',
    },
    orientations: ['cybersecurity', 'geopolitics'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    collectionId: cyberCollection.insertedId,
    createdBy: cyberUser.insertedId,
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
    name: 'Zataz',
    url: 'https://www.zataz.com/',
    rssUrl: 'https://www.zataz.com/feed/',
    faviconUrl: 'https://www.zataz.com/favicon.ico',
    description:
      'Média français indépendant spécialisé en cybersécurité depuis 1998. Actualités, analyses et investigations sur les cybermenaces.',
    funding: {
      type: 'independent',
      details: 'Média indépendant',
    },
    orientations: ['cybersecurity', 'investigation'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    collectionId: cyberCollection.insertedId,
    createdBy: cyberUser.insertedId,
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
    name: 'Cookie connecté (YouTube)',
    url: 'https://www.youtube.com/channel/UC6-DD1wLBrWf2VFOJ8fUqhQ',
    rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC5cs06DgLFeyLIF_II7lWCQ',
    faviconUrl: 'https://www.youtube.com/favicon.ico',
    description:
      'Chaîne YouTube française de vulgarisation en cybersécurité. Explications accessibles des concepts et actualités cyber.',
    funding: {
      type: 'independent',
      details: 'YouTube, sponsors',
    },
    orientations: ['cybersecurity', 'tech-educational'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    collectionId: cyberCollection.insertedId,
    createdBy: cyberUser.insertedId,
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
    name: 'Schneier on Security',
    url: 'https://www.schneier.com/',
    rssUrl: 'https://www.schneier.com/feed/',
    faviconUrl: 'https://www.schneier.com/favicon.ico',
    description:
      'Blog de Bruce Schneier, expert en sécurité informatique et cryptographie. Analyses approfondies et réflexions sur la sécurité.',
    funding: {
      type: 'independent',
      details: 'Blog personnel',
    },
    orientations: ['cybersecurity', 'cryptography'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    collectionId: cyberCollection.insertedId,
    createdBy: cyberUser.insertedId,
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
    name: 'The Hacker News',
    url: 'https://thehackernews.com/',
    rssUrl: 'https://feeds.feedburner.com/TheHackersNews',
    faviconUrl: 'https://thehackernews.com/favicon.ico',
    description:
      'Publication internationale de référence en cybersécurité. Actualités, analyses et alertes sur les menaces informatiques.',
    funding: {
      type: 'private',
      details: 'Média commercial avec publicité',
    },
    orientations: ['cybersecurity', 'news'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    collectionId: cyberCollection.insertedId,
    createdBy: cyberUser.insertedId,
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
    name: 'SANS Internet Storm Center',
    url: 'https://isc.sans.edu/',
    rssUrl: 'https://isc.sans.edu/rssfeed.xml',
    faviconUrl: 'https://isc.sans.edu/favicon.ico',
    description:
      'Centre de veille mondiale du SANS Institute. Analyses techniques des menaces et incidents de sécurité en temps réel.',
    funding: {
      type: 'private',
      details: 'SANS Institute (formation cybersécurité)',
    },
    orientations: ['cybersecurity', 'threat-intelligence'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    collectionId: cyberCollection.insertedId,
    createdBy: cyberUser.insertedId,
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
    name: 'NoLimitSecu',
    url: 'https://www.nolimitsecu.fr/',
    rssUrl: 'https://feeds.feedburner.com/nolimitsecu',
    faviconUrl: 'https://www.nolimitsecu.fr/favicon.ico',
    description:
      "Podcast français de référence en cybersécurité. Interviews d'experts et analyses des actualités cyber.",
    funding: {
      type: 'independent',
      details: 'Podcast indépendant avec sponsors',
    },
    orientations: ['cybersecurity', 'podcast'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    collectionId: cyberCollection.insertedId,
    createdBy: cyberUser.insertedId,
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
    name: 'r/cybersecurity',
    url: 'https://www.reddit.com/r/cybersecurity/',
    rssUrl: 'https://www.reddit.com/r/cybersecurity/.rss',
    faviconUrl: 'https://www.reddit.com/favicon.ico',
    description:
      "Subreddit international de discussion sur la cybersécurité. Actualités, conseils et partage d'expériences.",
    funding: {
      type: 'community',
      details: 'Reddit (communauté)',
    },
    orientations: ['cybersecurity', 'community'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    collectionId: cyberCollection.insertedId,
    createdBy: cyberUser.insertedId,
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
    name: 'r/netsec',
    url: 'https://www.reddit.com/r/netsec/',
    rssUrl: 'https://www.reddit.com/r/netsec/.rss',
    faviconUrl: 'https://www.reddit.com/favicon.ico',
    description:
      'Subreddit technique axé sur la sécurité réseau et les recherches en cybersécurité. Contenu plus avancé.',
    funding: {
      type: 'community',
      details: 'Reddit (communauté)',
    },
    orientations: ['cybersecurity', 'technical'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    collectionId: cyberCollection.insertedId,
    createdBy: cyberUser.insertedId,
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
    name: 'ENISA',
    url: 'https://www.enisa.europa.eu/',
    rssUrl: 'https://www.enisa.europa.eu/rss.xml',
    faviconUrl: 'https://www.enisa.europa.eu/favicon.ico',
    description:
      "Agence européenne chargée de la sécurité des réseaux et de l'information. Rapports et recommandations officielles.",
    funding: {
      type: 'government',
      details: "Agence de l'Union européenne",
    },
    orientations: ['cybersecurity', 'regulation'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    collectionId: cyberCollection.insertedId,
    createdBy: cyberUser.insertedId,
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
    name: 'CISA Alerts',
    url: 'https://www.cisa.gov/',
    rssUrl: 'https://www.cisa.gov/rss.xml',
    faviconUrl: 'https://www.cisa.gov/favicon.ico',
    description:
      'Agence américaine de cybersécurité. Alertes officielles et recommandations de sécurité pour les infrastructures critiques.',
    funding: {
      type: 'government',
      details: 'Agence gouvernementale américaine',
    },
    orientations: ['cybersecurity', 'government'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    collectionId: cyberCollection.insertedId,
    createdBy: cyberUser.insertedId,
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
    name: 'Journal du Net - Sécurité',
    url: 'https://www.journaldunet.com/securite/',
    rssUrl: 'https://www.journaldunet.com/rss.xml',
    faviconUrl: 'https://www.journaldunet.com/favicon.ico',
    description:
      'Section sécurité du Journal du Net, média français orienté business et technologies.',
    funding: {
      type: 'private',
      details: 'Groupe Webedia',
    },
    orientations: ['cybersecurity', 'business'],
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
  { _id: cyberCollection.insertedId },
  {
    $set: {
      sources: Object.values(insertedSources.insertedIds),
      updatedAt: new Date(),
    },
  }
);

print('Sources Cybersécurité ajoutées à la collection avec succès.');
