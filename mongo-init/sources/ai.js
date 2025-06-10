// Sources Intelligence Artificielle

// Création de la collection IA
const aiCollection = db.collections.insertOne({
  name: "Veille sur l'intelligence Artificielle",
  description:
    "Sources d'actualités sur l'intelligence artificielle, la recherche et les innovations en IA",
  userId: aiUser.insertedId,
  isPublic: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

print('Collection IA créée avec succès. ID: ' + aiCollection.insertedId);

// Mise à jour de l'avatar de l'utilisateur
db.users.updateOne(
  { _id: aiUser.insertedId },
  {
    $set: {
      avatar: 'https://avatar.iran.liara.run/public/girl?username=ai',
      avatarType: 'url',
      defaultCollection: aiCollection.insertedId,
    },
  }
);

// Insertion des sources
const sources = [
  {
    name: 'Usine Digitale - IA',
    url: 'https://www.usine-digitale.fr/intelligence-artificielle/',
    rssUrl: 'https://www.usine-digitale.fr/rss/intelligence-artificielle',
    faviconUrl: 'https://www.usine-digitale.fr/favicon.ico',
    description:
      "Section IA de l'Usine Digitale, média français dédié aux transformations numériques. Actualités sur les applications industrielles et innovations en IA.",
    funding: {
      type: 'private',
      details: 'Groupe Infopro Digital',
    },
    orientations: ['artificial-intelligence', 'industry'],
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    collectionId: aiCollection.insertedId,
    createdBy: aiUser.insertedId,
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
    name: 'ActuIA',
    url: 'https://www.actuia.com/',
    rssUrl: 'https://www.actuia.com/feed/',
    faviconUrl: 'https://www.actuia.com/favicon.ico',
    description:
      "Média français dédié à l'intelligence artificielle. Actualités, dossiers et interviews sur les avancées et enjeux de l'IA.",
    funding: {
      type: 'private',
      details: 'Média indépendant avec publicité',
    },
    orientations: ['artificial-intelligence', 'news'],
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
    name: 'Science4All (YouTube)',
    url: 'https://www.youtube.com/channel/UC0NCbj8CxzeCGIF6sODJ-7A',
    rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC0NCbj8CxzeCGIF6sODJ-7A',
    faviconUrl: 'https://www.youtube.com/favicon.ico',
    description:
      "Chaîne YouTube française de vulgarisation scientifique, avec un fort accent sur l'IA, les mathématiques et la science des données.",
    funding: {
      type: 'independent',
      details: 'YouTube, sponsors',
    },
    orientations: ['artificial-intelligence', 'tech-educational'],
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
    name: 'El Jj (YouTube)',
    url: 'https://www.youtube.com/channel/UCt9N_6z2I1XsOBs4vT7t1jQ',
    rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCt9N_6z2I1XsOBs4vT7t1jQ',
    faviconUrl: 'https://www.youtube.com/favicon.ico',
    description:
      "Chaîne YouTube française vulgarisant l'IA et ses implications sociétales, avec un ton accessible et engagé.",
    funding: {
      type: 'independent',
      details: 'YouTube, sponsors',
    },
    orientations: ['artificial-intelligence', 'awareness'],
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
    name: 'MIT Technology Review - AI',
    url: 'https://www.technologyreview.com/topic/artificial-intelligence/',
    rssUrl: 'https://www.technologyreview.com/feed/',
    faviconUrl: 'https://www.technologyreview.com/favicon.ico',
    description:
      "Section IA du MIT Technology Review. Analyses approfondies sur les innovations et impacts de l'intelligence artificielle.",
    funding: {
      type: 'private',
      details: 'MIT (média avec abonnements)',
    },
    orientations: ['artificial-intelligence', 'research'],
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
    name: 'Ars Technica - AI',
    url: 'https://arstechnica.com/artificial-intelligence/',
    rssUrl: 'https://arstechnica.com/feed/',
    faviconUrl: 'https://arstechnica.com/favicon.ico',
    description:
      "Section IA d'Ars Technica, média tech international. Couvre les actualités et tendances en IA avec un angle technique.",
    funding: {
      type: 'private',
      details: 'Condé Nast',
    },
    orientations: ['artificial-intelligence', 'tech-news'],
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
    name: 'AI Weekly',
    url: 'https://aiweekly.co/',
    rssUrl: 'https://aiweekly.co/feed.xml',
    faviconUrl: 'https://aiweekly.co/favicon.ico',
    description:
      'Newsletter internationale hebdomadaire résumant les actualités, recherches et outils en intelligence artificielle.',
    funding: {
      type: 'independent',
      details: 'Newsletter indépendante avec sponsors',
    },
    orientations: ['artificial-intelligence', 'newsletter'],
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
    name: 'Google AI Blog',
    url: 'https://blog.google/technology/ai/',
    rssUrl: 'https://blog.google/technology/ai/feed/',
    faviconUrl: 'https://blog.google/favicon.ico',
    description:
      "Blog officiel de Google sur l'IA. Annonces, recherches et applications pratiques des avancées en intelligence artificielle.",
    funding: {
      type: 'private',
      details: 'Google',
    },
    orientations: ['artificial-intelligence', 'research'],
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
    name: 'DeepMind Blog',
    url: 'https://www.deepmind.com/blog',
    rssUrl: 'https://www.deepmind.com/blog/rss.xml',
    faviconUrl: 'https://www.deepmind.com/favicon.ico',
    description:
      'Blog de DeepMind, leader en recherche IA. Articles sur les avancées en apprentissage profond et IA générale.',
    funding: {
      type: 'private',
      details: 'DeepMind (Alphabet)',
    },
    orientations: ['artificial-intelligence', 'research'],
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
    name: 'Distill',
    url: 'https://distill.pub/',
    rssUrl: 'https://distill.pub/rss.xml',
    faviconUrl: 'https://distill.pub/favicon.ico',
    description:
      'Journal en ligne axé sur la recherche en IA, avec des explications visuelles et interactives des concepts complexes.',
    funding: {
      type: 'independent',
      details: 'Projet collaboratif de chercheurs',
    },
    orientations: ['artificial-intelligence', 'research', 'tech-educational'],
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
    name: 'The AI Podcast (NVIDIA)',
    url: 'https://blogs.nvidia.com/ai-podcast/',
    rssUrl: 'https://feeds.feedburner.com/nvidiaaipodcast',
    faviconUrl: 'https://blogs.nvidia.com/favicon.ico',
    description:
      "Podcast de NVIDIA sur l'IA, avec des interviews d'experts et des discussions sur les applications pratiques.",
    funding: {
      type: 'private',
      details: 'NVIDIA',
    },
    orientations: ['artificial-intelligence', 'podcast'],
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
    name: 'DataFramed',
    url: 'https://www.dataframed.io/',
    rssUrl: 'https://www.dataframed.io/feed/podcast/',
    faviconUrl: 'https://www.dataframed.io/favicon.ico',
    description:
      "Podcast de DataCamp axé sur la science des données et l'IA. Interviews avec des experts et discussions sur les tendances.",
    funding: {
      type: 'private',
      details: 'DataCamp',
    },
    orientations: ['artificial-intelligence', 'data-science', 'podcast'],
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
    name: 'r/MachineLearning',
    url: 'https://www.reddit.com/r/MachineLearning/',
    rssUrl: 'https://www.reddit.com/r/MachineLearning/.rss',
    faviconUrl: 'https://www.reddit.com/favicon.ico',
    description:
      "Subreddit international dédié à l'apprentissage automatique et à l'IA. Discussions techniques et partage de recherches.",
    funding: {
      type: 'community',
      details: 'Reddit (communauté)',
    },
    orientations: ['artificial-intelligence', 'technical', 'community'],
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
    name: 'r/artificial',
    url: 'https://www.reddit.com/r/artificial/',
    rssUrl: 'https://www.reddit.com/r/artificial/.rss',
    faviconUrl: 'https://www.reddit.com/favicon.ico',
    description:
      "Subreddit axé sur l'intelligence artificielle, avec des discussions sur les actualités, éthique et applications.",
    funding: {
      type: 'community',
      details: 'Reddit (communauté)',
    },
    orientations: ['artificial-intelligence', 'community'],
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
    name: 'AI Now Institute',
    url: 'https://ainowinstitute.org/',
    rssUrl: 'https://ainowinstitute.org/feed',
    faviconUrl: 'https://ainowinstitute.org/favicon.ico',
    description:
      "Institut de recherche sur les implications sociales et éthiques de l'IA. Rapports et analyses approfondis.",
    funding: {
      type: 'non-profit',
      details: 'Financement par dons et subventions',
    },
    orientations: ['artificial-intelligence', 'ethics'],
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
  { _id: aiCollection.insertedId },
  {
    $set: {
      sources: Object.values(insertedSources.insertedIds),
      updatedAt: new Date(),
    },
  }
);

print('Sources IA ajoutées à la collection avec succès.');
