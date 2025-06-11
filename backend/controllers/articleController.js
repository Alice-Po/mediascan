import Article from '../models/Article.js';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import Collection from '../models/Collection.js';

/**
 * @desc    Récupère les articles avec filtres et pagination
 * @route   GET /api/articles
 * @access  Private
 * @param   {Object} req.query.page - Numéro de la page (défaut: 1)
 * @param   {Object} req.query.limit - Nombre d'articles par page (défaut: 20)
 * @param   {Object} req.query.sources - Liste des IDs de sources séparés par des virgules
 * @param   {Object} req.query.collection - ID de la collection pour filtrer les sources
 * @returns {Object} Articles paginés avec flag isSaved et métadonnées
 */
export const getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 20, sources, collection } = req.query;
    const user = req.user;

    // Construire la requête de base
    const query = {};

    // Si une collection est spécifiée, obtenir ses sources
    let availableSourceIds = [];
    if (collection) {
      const userCollection = await Collection.findById(collection).populate('sources');
      if (userCollection) {
        availableSourceIds = userCollection.sources.map((source) => source._id.toString());
      }

      // Si la collection est spécifiée mais vide, retourner un tableau vide
      if (availableSourceIds.length === 0) {
        return res.json({
          articles: [],
          hasMore: false,
          total: 0,
        });
      }
    }

    // Filtrer par sources spécifiées
    if (sources && sources.length) {
      // Filtrer les sourceIds vides et invalides
      const validSourceIds = sources
        .split(',')
        .filter((id) => id && id.trim().length === 24)
        .filter((id) => !collection || availableSourceIds.includes(id));

      if (validSourceIds.length > 0) {
        query.sourceId = { $in: validSourceIds };
      } else {
        return res.json({
          articles: [],
          hasMore: false,
          total: 0,
        });
      }
    } else if (collection && availableSourceIds.length > 0) {
      // Si aucune source n'est spécifiée mais qu'une collection est fournie
      query.sourceId = { $in: availableSourceIds };
    }

    // Récupérer les articles
    let articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('sourceId', 'name faviconUrl url');

    // Ajouter le flag isSaved
    articles = articles.map((article) => ({
      ...article.toObject(),
      isSaved: user.savedArticles.includes(article._id),
    }));

    const total = await Article.countDocuments(query);

    res.json({
      articles,
      hasMore: articles.length === parseInt(limit),
      total,
    });
  } catch (error) {
    console.error('[getArticles] Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des articles',
      error: error.message,
    });
  }
};

/**
 * @desc    Récupère les détails d'un article spécifique
 * @route   GET /api/articles/:id
 * @access  Private
 * @param   {string} req.params.id - ID de l'article à récupérer
 * @returns {Object} Article avec les détails de sa source
 */
export const getArticleById = async (req, res) => {
  try {
    const articleId = req.params.id;

    const article = await Article.findById(articleId).populate('sourceId', 'name faviconUrl url');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'article",
      error: error.message,
    });
  }
};

/**
 * @desc    Marque un article comme lu et enregistre l'analytique
 * @route   POST /api/articles/:id/read
 * @access  Private
 * @param   {string} req.params.id - ID de l'article à marquer
 * @param   {Object} req.user - Utilisateur authentifié
 * @returns {Object} Message de confirmation
 */
export const markArticleAsRead = async (req, res) => {
  try {
    const articleId = req.params.id;
    const userId = req.user._id;

    // Vérification que l'article existe
    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé',
      });
    }

    // Recherche si l'utilisateur a déjà interagi avec cet article
    const userInteractionIndex = article.userInteractions.findIndex(
      (interaction) => interaction.userId.toString() === userId.toString()
    );

    if (userInteractionIndex !== -1) {
      // Mise à jour de l'interaction existante
      article.userInteractions[userInteractionIndex].isRead = true;
      article.userInteractions[userInteractionIndex].readDate = new Date();
    } else {
      // Création d'une nouvelle interaction
      article.userInteractions.push({
        userId,
        isRead: true,
        readDate: new Date(),
      });
    }

    await article.save();

    // Enregistrement de l'événement analytique
    await Analytics.create({
      userId,
      eventType: 'articleClick',
      metadata: {
        articleId: article._id,
        sourceId: article.sourceId,
        orientation: article.orientation,
        category: article.categories[0] || null,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Article marqué comme lu',
    });
  } catch (error) {
    console.error("Erreur lors du marquage de l'article comme lu:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du marquage de l'article comme lu",
      error: error.message,
    });
  }
};

/**
 * @desc    Sauvegarde un article dans les favoris de l'utilisateur
 * @route   POST /api/articles/:id/save
 * @access  Private
 * @param   {string} req.params.id - ID de l'article à sauvegarder
 * @param   {Object} req.user - Utilisateur authentifié
 * @returns {Object} Statut de sauvegarde avec articleId
 */
export const saveArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const userId = req.user._id;

    // Vérifier que l'article existe
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé',
      });
    }

    // Ajouter l'article aux favoris (addToSet évite les doublons)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { savedArticles: articleId },
      },
      { new: true }
    );

    // Mettre à jour les interactions de l'article
    await Article.findByIdAndUpdate(articleId, {
      $addToSet: {
        userInteractions: {
          userId,
          type: 'save',
          date: new Date(),
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Article sauvegardé',
      data: {
        isSaved: true,
        articleId,
      },
    });
  } catch (error) {
    console.error('Error in saveArticle:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la sauvegarde de l'article",
      error: error.message,
    });
  }
};

/**
 * @desc    Retire un article des favoris de l'utilisateur
 * @route   DELETE /api/articles/:id/save
 * @access  Private
 * @param   {string} req.params.id - ID de l'article à retirer
 * @param   {Object} req.user - Utilisateur authentifié
 * @returns {Object} Statut de désauvegarde avec articleId
 */
export const unsaveArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const userId = req.user._id;

    // Retirer l'article des favoris de l'utilisateur
    await User.findByIdAndUpdate(userId, {
      $pull: { savedArticles: articleId },
    });

    // Mettre à jour les interactions de l'article
    await Article.findByIdAndUpdate(articleId, {
      $pull: {
        userInteractions: {
          userId,
          type: 'save',
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Article retiré des favoris',
      data: {
        isSaved: false,
        articleId,
      },
    });
  } catch (error) {
    console.error('Error in unsaveArticle:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la désauvegarde de l'article",
      error: error.message,
    });
  }
};

/**
 * @desc    Récupère tous les articles sauvegardés par l'utilisateur
 * @route   GET /api/articles/saved
 * @access  Private
 * @param   {Object} req.user - Utilisateur authentifié
 * @returns {Object} Liste des articles sauvegardés avec métadonnées
 */
export const getSavedArticles = async (req, res) => {
  try {
    const userId = req.user._id;

    // Récupérer l'utilisateur avec ses articles sauvegardés
    const user = await User.findById(userId).populate({
      path: 'savedArticles',
      populate: {
        path: 'sourceId',
        select: 'name faviconUrl url',
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    // S'assurer que savedArticles existe
    const savedArticles = user.savedArticles || [];

    // Ajouter le flag isSaved à true pour tous les articles
    const articles = savedArticles.map((article) => ({
      ...article.toObject(),
      isSaved: true,
    }));

    res.json({
      success: true,
      articles,
      total: articles.length,
    });
  } catch (error) {
    console.error('Error in getSavedArticles:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des articles sauvegardés',
      error: error.message,
    });
  }
};

/**
 * @desc    Crée ou met à jour plusieurs articles en une seule opération
 * @param   {Array} articles - Liste des articles à créer/mettre à jour
 * @returns {Object} Résultat de l'opération bulk
 */
export const createOrUpdateArticles = async (articles) => {
  try {
    const bulkOps = articles.map((article) => ({
      updateOne: {
        filter: { link: article.link },
        update: { $set: article },
        upsert: true,
      },
    }));

    const result = await Article.bulkWrite(bulkOps);

    return result;
  } catch (error) {
    console.error('Error in createOrUpdateArticles:', error);
    throw error;
  }
};

/**
 * @desc    Crée ou met à jour un article avec les données de sa source
 * @param   {Object} articleData - Données de l'article
 * @param   {Object} source - Source de l'article avec ses métadonnées
 * @returns {Object} Article créé ou mis à jour
 */
const createOrUpdateArticle = async (articleData, source) => {
  try {
    // Préparer les données de l'article
    const article = {
      ...articleData,
      sourceId: source._id,
      sourceName: source.name,
      sourceFavicon: source.faviconUrl,
      orientation: source.orientation,
      categories: source.categories,
    };

    // Utiliser updateOne avec upsert
    const result = await Article.updateOne(
      { link: article.link },
      { $set: article },
      { upsert: true }
    );

    return article;
  } catch (error) {
    console.error('Error in createOrUpdateArticle:', error);
    throw error;
  }
};
