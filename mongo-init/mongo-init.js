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
    url: 'https://www.lemonde.fr/',
    rssUrl: 'https://www.lemonde.fr/rss/une.xml',
    faviconUrl: 'https://www.lemonde.fr/favicon.ico',
    description:
      "Quotidien national de référence, offrant une couverture approfondie de l'actualité française et internationale avec une ligne éditoriale centriste de gauche.",
    funding: {
      type: 'private',
      details: 'Groupe Le Monde (actionnaires: Xavier Niel, Matthieu Pigasse, Daniel Kretinsky)',
    },
    orientation: {
      political: 'center-left',
    },
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
    name: 'Le Figaro',
    url: 'https://www.lefigaro.fr/',
    rssUrl: 'https://www.lefigaro.fr/rss/figaro_actualites.xml',
    faviconUrl: 'https://www.lefigaro.fr/favicon.ico',
    description:
      'Journal quotidien de la droite républicaine, avec une ligne éditoriale conservatrice et libérale sur les questions économiques.',
    funding: {
      type: 'private',
      details: 'Groupe Dassault (actionnaire principal: Famille Dassault)',
    },
    orientation: {
      political: 'right',
    },
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
    name: 'Libération',
    url: 'https://www.liberation.fr/',
    rssUrl: 'https://www.liberation.fr/rss/',
    faviconUrl: 'https://www.liberation.fr/favicon.ico',
    description:
      'Quotidien marqué par ses origines progressistes et son engagement pour les causes sociales. Couverture approfondie des mouvements sociaux et des enjeux de société.',
    funding: {
      type: 'private',
      details: 'SFR Media (Groupe Altice, Patrick Drahi)',
    },
    orientation: {
      political: 'left',
    },
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
    name: 'Les Echos',
    url: 'https://www.lesechos.fr/',
    rssUrl: 'https://www.lesechos.fr/rss/une.xml',
    faviconUrl: 'https://www.lesechos.fr/favicon.ico',
    description:
      "Premier quotidien économique français, offrant une analyse approfondie de l'actualité économique, financière et des marchés avec une approche libérale.",
    funding: {
      type: 'private',
      details: 'Groupe LVMH (actionnaire principal: Bernard Arnault)',
    },
    orientation: {
      political: 'center-right',
    },
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
    name: 'La Croix',
    url: 'https://www.la-croix.com/',
    rssUrl: 'https://www.la-croix.com/RSS',
    faviconUrl: 'https://www.la-croix.com/favicon.ico',
    description:
      "Quotidien d'inspiration catholique, proposant une couverture de l'actualité nationale et internationale avec une attention particulière aux questions éthiques, sociales et religieuses.",
    funding: {
      type: 'private',
      details: 'Groupe Bayard Presse',
    },
    orientation: {
      political: 'center',
    },
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
    name: "L'Humanité",
    url: 'https://www.humanite.fr/',
    rssUrl: 'https://www.humanite.fr/rss',
    faviconUrl: 'https://www.humanite.fr/favicon.ico',
    description:
      "Quotidien historiquement lié au Parti communiste français, défendant une vision progressiste et sociale de l'actualité avec un focus sur les luttes sociales.",
    funding: {
      type: 'private',
      details: "Société des lecteurs de l'Humanité et autres actionnaires (ex-PCF)",
    },
    orientation: {
      political: 'extreme-left',
    },
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
    name: 'Le Parisien',
    url: 'https://www.leparisien.fr/',
    rssUrl: 'https://feeds.leparisien.fr/leparisien/rss',
    faviconUrl: 'https://www.leparisien.fr/favicon.ico',
    description:
      "Quotidien populaire couvrant l'actualité nationale et francilienne, avec une approche accessible et pragmatique de l'information quotidienne.",
    funding: {
      type: 'private',
      details: 'Groupe LVMH (actionnaire principal: Bernard Arnault)',
    },
    orientation: {
      political: 'center',
    },
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
    name: 'Mediapart',
    url: 'https://www.mediapart.fr/',
    rssUrl: 'https://www.mediapart.fr/articles/feed',
    faviconUrl: 'https://www.mediapart.fr/favicon.ico',
    description:
      "Média d'investigation en ligne indépendant, connu pour ses enquêtes approfondies et son journalisme engagé sur les scandales politiques et financiers.",
    funding: {
      type: 'private',
      details: 'Financé par ses abonnés (100% indépendant, sans publicité)',
    },
    orientation: {
      political: 'left',
    },
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
    name: 'Marianne',
    url: 'https://www.marianne.net/',
    rssUrl: 'https://www.marianne.net/rss.xml',
    faviconUrl: 'https://www.marianne.net/favicon.ico',
    description:
      'Hebdomadaire politique et culturel, défendant les valeurs républicaines avec une approche critique tant de la droite que de la gauche identitaire.',
    funding: {
      type: 'private',
      details: 'Czech Media Invest (actionnaire principal: Daniel Křetínský)',
    },
    orientation: {
      political: 'center-left',
    },
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
    name: 'Ouest-France',
    url: 'https://www.ouest-france.fr/',
    rssUrl: 'https://www.ouest-france.fr/rss/une',
    faviconUrl: 'https://www.ouest-france.fr/favicon.ico',
    description:
      "Premier quotidien régional français, couvrant l'actualité du Grand Ouest avec un réseau dense de correspondants locaux et une approche de proximité.",
    funding: {
      type: 'private',
      details: 'Association pour le Soutien des Principes de la Démocratie Humaniste (SIPA)',
    },
    orientation: {
      political: 'center',
    },
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
    name: 'Sud Ouest',
    url: 'https://www.sudouest.fr/',
    rssUrl: 'https://www.sudouest.fr/rss.xml',
    faviconUrl: 'https://www.sudouest.fr/favicon.ico',
    description:
      'Quotidien régional couvrant le Sud-Ouest de la France, avec une information de proximité et un fort ancrage territorial.',
    funding: {
      type: 'private',
      details: 'Groupe Sud Ouest (actionnaire principal: famille Lemoine)',
    },
    orientation: {
      political: 'center',
    },
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
    name: 'La Voix du Nord',
    url: 'https://www.lavoixdunord.fr/',
    rssUrl: 'https://www.lavoixdunord.fr/rss.xml',
    faviconUrl: 'https://www.lavoixdunord.fr/favicon.ico',
    description:
      "Quotidien régional des Hauts-de-France, offrant une couverture détaillée de l'actualité du Nord-Pas-de-Calais avec une forte implantation locale.",
    funding: {
      type: 'private',
      details: 'Groupe Rossel-La Voix',
    },
    orientation: {
      political: 'center',
    },
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
    name: 'Le Télégramme',
    url: 'https://www.letelegramme.fr/',
    rssUrl: 'https://www.letelegramme.fr/rss.xml',
    faviconUrl: 'https://www.letelegramme.fr/favicon.ico',
    description:
      "Quotidien régional breton, proposant une couverture approfondie de l'actualité locale et régionale de Bretagne.",
    funding: {
      type: 'private',
      details: 'Groupe Télégramme',
    },
    orientation: {
      political: 'center',
    },
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
    name: 'La Dépêche',
    url: 'https://www.ladepeche.fr/',
    rssUrl: 'https://www.ladepeche.fr/rss.xml',
    faviconUrl: 'https://www.ladepeche.fr/favicon.ico',
    description:
      "Quotidien régional du Sud-Ouest et de l'Occitanie, avec une forte présence locale et un traitement détaillé de l'actualité de proximité.",
    funding: {
      type: 'private',
      details: 'Groupe La Dépêche (famille Baylet)',
    },
    orientation: {
      political: 'center-left',
    },
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
    name: 'Nice-Matin',
    url: 'https://www.nicematin.com/',
    rssUrl: 'https://www.nicematin.com/rss',
    faviconUrl: 'https://www.nicematin.com/favicon.ico',
    description:
      'Quotidien régional couvrant les Alpes-Maritimes et le Var, avec une information locale détaillée et un fort ancrage territorial.',
    funding: {
      type: 'private',
      details: 'Groupe Groupe Nice-Matin (actionnaire principal: Xavier Niel)',
    },
    orientation: {
      political: 'center',
    },
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
    name: 'La Provence',
    url: 'https://www.laprovence.com/',
    rssUrl: 'https://www.laprovence.com/rss.xml',
    faviconUrl: 'https://www.laprovence.com/favicon.ico',
    description:
      "Quotidien régional couvrant les Bouches-du-Rhône et la région PACA, avec une forte implantation locale et une couverture détaillée de l'actualité marseillaise.",
    funding: {
      type: 'private',
      details: 'CMA CGM (actionnaire principal: Rodolphe Saadé)',
    },
    orientation: {
      political: 'center',
    },
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

  // Médias pure players
  {
    name: 'Slate',
    url: 'https://www.slate.fr/',
    rssUrl: 'http://www.slate.fr/rss.xml',
    faviconUrl: 'https://www.slate.fr/favicon.ico',
    description:
      "Magazine en ligne d'analyses et de débats, proposant un regard décalé sur l'actualité avec des formats longs et des points de vue originaux.",
    funding: {
      type: 'private',
      details: 'Actionnaires divers incluant Ariane et Benjamin de Rothschild',
    },
    orientation: {
      political: 'center-left',
    },
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
    name: 'Rue89',
    url: 'https://www.nouvelobs.com/rue89/',
    rssUrl: 'https://www.nouvelobs.com/rue89/rss.xml',
    faviconUrl: 'https://www.nouvelobs.com/favicon.ico',
    description:
      "Site d'information en ligne désormais intégré au Nouvel Obs, connu pour son journalisme participatif et son approche alternative de l'actualité.",
    funding: {
      type: 'private',
      details: 'Groupe Le Monde (intégré au Nouvel Obs)',
    },
    orientation: {
      political: 'left',
    },
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
    name: 'Huffington Post',
    url: 'https://www.huffingtonpost.fr/',
    rssUrl: 'https://www.huffingtonpost.fr/feeds/index.xml',
    faviconUrl: 'https://www.huffingtonpost.fr/favicon.ico',
    description:
      'Version française du site américain, mélangeant information, blogs et contributions externes avec une approche progressive sur les sujets sociétaux.',
    funding: {
      type: 'private',
      details: 'Groupe Le Monde et BuzzFeed',
    },
    orientation: {
      political: 'center-left',
    },
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
    name: 'Reporterre',
    url: 'https://reporterre.net/',
    rssUrl: 'https://reporterre.net/spip.php?page=backend',
    faviconUrl: 'https://reporterre.net/favicon.ico',
    description:
      "Journal en ligne spécialisé dans l'écologie et les questions environnementales, avec une approche militante et critique du modèle économique dominant.",
    funding: {
      type: 'private',
      details: 'Financé par les dons de ses lecteurs',
    },
    orientation: {
      political: 'ecologist',
    },
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
    name: 'StreetPress',
    url: 'https://www.streetpress.com/',
    rssUrl: 'https://www.streetpress.com/feed',
    faviconUrl: 'https://www.streetpress.com/favicon.ico',
    description:
      'Média en ligne indépendant spécialisé dans les enquêtes sociales et le journalisme de terrain, avec un focus sur les questions urbaines et les minorités.',
    funding: {
      type: 'private',
      details: 'Financé par ses lecteurs et par des partenariats médias',
    },
    orientation: {
      political: 'left',
    },
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
    name: 'Contexte',
    url: 'https://www.contexte.com/',
    rssUrl: 'https://www.contexte.com/feed/',
    faviconUrl: 'https://www.contexte.com/favicon.ico',
    description:
      "Média spécialisé dans l'information politique et réglementaire, avec un focus sur l'Europe et les coulisses du pouvoir à destination des professionnels.",
    funding: {
      type: 'private',
      details: 'Modèle par abonnement professionnel',
    },
    orientation: {
      political: 'center',
    },
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

  // Chaînes d'information en continu
  {
    name: 'France Info',
    url: 'https://www.francetvinfo.fr/',
    rssUrl: 'https://www.francetvinfo.fr/rss/flux-complet.xml',
    faviconUrl: 'https://www.francetvinfo.fr/favicon.ico',
    description:
      "Chaîne d'information publique en continu, proposant une couverture factuelle de l'actualité avec un réseau de correspondants sur tout le territoire.",
    funding: {
      type: 'public',
      details: 'Groupe France Télévisions (financement public)',
    },
    orientation: {
      political: 'center',
    },
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
    name: 'BFMTV',
    url: 'https://www.bfmtv.com/',
    rssUrl: 'https://www.bfmtv.com/rss/news-24-7/',
    faviconUrl: 'https://www.bfmtv.com/favicon.ico',
    description:
      "Première chaîne d'information privée en continu, proposant une couverture intense de l'actualité avec un accent sur la politique et les faits divers.",
    funding: {
      type: 'private',
      details: 'Groupe Altice (actionnaire principal: Patrick Drahi)',
    },
    orientation: {
      political: 'center-right',
    },
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
    name: 'Europe 1',
    url: 'https://www.europe1.fr/',
    rssUrl: 'https://www.europe1.fr/',
    faviconUrl: 'https://www.europe1.fr/favicon.ico',
    description:
      "Radio généraliste historique proposant information, débats et divertissement avec une couverture importante de l'actualité politique et sociale.",
    funding: {
      type: 'private',
      details: 'Groupe Lagardère (actionnaire principal: Vincent Bolloré via Vivendi)',
    },
    orientation: {
      political: 'right',
    },
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
    name: 'France 24',
    url: 'https://www.france24.com/fr/',
    rssUrl: 'https://www.france24.com/fr/rss',
    faviconUrl: 'https://www.france24.com/favicon.ico',
    description:
      "Chaîne d'information internationale française, proposant un regard français sur l'actualité mondiale avec une forte présence à l'international.",
    funding: {
      type: 'public',
      details: "France Médias Monde (financé par l'État français)",
    },
    orientation: {
      political: 'center',
    },
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
    name: 'RFI',
    url: 'https://www.rfi.fr/',
    rssUrl: 'https://www.rfi.fr/fr/rss',
    faviconUrl: 'https://www.rfi.fr/favicon.ico',
    description:
      "Radio internationale française, offrant une couverture mondiale de l'actualité avec un accent particulier sur l'Afrique et les relations internationales.",
    funding: {
      type: 'public',
      details: "France Médias Monde (financé par l'État français)",
    },
    orientation: {
      political: 'center',
    },
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
    name: 'France Culture',
    url: 'https://www.franceculture.fr/',
    rssUrl: 'https://www.franceculture.fr/rss',
    faviconUrl: 'https://www.franceculture.fr/favicon.ico',
    description:
      'Radio culturelle publique proposant des émissions de fond sur les idées, la culture et le savoir avec une approche intellectuelle et approfondie.',
    funding: {
      type: 'public',
      details: "Radio France (financé par l'État français)",
    },
    orientation: {
      political: 'center-left',
    },
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

  // Magazines d'opinion
  {
    name: 'Le Point',
    url: 'https://www.lepoint.fr/',
    rssUrl: 'https://www.lepoint.fr/rss.xml',
    faviconUrl: 'https://www.lepoint.fr/favicon.ico',
    description:
      "Hebdomadaire d'actualité et d'analyse, proposant une vision libérale et conservatrice avec un accent sur l'économie et la politique.",
    funding: {
      type: 'private',
      details: 'Groupe Artémis (actionnaire principal: François-Henri Pinault)',
    },
    orientation: {
      political: 'right',
    },
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
    name: "L'Obs",
    url: 'https://www.nouvelobs.com/',
    rssUrl: 'https://www.nouvelobs.com/rss',
    faviconUrl: 'https://www.nouvelobs.com/favicon.ico',
    description:
      'Hebdomadaire historique de la gauche intellectuelle française, proposant analyses politiques et culturelles avec une vision progressiste et sociale-démocrate.',
    funding: {
      type: 'private',
      details: 'Groupe Le Monde (actionnaires: Xavier Niel, Matthieu Pigasse, Daniel Kretinsky)',
    },
    orientation: {
      political: 'left',
    },
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
    name: 'Valeurs Actuelles',
    url: 'https://www.valeursactuelles.com/',
    rssUrl: 'https://www.valeursactuelles.com/feed',
    faviconUrl: 'https://www.valeursactuelles.com/favicon.ico',
    description:
      "Hebdomadaire conservateur, défendant une vision traditionnelle et nationaliste avec un positionnement assumé à droite sur les questions d'identité et de sécurité.",
    funding: {
      type: 'private',
      details: 'Groupe Valmonde (actionnaire principal: Iskandar Safa)',
    },
    orientation: {
      political: 'extreme-right',
    },
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
    name: 'Causeur',
    url: 'https://www.causeur.fr/',
    rssUrl: 'https://www.causeur.fr/feed',
    faviconUrl: 'https://www.causeur.fr/favicon.ico',
    description:
      "Magazine polémique d'opinion, proposant une critique des idées dominantes avec des positions conservatrices et une défense des valeurs traditionnelles.",
    funding: {
      type: 'private',
      details: 'Elisabeth Lévy et investisseurs privés',
    },
    orientation: {
      political: 'right',
    },
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
    name: 'Alternatives Économiques',
    url: 'https://www.alternatives-economiques.fr/',
    rssUrl: 'https://www.alternatives-economiques.fr/rss',
    faviconUrl: 'https://www.alternatives-economiques.fr/favicon.ico',
    description:
      "Magazine économique proposant une analyse critique du capitalisme et défendant une vision sociale et écologique de l'économie.",
    funding: {
      type: 'private',
      details: 'Coopérative (structure SCOP, sans actionnaire majoritaire)',
    },
    orientation: {
      political: 'left',
    },
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
    name: 'Politis',
    url: 'https://www.politis.fr/',
    rssUrl: 'https://www.politis.fr/feed/',
    faviconUrl: 'https://www.politis.fr/favicon.ico',
    description:
      "Hebdomadaire engagé à gauche, proposant une analyse critique de l'actualité politique et sociale avec une attention particulière aux mouvements sociaux.",
    funding: {
      type: 'private',
      details:
        'Coopérative (détenu par les lecteurs et salariés via la société des lecteurs de Politis)',
    },
    orientation: {
      political: 'extreme-left',
    },
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
    name: 'Le Canard Enchaîné',
    url: 'https://www.lecanardenchaine.fr/',
    rssUrl: 'https://www.lecanardenchaine.fr/rss/index.xml',
    faviconUrl: 'https://www.lecanardenchaine.fr/favicon.ico',
    description:
      "Hebdomadaire satirique et d'investigation, connu pour ses révélations politiques et ses enquêtes sur les scandales financiers, avec une indépendance éditoriale totale.",
    funding: {
      type: 'private',
      details: 'Autofinancé, sans publicité ni actionnaire externe (propriété des journalistes)',
    },
    orientation: {
      political: 'left',
    },
    defaultEnabled: true,
    isUserAdded: false,
    addedDate: new Date('2024-12-25'),
    fetchStatus: {
      success: false,
      message: 'Pas de flux RSS officiel',
      timestamp: new Date(),
    },
    lastFetched: new Date(),
    updatedAt: new Date(),
    status: 'inactive',
  },

  // Médias thématiques
  {
    name: 'La Tribune',
    url: 'https://www.latribune.fr/',
    rssUrl: 'https://www.latribune.fr/rss/actualites',
    faviconUrl: 'https://www.latribune.fr/favicon.ico',
    description:
      "Quotidien économique en ligne, proposant analyses et décryptages du monde des affaires et de la finance avec une approche libérale et ouverte sur l'innovation.",
    funding: {
      type: 'private',
      details: 'Groupe HFI (actionnaire principal: Jean-Christophe Tortora)',
    },
    orientation: {
      political: 'center-right',
    },
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
    name: 'Télérama',
    url: 'https://www.telerama.fr/',
    rssUrl: 'https://www.telerama.fr/rss/une.xml',
    faviconUrl: 'https://www.telerama.fr/favicon.ico',
    description:
      'Hebdomadaire culturel de référence, proposant critiques, analyses et sélections dans tous les domaines culturels avec une approche exigeante et progressiste.',
    funding: {
      type: 'private',
      details: 'Groupe Le Monde (actionnaires: Xavier Niel, Matthieu Pigasse, Daniel Kretinsky)',
    },
    orientation: {
      political: 'center-left',
    },
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
    name: '01net',
    url: 'https://www.01net.com/',
    rssUrl: 'https://www.01net.com/rss/',
    faviconUrl: 'https://www.01net.com/favicon.ico',
    description:
      'Magazine et site spécialisés dans la technologie et le numérique, proposant tests, actualités et conseils tech avec une approche grand public.',
    funding: {
      type: 'private',
      details: 'Groupe Altice (actionnaire principal: Patrick Drahi)',
    },
    orientation: {
      political: 'center',
    },
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
    name: 'Sciences et Avenir',
    url: 'https://www.sciencesetavenir.fr/',
    rssUrl: 'https://www.sciencesetavenir.fr/rss.xml',
    faviconUrl: 'https://www.sciencesetavenir.fr/favicon.ico',
    description:
      "Magazine de vulgarisation scientifique, couvrant l'ensemble des disciplines avec une approche pédagogique et accessible au grand public.",
    funding: {
      type: 'private',
      details: 'Groupe Perdriel (Challenges)',
    },
    orientation: {
      political: 'center',
    },
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
    name: "L'Usine Nouvelle",
    url: 'https://www.usinenouvelle.com/',
    rssUrl: 'https://www.usinenouvelle.com/rss/',
    faviconUrl: 'https://www.usinenouvelle.com/favicon.ico',
    description:
      "Magazine professionnel spécialisé dans l'industrie et les technologies, proposant analyses sectorielles et veille sur l'innovation industrielle.",
    funding: {
      type: 'private',
      details: 'Groupe Infopro Digital',
    },
    orientation: {
      political: 'center-right',
    },
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

  // Fact-checking et décryptage
  {
    name: 'Decodex (Le Monde)',
    url: 'https://www.lemonde.fr/verification/',
    rssUrl: 'https://www.lemonde.fr/les-decodeurs/rss_full.xml',
    faviconUrl: 'https://www.lemonde.fr/favicon.ico',
    description:
      'Section fact-checking du Monde, vérifiant informations et rumeurs circulant sur internet et les réseaux sociaux avec une méthodologie journalistique rigoureuse.',
    funding: {
      type: 'private',
      details: 'Groupe Le Monde (actionnaires: Xavier Niel, Matthieu Pigasse, Daniel Kretinsky)',
    },
    orientation: {
      political: 'center-left',
    },
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
    name: 'AFP Factuel',
    url: 'https://factuel.afp.com/',
    rssUrl: 'https://factuel.afp.com/rss.xml',
    faviconUrl: 'https://factuel.afp.com/favicon.ico',
    description:
      "Service de fact-checking de l'Agence France-Presse, vérifiant les informations virales et luttant contre la désinformation avec le réseau mondial de l'AFP.",
    funding: {
      type: 'semi-public',
      details:
        "Agence France-Presse (statut d'établissement public à caractère industriel et commercial)",
    },
    orientation: {
      political: 'center',
    },
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
    name: 'CheckNews (Libération)',
    url: 'https://www.liberation.fr/arc/outboundfeeds/rss-all/?outputType=xml',
    rssUrl:
      'https://www.liberation.fr/arc/outboundfeeds/rss-all/category/checknews/?outputType=xml',
    faviconUrl: 'https://www.liberation.fr/favicon.ico',
    description:
      'Service de vérification factuelle de Libération, répondant aux questions des lecteurs et démystifiant les fausses informations avec une approche pédagogique.',
    funding: {
      type: 'private',
      details: 'SFR Presse (actionnaire principal: Patrick Drahi)',
    },
    orientation: {
      political: 'left',
    },
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

  // Médias alternatifs
  {
    name: 'Le Media',
    url: 'https://www.lemediatv.fr/',
    rssUrl: 'https://api.lemediatv.fr/rss.xml',
    faviconUrl: 'https://www.lemediatv.fr/favicon.ico',
    description:
      'Média en ligne coopératif et indépendant, proposant reportages, débats et documentaires avec une ligne éditoriale engagée à gauche.',
    funding: {
      type: 'private',
      details: 'Financé par ses membres (structure coopérative)',
    },
    orientation: {
      political: 'extreme-left',
    },
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
    name: 'Bastamag',
    url: 'https://www.bastamag.net/',
    rssUrl: 'https://www.bastamag.net/spip.php?page=backend',
    faviconUrl: 'https://www.bastamag.net/favicon.ico',
    description:
      "Site d'information indépendant sur l'actualité sociale et environnementale, avec enquêtes et reportages critiques sur le capitalisme et les inégalités.",
    funding: {
      type: 'private',
      details: 'Association à but non lucratif, financée par les dons et abonnements',
    },
    orientation: {
      political: 'extreme-left',
    },
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
    name: 'Acrimed',
    url: 'https://www.acrimed.org/',
    rssUrl: 'https://www.acrimed.org/spip.php?page=backend',
    faviconUrl: 'https://www.acrimed.org/favicon.ico',
    description:
      "Observatoire critique des médias, proposant analyses et décryptages du traitement médiatique de l'actualité avec une approche militante de gauche et une critique du système médiatique dominant.",
    funding: {
      type: 'private',
      details: 'Association financée par les dons et cotisations des membres',
    },
    orientation: {
      political: 'extreme-left',
    },
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
    name: 'Frustration Magazine',
    url: 'https://frustrationmagazine.fr/',
    rssUrl: 'https://frustrationmagazine.fr/feed.xml',
    faviconUrl: 'https://frustrationmagazine.fr/favicon.ico',
    description:
      'Revue en ligne anticapitaliste, proposant analyses politiques et sociales avec une perspective radicale de gauche et un ton souvent satirique et critique du libéralisme.',
    funding: {
      type: 'private',
      details: 'Association indépendante, financée par les dons et abonnements',
    },
    orientation: {
      political: 'extreme-left',
    },
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
]);

// Création des index pour optimiser les requêtes
db.sources.createIndex({ name: 1 }, { unique: true });
db.articles.createIndex({ link: 1 }, { unique: true });
db.articles.createIndex({ publishedAt: -1 });
db.articles.createIndex({ sourceId: 1 });
db.users.createIndex({ email: 1 }, { unique: true });
