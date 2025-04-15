import Analytics from '../models/Analytics.js';
import Article from '../models/Article.js';
import { ORIENTATIONS } from '../config/constants.js';

// @desc    Récupérer le score de diversité de l'utilisateur
// @route   GET /api/analytics/diversity
// @access  Private
export const getDiversityScore = async (req, res) => {
  try {
    const userId = req.user._id;

    // Récupération des clics sur les articles pour calculer la diversité
    const articleClicks = await Analytics.find({
      userId,
      eventType: 'articleClick',
    }).select('metadata');

    if (articleClicks.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Pas assez de données pour calculer un score de diversité',
        data: {
          political: {
            gauche: 0,
            'centre-gauche': 0,
            centre: 0,
            'centre-droite': 0,
            droite: 0,
            'non-spécifié': 0,
          },
          type: {
            mainstream: 0,
            alternatif: 0,
            'non-spécifié': 0,
          },
          structure: {
            institutionnel: 0,
            indépendant: 0,
            'non-spécifié': 0,
          },
          scope: {
            généraliste: 0,
            spécialisé: 0,
            'non-spécifié': 0,
          },
        },
      });
    }

    // Initialisation des compteurs
    const orientationCounts = {
      political: {},
      type: {},
      structure: {},
      scope: {},
    };

    // Comptage des orientations
    articleClicks.forEach((click) => {
      const orientation = click.metadata.orientation;

      if (orientation) {
        // Traitement de chaque dimension d'orientation
        Object.entries(orientation).forEach(([dimension, value]) => {
          if (!orientationCounts[dimension][value]) {
            orientationCounts[dimension][value] = 0;
          }
          orientationCounts[dimension][value]++;
        });
      }
    });

    // Calcul des pourcentages pour chaque dimension
    const totalClicks = articleClicks.length;
    const diversityScore = {};

    Object.entries(orientationCounts).forEach(([dimension, counts]) => {
      diversityScore[dimension] = {};

      Object.entries(counts).forEach(([value, count]) => {
        diversityScore[dimension][value] = Math.round((count / totalClicks) * 100);
      });
    });

    // Enregistrement de l'événement analytique
    await Analytics.create({
      userId,
      eventType: 'pedagogyVisit',
    });

    res.status(200).json({
      success: true,
      data: diversityScore,
    });
  } catch (error) {
    console.error('Erreur lors du calcul du score de diversité:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul du score de diversité',
      error: error.message,
    });
  }
};

// @desc    Réinitialiser l'historique de l'utilisateur
// @route   DELETE /api/analytics/history
// @access  Private
export const resetHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // Suppression de tous les événements analytiques de l'utilisateur
    await Analytics.deleteMany({ userId });

    // Réinitialisation des interactions sur les articles
    await Article.updateMany(
      { 'userInteractions.userId': userId },
      { $pull: { userInteractions: { userId } } }
    );

    res.status(200).json({
      success: true,
      message: 'Historique réinitialisé avec succès',
    });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation de l'historique:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la réinitialisation de l'historique",
      error: error.message,
    });
  }
};

export const trackEvent = async (req, res) => {
  try {
    console.log('Received event data:', {
      eventType: req.body.eventType,
      metadata: {
        articleId: req.body.metadata.articleId,
        sourceId: req.body.metadata.sourceId,
        orientation: req.body.metadata.orientation,
        category: req.body.metadata.category,
      },
    });

    // Vérifier et nettoyer l'orientation
    const orientation = req.body.metadata.orientation || {};

    console.log('Original orientation:', orientation);

    const cleanOrientation = {
      political: ORIENTATIONS.political.includes(orientation.political)
        ? orientation.political
        : ORIENTATIONS.political[ORIENTATIONS.political.length - 1],
      type: ORIENTATIONS.type.includes(orientation.type)
        ? orientation.type
        : ORIENTATIONS.type[ORIENTATIONS.type.length - 1],
      structure: ORIENTATIONS.structure.includes(orientation.structure)
        ? orientation.structure
        : ORIENTATIONS.structure[ORIENTATIONS.structure.length - 1],
      scope: ORIENTATIONS.scope.includes(orientation.scope)
        ? orientation.scope
        : ORIENTATIONS.scope[ORIENTATIONS.scope.length - 1],
    };

    console.log('Cleaned orientation:', cleanOrientation);

    const event = new Analytics({
      userId: req.user._id,
      eventType: req.body.eventType,
      metadata: {
        ...req.body.metadata,
        orientation: cleanOrientation,
        sourceId: req.body.metadata.sourceId._id, // Extraire l'ID de l'objet source
        timestamp: new Date(req.body.metadata.timestamp),
      },
    });

    await event.save();
    console.log('Analytics event saved:', event);

    res.status(200).json({
      success: true,
      message: 'Événement enregistré',
    });
  } catch (error) {
    console.error('Error in trackEvent:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'enregistrement de l'événement",
      error: error.message,
    });
  }
};

export const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = '30days' } = req.query;

    // Calculer la date de début selon la période
    const startDate = new Date();
    switch (period) {
      case '7days':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Récupérer les statistiques
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
          orientationBreakdown: {
            $push: '$metadata.orientation',
          },
          categoryBreakdown: {
            $push: '$metadata.category',
          },
          eventTypes: {
            $push: '$eventType',
          },
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
    // console.error('Error in getUserAnalytics:', error);
    // res.status(500).json({
    //   success: false,
    //   message: 'Erreur lors de la récupération des analytics',
    //   error: error.message,
    // });
  }
};
