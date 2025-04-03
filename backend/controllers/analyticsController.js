import Analytics from '../models/Analytics.js';
import Article from '../models/Article.js';

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
