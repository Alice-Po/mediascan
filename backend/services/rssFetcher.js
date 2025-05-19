import Parser from 'rss-parser';
import Source from '../models/Source.js';
import Article from '../models/Article.js';
import { createOrUpdateArticles } from '../controllers/articleController.js';

const parser = new Parser({
  headers: {
    'User-Agent':
      "MédiaScan/1.0 (Agrégateur d'actualités français en cours de developpement; Merci de votre hospitalité !;) Node.js/rss-parser",
    Accept: 'application/rss+xml, application/xml, application/atom+xml, text/xml;q=0.9, */*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
  },
  timeout: 5000, // Timeout raisonnable
  customFields: {
    item: [
      ['media:content', 'media'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded'],
      ['dc:creator', 'creator'],
      ['dc:date', 'date'],
      ['category', 'category'],
      ['tags', 'tags'],
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

const parseDate = (item) => {
  try {
    // Essayer d'abord isoDate qui est le plus fiable
    if (item.isoDate) {
      return new Date(item.isoDate);
    }

    // Essayer ensuite la date standard
    if (item.date) {
      return new Date(item.date);
    }

    // Pour pubDate, nettoyer le format si nécessaire
    if (item.pubDate) {
      // Remplacer CEST/CET par +0200/+0100
      const cleanedDate = item.pubDate.replace(' CEST', ' +0200').replace(' CET', ' +0100');
      const date = new Date(cleanedDate);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    // Si aucune date valide n'est trouvée
    return new Date();
  } catch (error) {
    console.warn('Erreur parsing date:', error);
    return new Date();
  }
};

/**
 * Récupère les articles de toutes les sources actives
 */
export const fetchAllSources = async () => {
  try {
    console.log('Démarrage de la récupération de tous les flux RSS...');

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
    console.error('Erreur lors de la récupération de tous les flux RSS:', error);
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
    const feed = await parser.parseURL(source.rssUrl);

    await Source.findByIdAndUpdate(source._id, {
      lastFetched: new Date(),
      fetchStatus: {
        success: true,
        message: `${feed.items.length} articles récupérés`,
        timestamp: new Date(),
      },
    });

    const articles = await Promise.all(
      feed.items.map(async (item, index) => {
        try {
          const imageUrl = extractImageFromRSSItem(item);
          const publishedAt = parseDate(item);

          // Vérifier que la date est valide
          if (isNaN(publishedAt.getTime())) {
            console.warn(`[${source.name}] Date invalide pour l'article: ${item.title}`);
            return null;
          }

          // Vérification si l'article existe déjà
          const existingArticle = await Article.findOne({
            title: item.title,
            sourceId: source._id,
          });

          if (existingArticle) {
            return null;
          }

          // Création du nouvel article
          const articleData = {
            title: item.title,
            content: item.content || item.contentEncoded || '',
            contentSnippet: item.contentSnippet || '',
            link: item.link,
            publishedAt,
            image: imageUrl,
            sourceId: source._id,
            sourceName: source.name,
            sourceFavicon: source.faviconUrl,
            categories: source.categories,
            orientation: source.orientation,
            tags: item.tags || [],
            language: item.language || 'fr',
            creator: item.creator || item.author || item['dc:creator'] || 'Non spécifié',
          };

          return articleData;
        } catch (error) {
          console.error(`[${source.name}] Erreur traitement article:`, {
            title: item.title,
            error: error.message,
          });
          return null;
        }
      })
    );

    const validArticles = articles.filter((article) => article !== null);

    if (validArticles.length > 0) {
      await createOrUpdateArticles(validArticles);
    }

    return validArticles.length;
  } catch (error) {
    console.error(`Erreur pour ${source.name}`);

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

/**
 * Vérifie l'état de toutes les sources RSS
 */
export const checkAllSources = async () => {
  console.log('\n=== Vérification des sources RSS ===');
  try {
    const sources = await Source.find({}).select('name rssUrl lastFetched fetchStatus');
    console.log(`\n📊 Total des sources: ${sources.length}`);

    const stats = {
      total: sources.length,
      ok: 0,
      error: 0,
      neverFetched: 0,
    };

    for (const source of sources) {
      const status = source.fetchStatus || {};
      const lastFetch = source.lastFetched
        ? new Date(source.lastFetched).toLocaleString()
        : 'jamais';

      if (!source.lastFetched) {
        stats.neverFetched++;
        console.log(`❓ ${source.name}: Jamais synchronisée`);
      } else if (!status.success) {
        stats.error++;
        console.log(`❌ ${source.name}: Erreur - ${status.message || 'Inconnue'}`);
      } else {
        stats.ok++;
        console.log(`✅ ${source.name}: OK - Dernière synchro: ${lastFetch}`);
      }
    }

    console.log('\n=== Résumé ===');
    console.log(`✅ Sources valides: ${stats.ok}`);
    console.log(`❌ Sources en erreur: ${stats.error}`);
    console.log(`❓ Sources jamais synchronisées: ${stats.neverFetched}`);
    console.log('================\n');
  } catch (error) {
    console.error('Erreur lors de la vérification des sources:', error);
  }
};

/**
 * Vérifie un flux RSS spécifique
 */
export const checkRssFeed = async (rssUrl) => {
  try {
    console.log('Vérification du flux RSS:', rssUrl);
    const feed = await parser.parseURL(rssUrl);

    // Retourner les informations essentielles du flux
    return {
      title: feed.title,
      description: feed.description,
      link: feed.link,
      items: feed.items.slice(0, 5).map((item) => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        contentSnippet: item.contentSnippet,
      })),
      totalItems: feed.items.length,
    };
  } catch (error) {
    console.error('Erreur lors de la vérification du flux RSS:', error);
    throw error;
  }
};

// Export par défaut
export default {
  fetchSourceArticles,
  fetchAllSources,
  checkAllSources,
  checkRssFeed,
};
