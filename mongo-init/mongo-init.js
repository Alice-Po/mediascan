// Script d'initialisation de la base de données MongoDB
// À placer dans un dossier 'mongo-init' à la racine du projet
db = db.getSiblingDB('news_aggregator');

// Création des collections
db.createCollection('sources');
db.createCollection('articles');
db.createCollection('users');
db.createCollection('analytics');
db.createCollection('collections');

// 1. Vérifier si l'utilisateur existe déjà
let systemUser = db.users.findOne({ email: 'system@news-aggregator.app' });

// 2. Si l'utilisateur n'existe pas, le créer
if (!systemUser) {
  try {
    db.users.insertOne({
      email: 'system@news-aggregator.app',
      username: 'Alice',
      password: '$2a$10$qnIjKn5XIQh42wN8IhNBxeT.NG2xgDlHJpLKxn8heFNpJ7W7P8Sw.', // Hash pour "123456"
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    print('Utilisateur système créé avec succès.');
  } catch (e) {
    print("Erreur lors de la création de l'utilisateur système: " + e.message);
  }

  // 3. Récupérer l'utilisateur après création
  systemUser = db.users.findOne({ email: 'system@news-aggregator.app' });
}

// 4. Vérifier que l'utilisateur a été trouvé
if (!systemUser) {
  print("ERREUR CRITIQUE: Impossible de trouver ou créer l'utilisateur système.");
  // Arrêter le script ici pour éviter l'erreur
  throw new Error('Utilisateur système non disponible');
}

print("ID de l'utilisateur système: " + systemUser._id);

// const SYSTEM_PASSWORD_HASH = process.env.SYSTEM_PASSWORD_HASH;

// // Création d'un utilisateur système pour les collections publiques
// db.users.insertOne({
//   email: 'a@ik.me',
//   username: 'System',
//   password: '$2a$10$randomHashForSystemUser', // Ceci devrait être un vrai hash en production
//   role: 'admin',
//   isActive: true,
//   createdAt: new Date(),
//   updatedAt: new Date(),
// });

// // Récupération de l'ID de l'utilisateur système
// const systemUser = db.users.findOne({ email: 'system@news-aggregator.app' });

// Ajout des sources préconfigurées
db.sources.insertMany([
  {
    name: 'CNews',
    url: 'https://www.cnews.fr/',
    rssUrl: 'https://www.cnews.fr/rss.xml',
    faviconUrl: 'https://www.cnews.fr/favicon.ico',
    description:
      "Chaîne d'information en continu française, anciennement connue sous le nom d'iTélé, proposant des journaux télévisés, débats et reportages sur l'actualité nationale et internationale.",
    funding: {
      type: 'private',
      details: 'Groupe Canal+ (actionnaire principal: Vivendi, contrôlé par Vincent Bolloré)',
    },
    orientations: ['right'],
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
    name: 'France Télévisions',
    url: 'https://www.france.tv/',
    rssUrl: 'https://www.francetvinfo.fr/rss/uni/actu.xml',
    faviconUrl: 'https://www.france.tv/favicon.ico',
    description:
      'Groupe audiovisuel public comprenant France 2, France 3, France 5 et franceinfo, offrant information, divertissement et programmes culturels.',
    funding: {
      type: 'public',
      details:
        "Financé par l'État français et la redevance audiovisuelle jusqu'en 2022, désormais par une part de TVA",
    },
    orientations: ['center-left'],
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
    name: 'Le Monde',
    url: 'https://www.lemonde.fr/',
    rssUrl: 'https://www.lemonde.fr/rss/une.xml',
    faviconUrl: 'https://www.lemonde.fr/favicon.ico',
    description:
      "Quotidien de référence fondé en 1944, reconnu pour son analyse approfondie de l'actualité nationale et internationale.",
    funding: {
      type: 'private',
      details:
        'Groupe Le Monde (actionnaires principaux: Xavier Niel, Matthieu Pigasse, Daniel Kretinsky)',
    },
    orientations: ['center-left'],
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
      "Chaîne d'information en continu leader en France, diffusant 24h/24 des actualités, reportages et débats.",
    funding: {
      type: 'private',
      details: 'Groupe Altice Media (actionnaire principal: Patrick Drahi)',
    },
    orientations: ['center-right'],
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
      'Quotidien national fondé en 1826, orienté vers une ligne éditoriale conservatrice et libérale sur le plan économique.',
    funding: {
      type: 'private',
      details: 'Groupe Dassault (actionnaire principal: famille Dassault)',
    },
    orientations: ['right'],
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
    name: 'France Inter',
    url: 'https://www.franceinter.fr/',
    rssUrl: 'https://www.franceinter.fr/rss',
    faviconUrl: 'https://www.franceinter.fr/favicon.ico',
    description:
      'Radio publique généraliste très écoutée, proposant information, débats, culture et divertissement.',
    funding: {
      type: 'public',
      details: 'Radio France (financement public)',
    },
    orientations: ['center-left'],
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
    name: 'RTL',
    url: 'https://www.rtl.fr/',
    rssUrl: 'https://www.rtl.fr/rss',
    faviconUrl: 'https://www.rtl.fr/favicon.ico',
    description:
      'Radio privée généraliste à forte audience, mélangeant information, divertissement et programmes de société.',
    funding: {
      type: 'private',
      details: 'Groupe M6 (actionnaire principal: RTL Group)',
    },
    orientations: ['center'],
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
      "Premier quotidien régional français par le tirage, couvrant l'actualité du Grand Ouest et nationale.",
    funding: {
      type: 'private',
      details: 'Groupe SIPA - Ouest-France (structure associative)',
    },
    orientations: ['center'],
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
    name: 'M6',
    url: 'https://www.6play.fr/',
    rssUrl: 'https://www.6play.fr/feed',
    faviconUrl: 'https://www.6play.fr/favicon.ico',
    description:
      'Chaîne de télévision privée généraliste proposant émissions de divertissement, séries, films et journaux télévisés.',
    funding: {
      type: 'private',
      details: 'Groupe M6 (actionnaire principal: RTL Group)',
    },
    orientations: ['center'],
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
    name: '20 Minutes',
    url: 'https://www.20minutes.fr/',
    rssUrl: 'https://www.20minutes.fr/feeds/rss-une.xml',
    faviconUrl: 'https://www.20minutes.fr/favicon.ico',
    description:
      "Quotidien gratuit à large diffusion, proposant une information synthétique et accessible sur l'actualité nationale et internationale.",
    funding: {
      type: 'private',
      details: 'Groupe Rossel et Ouest-France',
    },
    orientations: ['center'],
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
      'Média indépendant dédié à la vulgarisation scientifique sur les enjeux climatiques et environnementaux, fondé par Thomas Wagner, avec une approche pédagogique basée sur des données scientifiques.',
    funding: {
      type: 'independent',
      details: 'Financement participatif, dons et adhésions',
    },
    orientations: ['ecology-focused'],
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
    name: 'Low-tech Lab',
    url: 'https://lowtechlab.org/fr/',
    rssUrl: 'https://lowtechlab.org/fr/feed',
    faviconUrl: 'https://lowtechlab.org/favicon.ico',
    description:
      'Association qui documente et promeut les technologies low-tech, sobres et résilientes, à travers des tutoriels open source et des expérimentations pratiques pour répondre aux besoins essentiels.',
    funding: {
      type: 'non-profit',
      details: 'Association loi 1901, subventions, dons et partenariats',
    },
    orientations: ['ecological-transition'],
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
    name: 'Vert',
    url: 'https://vert.eco/',
    rssUrl: 'https://vert.eco/feed/',
    faviconUrl: 'https://vert.eco/favicon.ico',
    description:
      "Média en ligne consacré à l'écologie et à la transition environnementale, proposant des articles de fond, enquêtes et analyses sur les enjeux climatiques et les solutions durables.",
    funding: {
      type: 'independent',
      details: 'Abonnements et dons',
    },
    orientations: ['ecology-focused'],
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
    name: 'ADEME',
    url: 'https://www.ademe.fr/',
    rssUrl: 'https://www.ademe.fr/feed',
    faviconUrl: 'https://www.ademe.fr/favicon.ico',
    description:
      'Agence de la Transition Écologique, établissement public qui accompagne la transition écologique et énergétique en France à travers des actions de sensibilisation, recherche et financement de projets.',
    funding: {
      type: 'public',
      details: "Financement public par l'État français",
    },
    orientations: ['institutional-ecological'],
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
    rssUrl: 'https://theshiftproject.org/feed',
    faviconUrl: 'https://theshiftproject.org/favicon.ico',
    description:
      'Think tank qui œuvre pour une économie libérée de la contrainte carbone, produisant des analyses et propositions pour accélérer la transition énergétique et réduire la dépendance aux énergies fossiles.',
    funding: {
      type: 'non-profit',
      details: "Mécénat d'entreprises, dons et subventions",
    },
    orientations: ['scientific-ecological'],
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
    name: 'Jean-Marc Jancovici',
    url: 'https://jancovici.com/',
    rssUrl: 'https://jancovici.com/feed',
    faviconUrl: 'https://jancovici.com/favicon.ico',
    description:
      'Blog personnel de Jean-Marc Jancovici, ingénieur et consultant spécialisé dans les questions énergétiques et climatiques, cofondateur du cabinet Carbone 4 et du Shift Project.',
    funding: {
      type: 'independent',
      details: 'Blog personnel, pas de financement direct',
    },
    orientations: ['scientific-ecological'],
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
    rssUrl: 'https://reporterre.net/spip.php?page=backend-simple',
    faviconUrl: 'https://reporterre.net/favicon.ico',
    description:
      "Quotidien de l'écologie indépendant, proposant reportages, enquêtes et articles de fond sur les questions environnementales, sociales et démocratiques liées à la transition écologique.",
    funding: {
      type: 'independent',
      details: 'Dons des lecteurs, sans publicité ni actionnaires',
    },
    orientations: ['left-ecological'],
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
    url: 'https://topophile.net/',
    rssUrl: 'https://topophile.net/feed',
    faviconUrl: 'https://topophile.net/favicon.ico',
    description:
      "Média en ligne qui explore les enjeux liés aux territoires, à l'urbanisme et à l'aménagement durable, avec une approche transdisciplinaire entre géographie, sociologie et écologie.",
    funding: {
      type: 'independent',
      details: 'Financement participatif et bénévolat',
    },
    orientations: ['ecology-urbanism'],
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
    name: 'Blog du Modérateur',
    url: 'https://www.blogdumoderateur.com/',
    rssUrl: 'https://www.blogdumoderateur.com/feed/',
    faviconUrl: 'https://www.blogdumoderateur.com/favicon.ico',
    description:
      "Média en ligne spécialisé dans l'actualité du web, des réseaux sociaux, du marketing digital et des nouvelles technologies, avec des analyses, des chiffres clés et des guides pratiques.",
    funding: {
      type: 'private',
      details: 'Entreprise commerciale avec modèle publicitaire et événementiel',
    },
    orientations: ['neutral-tech'],
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
    name: 'Dans les Algorithmes',
    url: 'https://danslesalgorithmes.net/',
    rssUrl: 'https://danslesalgorithmes.net/feed/',
    faviconUrl: 'https://danslesalgorithmes.net/favicon.ico',
    description:
      "Blog d'analyse critique des algorithmes et de leur impact sur la société, examinant les enjeux éthiques, politiques et sociaux des technologies numériques.",
    funding: {
      type: 'independent',
      details: 'Blog indépendant',
    },
    orientations: ['tech-critical'],
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
    name: 'Developpez.com',
    url: 'https://www.developpez.com/',
    rssUrl: 'https://www.developpez.com/rss.php',
    faviconUrl: 'https://www.developpez.com/favicon.ico',
    description:
      "Communauté francophone de développeurs proposant des actualités, tutoriels, cours et forums d'entraide sur la programmation et le développement informatique.",
    funding: {
      type: 'private',
      details: 'Modèle publicitaire et communautaire',
    },
    orientations: ['neutral-tech'],
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
    name: 'Framablog',
    url: 'https://framablog.org/',
    rssUrl: 'https://framablog.org/feed/',
    faviconUrl: 'https://framablog.org/favicon.ico',
    description:
      "Blog de l'association Framasoft promouvant le logiciel libre, la culture libre et les communs numériques, avec une critique des géants du web et la défense de la vie privée.",
    funding: {
      type: 'non-profit',
      details: 'Association loi 1901 financée par dons',
    },
    orientations: ['tech-libertarian-left'],
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
    name: "L'Usine Digitale",
    url: 'https://www.usine-digitale.fr/',
    rssUrl: 'https://www.usine-digitale.fr/rss',
    faviconUrl: 'https://www.usine-digitale.fr/favicon.ico',
    description:
      "Média spécialisé dans la transformation numérique des entreprises, les innovations technologiques et leur impact sur l'industrie et l'économie.",
    funding: {
      type: 'private',
      details: 'Groupe Infopro Digital',
    },
    orientations: ['business-tech'],
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
    name: 'FrenchWeb',
    url: 'https://www.frenchweb.fr/',
    rssUrl: 'https://www.frenchweb.fr/feed',
    faviconUrl: 'https://www.frenchweb.fr/favicon.ico',
    description:
      "Média couvrant l'actualité des startups, de la tech et de l'innovation en France et à l'international, avec interviews de dirigeants et analyses de tendances.",
    funding: {
      type: 'private',
      details: 'Groupe Decode Media',
    },
    orientations: ['business-tech'],
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
    name: 'Human Coders News',
    url: 'https://news.humancoders.com/',
    rssUrl: 'https://news.humancoders.com/items/feed.rss',
    faviconUrl: 'https://news.humancoders.com/favicon.ico',
    description:
      'Agrégateur de nouvelles tech alimenté par la communauté des développeurs, partageant ressources, tutoriels et actualités du développement informatique.',
    funding: {
      type: 'private',
      details: 'Human Coders (entreprise de formation)',
    },
    orientations: ['neutral-tech'],
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
    name: 'Journal du Net',
    url: 'https://www.journaldunet.com/',
    rssUrl: 'https://www.journaldunet.com/rss/',
    faviconUrl: 'https://www.journaldunet.com/favicon.ico',
    description:
      "Média d'information sur l'économie numérique, le business et le management, couvrant actualités, dossiers et guides pratiques pour professionnels et décideurs.",
    funding: {
      type: 'private',
      details: 'Groupe CCM Benchmark (Groupe Figaro)',
    },
    orientations: ['business-tech'],
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
    name: 'JustGeek',
    url: 'https://www.justgeek.fr/',
    rssUrl: 'https://www.justgeek.fr/feed/',
    faviconUrl: 'https://www.justgeek.fr/favicon.ico',
    description:
      "Magazine web dédié à la culture geek, aux nouvelles technologies, jeux vidéo et à l'actualité du numérique, avec tests, guides et astuces.",
    funding: {
      type: 'private',
      details: 'Modèle publicitaire',
    },
    orientations: ['neutral-tech'],
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
    name: 'IT-Connect',
    url: 'https://www.it-connect.fr/',
    rssUrl: 'https://www.it-connect.fr/feed/',
    faviconUrl: 'https://www.it-connect.fr/favicon.ico',
    description:
      "Site d'actualités et de tutoriels techniques pour les professionnels de l'IT, couvrant systèmes, réseaux, sécurité, et administration des infrastructures informatiques.",
    funding: {
      type: 'private',
      details: 'Modèle publicitaire et formation',
    },
    orientation: {
      political: 'neutral-tech',
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
    name: 'Underscore_ (YouTube)',
    url: 'https://www.youtube.com/channel/UCjCeyHQarZ0gtndcuz4dEkw',
    rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCjCeyHQarZ0gtndcuz4dEkw',
    faviconUrl: 'https://www.youtube.com/favicon.ico',
    description:
      'Chaîne YouTube de vulgarisation informatique et technique qui aborde les sujets du numérique avec une approche pédagogique et critique.',
    funding: {
      type: 'independent',
      details: 'YouTube, Tipeee, partenariats occasionnels',
    },
    orientations: ['tech-educational'],
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
    name: 'LADN',
    url: 'https://www.ladn.eu/',
    rssUrl: 'https://www.ladn.eu/feed',
    faviconUrl: 'https://www.ladn.eu/favicon.ico',
    description:
      'Magazine en ligne explorant les transformations numériques et leurs impacts sur la société, les médias, la culture et les marques, avec une approche prospective.',
    funding: {
      type: 'private',
      details: 'Groupe Influencia',
    },
    orientations: ['progressive-tech'],
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
    name: 'La Quadrature du Net',
    url: 'https://www.laquadrature.net/',
    rssUrl: 'https://www.laquadrature.net/feed/',
    faviconUrl: 'https://www.laquadrature.net/favicon.ico',
    description:
      'Association de défense des droits et libertés des citoyens sur Internet, militant pour un web libre et décentralisé contre la surveillance de masse et la censure.',
    funding: {
      type: 'non-profit',
      details: 'Association loi 1901 financée par dons',
    },
    orientations: ['digital-rights-activist'],
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
    name: 'La Revue du Digital',
    url: 'https://www.larevuedudigital.com/',
    rssUrl: 'https://www.larevuedudigital.com/feed/',
    faviconUrl: 'https://www.larevuedudigital.com/favicon.ico',
    description:
      "Publication spécialisée dans l'actualité de la transformation numérique des entreprises et organisations, couvrant stratégies, innovations et technologies.",
    funding: {
      type: 'private',
      details: 'Entreprise indépendante',
    },
    orientations: ['business-tech'],
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
    name: 'LeMagIT',
    url: 'https://www.lemagit.fr/',
    rssUrl: 'https://www.lemagit.fr/rss/ContentSyndication.xml',
    faviconUrl: 'https://www.lemagit.fr/favicon.ico',
    description:
      "Média spécialisé pour les professionnels de l'IT, proposant actualités, analyses et dossiers sur les infrastructures, le cloud, la cybersécurité et la gestion des données.",
    funding: {
      type: 'private',
      details: 'TechTarget (groupe média américain)',
    },
    orientations: ['business-tech'],
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
    name: 'Micode (YouTube)',
    url: 'https://www.youtube.com/channel/UCRhyS_ylPQ5GWBl1lK92ftA',
    rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCRhyS_ylPQ5GWBl1lK92ftA',
    faviconUrl: 'https://www.youtube.com/favicon.ico',
    description:
      'Chaîne YouTube de vulgarisation informatique animée par Michaël Coutte, abordant les sujets de cybersécurité, programmation et culture numérique avec un ton accessible.',
    funding: {
      type: 'independent',
      details: 'YouTube, sponsors et produits dérivés',
    },
    orientations: ['tech-educational'],
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

// Création des collections publiques
// Collection 1: Les 10 plus gros médias français
const mainMediaSources = db.sources
  .find({
    name: {
      $in: [
        'TF1',
        'France Télévisions',
        'Le Monde',
        'BFMTV',
        'Le Figaro',
        'France Inter',
        'RTL',
        'Ouest-France',
        'M6',
        '20 Minutes',
      ],
    },
  })
  .toArray()
  .map((source) => source._id);

db.collections.insertOne({
  name: 'Les 10 plus gros médias français',
  description:
    "Une collection regroupant les flux des principaux médias français d'information généraliste.",
  imageUrl: '/images/collections/main-media.jpg',
  colorHex: '#3f51b5',
  sources: mainMediaSources,
  userId: systemUser._id,
  isPublic: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Collection 2: Veille Écologie
const ecologySources = db.sources
  .find({
    name: {
      $in: [
        'Bon Pote',
        'Low-tech Lab',
        'Vert',
        'ADEME',
        'The Shift Project',
        'Jean-Marc Jancovici',
        'Reporterre',
        'Topophile',
      ],
    },
  })
  .toArray()
  .map((source) => source._id);

db.collections.insertOne({
  name: 'Veille Écologie',
  description:
    'Une collection de sources traitant des enjeux écologiques, climatiques et environnementaux.',
  imageUrl: '/images/collections/ecology.jpg',
  colorHex: '#4caf50',
  sources: ecologySources,
  userId: systemUser._id,
  isPublic: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Collection 3: Veille Web
const webSources = db.sources
  .find({
    name: {
      $in: [
        'Blog du Modérateur',
        'Dans les Algorithmes',
        'Developpez.com',
        'Framablog',
        "L'Usine Digitale",
        'FrenchWeb',
        'Human Coders News',
        'Journal du Net',
        'JustGeek',
        'IT-Connect',
        'Underscore_ (YouTube)',
        'LADN',
        'La Quadrature du Net',
        'La Revue du Digital',
        'LeMagIT',
        'Micode (YouTube)',
      ],
    },
  })
  .toArray()
  .map((source) => source._id);

db.collections.insertOne({
  name: 'Veille Web',
  description:
    "Une collection regroupant des sources d'actualités technologiques, numériques et de développement web.",
  imageUrl: '/images/collections/web-tech.jpg',
  colorHex: '#ff9800',
  sources: webSources,
  userId: systemUser._id,
  isPublic: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

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
