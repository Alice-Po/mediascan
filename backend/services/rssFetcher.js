import Parser from 'rss-parser';
import Source from '../models/Source.js';
import Article from '../models/Article.js';
import { createOrUpdateArticles } from '../controllers/articleController.js';

const parser = new Parser({
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
    // const brutfeed = await parser.parseURL(source.rssUrl);

    // const echantillon = {
    //   'https://www.lemonde.fr': 0,
    //   'https://www.lefigaro.fr': 0,
    //   'https://www.liberation.fr': 0,
    //   'https://www.lesechos.fr': 0,
    //   'https://www.francetvinfo.fr': 0,
    //   'https://www.lepoint.fr': 0,
    //   'https://www.lexpress.fr': 0,
    //   'https://www.mediapart.fr': 0,
    //   'https://www.leparisien.fr': 0,
    //   'https://www.20minutes.fr': 0,
    //   'https://www.humanite.fr': 0,
    //   'https://www.challenges.fr': 0,
    //   'https://www.la-croix.com': 0,
    //   'https://www.marianne.net': 0,
    //   'https://www.nouvelobs.com': 0,
    //   'https://www.lesinrocks.com': 0,
    //   'https://www.courrierinternational.com': 0,
    //   'https://reporterre.net/': 0,
    // };
    // // Vérifier si le feed a des items
    // if (brutfeed && brutfeed.items && brutfeed.items.length > 0) {
    //   // Essayer de déterminer quelle source c'est à partir du premier article
    //   const firstItem = brutfeed.items[0];

    //   if (firstItem.link) {
    //     // Parcourir les clés de l'objet échantillon
    //     for (const sourceKey in echantillon) {
    //       // Vérifier si le lien de l'article contient la clé de la source
    //       // et que cette source n'a pas encore été loggée
    //       if (firstItem.link.toLowerCase().includes(sourceKey) && echantillon[sourceKey] < 1) {
    //         // Afficher uniquement le premier article de cette source
    //         console.log(`Premier article de ${sourceKey}:`, JSON.stringify(firstItem, null, 2));
    //         // Marquer cette source comme loggée
    //         echantillon[sourceKey] = 1;
    //         // Sortir de la boucle après avoir trouvé une correspondance
    //         break;
    //       }
    //     }
    //   }
    // }

    await Source.findByIdAndUpdate(source._id, {
      lastFetched: new Date(),
      fetchStatus: {
        success: true,
        message: `${feed.items.length} articles récupérés`,
        timestamp: new Date(),
      },
    });

    const articles = await Promise.all(
      feed.items.map(async (item) => {
        try {
          const imageUrl = extractImageFromRSSItem(item);
          const pubDate = item.isoDate || item.date || item.pubDate || new Date();

          // Vérification si l'article existe déjà
          const existingArticle = await Article.findOne({
            title: item.title,
            sourceId: source._id,
          });

          if (existingArticle) {
            return null;
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
            tags: item.tags || [],
            language: item.language || 'fr',
            creator: item.creator || item.author || item['dc:creator'] || 'Non spécifié',
          };
        } catch (error) {
          console.error(`Erreur lors du traitement d'un article de ${source.name}:`, error);
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
    console.error(`Erreur lors de la récupération des articles de ${source.name}:`, error);

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
