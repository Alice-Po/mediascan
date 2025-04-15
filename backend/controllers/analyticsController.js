import Analytics from '../models/Analytics.js';
import Article from '../models/Article.js';
import { ORIENTATIONS } from '../config/constants.js';

/**
 * Calcule le score de diversité basé sur l'entropie de Shannon
 * @param {Object} counts - Objet contenant les comptages par catégorie
 * @param {number} total - Nombre total d'éléments
 * @returns {number} Score normalisé entre 0 et 1
 */
const calculateDiversityScore = (counts, total) => {
  if (total === 0) return 0;

  const proportions = Object.values(counts).map((count) => count / total);
  const entropy = proportions.reduce((acc, p) => {
    if (p === 0) return acc;
    return acc - p * Math.log2(p);
  }, 0);

  const maxEntropy = Math.log2(Object.keys(counts).length);
  return entropy / maxEntropy;
};

/**
 * Analyse les clics sur les articles pour générer des statistiques
 * @param {Array} articleClicks - Liste des clics sur les articles
 * @returns {Object} Statistiques calculées
 */
const analyzeArticleClicks = (articleClicks) => {
  const orientationCounts = { political: {} };
  const uniqueSources = new Set();
  const uniqueCategories = new Set();

  articleClicks.forEach((click) => {
    const { sourceId, orientation, category } = click.metadata;

    if (sourceId) uniqueSources.add(sourceId.toString());
    if (category) uniqueCategories.add(category);
    if (orientation?.political) {
      orientationCounts.political[orientation.political] =
        (orientationCounts.political[orientation.political] || 0) + 1;
    }
  });

  const totalClicks = articleClicks.length;
  return {
    political: {
      score: calculateDiversityScore(orientationCounts.political, totalClicks),
      distribution: orientationCounts.political,
    },
    uniqueSourcesRead: uniqueSources.size,
    uniqueCategoriesRead: uniqueCategories.size,
    totalClicks,
  };
};

/**
 * Récupère les statistiques de lecture de l'utilisateur
 * @route GET /api/analytics/statistics
 */
export const getStatisticsData = async (req, res) => {
  try {
    const userId = req.user._id;
    const articleClicks = await Analytics.find({
      userId,
      eventType: 'read',
    }).select('metadata');

    if (articleClicks.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Pas assez de données pour calculer les statistiques',
        data: {
          political: {
            score: 0,
            distribution: Object.fromEntries(
              Object.keys(ORIENTATIONS.political).map((key) => [key, 0])
            ),
          },
          uniqueSourcesRead: 0,
          uniqueCategoriesRead: 0,
          totalClicks: 0,
        },
      });
    }

    const stats = analyzeArticleClicks(articleClicks);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul des statistiques',
      error: error.message,
    });
  }
};

/**
 * Récupère les analytics utilisateur pour une période donnée
 * @route GET /api/analytics/user
 */
export const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = '30days' } = req.query;

    const startDate = new Date();
    const periodDays = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
    };
    startDate.setDate(startDate.getDate() - (periodDays[period] || 30));

    const stats = await Analytics.aggregate([
      {
        $match: {
          userId: userId,
          'metadata.timestamp': { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalInteractions: { $sum: 1 },
          orientationBreakdown: { $push: '$metadata.orientation' },
          categoryBreakdown: { $push: '$metadata.category' },
          eventTypes: { $push: '$eventType' },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        period,
        totalInteractions: stats[0]?.totalInteractions || 0,
        orientationStats: stats[0]?.orientationBreakdown || [],
        categoryBreakdown: stats[0]?.categoryBreakdown || [],
        eventTypeBreakdown: stats[0]?.eventTypes || [],
      },
    });
  } catch (error) {
    console.error('Erreur dans getUserAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des analytics',
      error: error.message,
    });
  }
};

/**
 * Enregistre un nouvel événement analytique
 * @route POST /api/analytics/track
 */
export const trackEvent = async (req, res) => {
  try {
    const { eventType, metadata } = req.body;
    console.log('Received event:', { eventType, metadata });

    const cleanOrientation = {
      political: ORIENTATIONS.political.includes(metadata.orientation?.political)
        ? metadata.orientation.political
        : ORIENTATIONS.political[ORIENTATIONS.political.length - 1],
    };

    const event = new Analytics({
      userId: req.user._id,
      eventType,
      metadata: {
        ...metadata,
        orientation: cleanOrientation,
        sourceId: metadata.sourceId._id,
        timestamp: new Date(metadata.timestamp),
      },
    });

    await event.save();
    console.log('Event saved:', event);

    res.status(200).json({
      success: true,
      message: 'Événement enregistré',
    });
  } catch (error) {
    console.error('Erreur dans trackEvent:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'enregistrement de l'événement",
      error: error.message,
    });
  }
};

/**
 * Réinitialise l'historique des analytics
 * @route DELETE /api/analytics/history
 */
export const resetAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    await Analytics.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: 'Historique réinitialisé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la réinitialisation de l'historique",
      error: error.message,
    });
  }
};
