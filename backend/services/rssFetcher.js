import Parser from 'rss-parser';
import Source from '../models/Source.js';
import Article from '../models/Article.js';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

/**
 * Extrait une image d'un article RSS
 */
const extractImageFromRSSItem = (item) => {
  // Tentative d'extraction à partir du champ media
  if (item.media && item.media.$ && item.media.$.url) {
    return item.media.$.url;
  }

  // Tentative d'extraction à partir de l'enclosure
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }

  // Tentative d'extraction à partir du contenu HTML
  if (item.contentEncoded || item.content) {
    const content = item.contentEncoded || item.content;
    const imgRegex = /<img[^>]+src="?([^"\s]+)"?[^>]*>/g;
    const match = imgRegex.exec(content);

    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Récupère les articles de toutes les sources actives
 */
export const fetchAllSources = async () => {
  try {
    // console.log('Démarrage de la récupération de tous les flux RSS...');

    // Récupération de toutes les sources
    const sources = await Source.find();

    if (sources.length === 0) {
      // console.log('Aucune source à récupérer');
      return {
        success: true,
        message: 'Aucune source à récupérer',
        totalSources: 0,
        totalArticles: 0,
      };
    }

    // console.log(`Récupération des articles pour ${sources.length} sources...`);

    // Pour chaque source, récupération des articles
    let totalArticles = 0;

    for (const source of sources) {
      const articlesCount = await fetchSourceArticles(source);
      totalArticles += articlesCount;
    }

    // console.log(`Récupération terminée: ${totalArticles} nouveaux articles ajoutés`);

    return {
      success: true,
      message: 'Récupération des articles terminée',
      totalSources: sources.length,
      totalArticles,
    };
  } catch (error) {
    // console.error('Erreur lors de la récupération de tous les flux RSS:', error);
    return {
      success: false,
      message: error.message,
      totalSources: 0,
      totalArticles: 0,
    };
  }
};

/**
 * Récupère et parse les articles d'une source
 */
export const fetchSourceArticles = async (source) => {
  try {
    // console.log(`Récupération des articles de la source: ${source.name}`);

    // Récupération du flux RSS
    const feed = await parser.parseURL(source.rssUrl);

    // Mise à jour du statut de récupération
    await Source.findByIdAndUpdate(source._id, {
      lastFetched: new Date(),
      fetchStatus: {
        success: true,
        message: `${feed.items.length} articles récupérés`,
        timestamp: new Date(),
      },
    });

    // Traitement des articles
    const articles = await Promise.all(
      feed.items.map(async (item) => {
        try {
          // Extraction de l'image
          const imageUrl = extractImageFromRSSItem(item);

          // Formatage de la date de publication
          const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();

          // Vérification si l'article existe déjà (pour éviter les doublons)
          const existingArticle = await Article.findOne({
            title: item.title,
            sourceId: source._id,
          });

          if (existingArticle) {
            return null; // Article déjà existant, on ne fait rien
          }

          // Création du nouvel article
          return {
            title: item.title,
            content: item.content || item.contentEncoded || '',
            contentSnippet: item.contentSnippet || '',
            link: item.link,
            pubDate: pubDate,
            image: imageUrl,
            sourceId: source._id,
            sourceName: source.name,
            sourceFavicon: source.faviconUrl,
            categories: source.categories,
            orientation: source.orientation,
          };
        } catch (error) {
          console.error(`Erreur lors du traitement d'un article de ${source.name}:`, error);
          return null; // On ignore cet article en cas d'erreur
        }
      })
    );

    // Filtrage des articles nuls (ignorés car existants ou en erreur)
    const validArticles = articles.filter((article) => article !== null);

    // Insertion des nouveaux articles en masse (pour performance)
    if (validArticles.length > 0) {
      await Article.insertMany(validArticles);
      // console.log(`${validArticles.length} nouveaux articles ajoutés pour ${source.name}`);
    }

    return validArticles.length;
  } catch (error) {
    // console.error(`Erreur lors de la récupération des articles de ${source.name}:`, error);

    // Mise à jour du statut d'erreur
    await Source.findByIdAndUpdate(source._id, {
      lastFetched: new Date(),
      fetchStatus: {
        success: false,
        message: error.message,
        timestamp: new Date(),
      },
    });

    return 0;
  }
};

// Export par défaut si nécessaire
export default {
  fetchSourceArticles,
  fetchAllSources,
};
