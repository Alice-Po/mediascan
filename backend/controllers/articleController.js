import Article from '../models/Article.js';
import Source from '../models/Source.js';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import config from '../config/config.js';

// @desc    Récupérer les articles (avec filtres)
// @route   GET /api/articles
// @access  Private
export const getArticles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = config.limits.maxArticlesPerPage,
      categories,
      orientation,
      sources,
      search,
    } = req.query;

    // Conversion des paramètres
    const pageNum = parseInt(page, 10);
    const limitNum = Math.min(parseInt(limit, 10), config.limits.maxArticlesPerPage);
    const skip = (pageNum - 1) * limitNum;

    // Construction du filtre
    const filter = {};

    // Récupération des sources actives de l'utilisateur
    const user = await User.findById(req.user._id);
    const userSourceIds = user.activeSources;

    // Filtre par sources
    if (sources) {
      const sourceArray = sources.split(',');
      // Intersection avec les sources actives de l'utilisateur
      filter.sourceId = { $in: sourceArray.filter((id) => userSourceIds.includes(id)) };
    } else {
      // Par défaut, uniquement les sources actives de l'utilisateur
      filter.sourceId = { $in: userSourceIds };
    }

    // Filtre par catégories
    if (categories) {
      const categoriesArray = categories.split(',');
      filter.categories = { $in: categoriesArray };
    }

    // Filtre par orientation
    if (orientation) {
      const orientationObj = JSON.parse(orientation);

      for (const [key, value] of Object.entries(orientationObj)) {
        if (value) {
          filter[`orientation.${key}`] = value;
        }
      }
    }

    // Filtre par recherche texte
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { contentSnippet: { $regex: search, $options: 'i' } },
      ];
    }

    // Exécution de la requête
    const articles = await Article.find(filter)
      .sort({ pubDate: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('sourceId', 'name faviconUrl url');

    // Comptage total des articles (pour la pagination)
    const total = await Article.countDocuments(filter);

    // Enregistrement de l'événement analytique (application de filtres)
    if (categories || orientation || sources || search) {
      await Analytics.create({
        userId: req.user._id,
        eventType: 'filterApply',
        metadata: {
          filters: {
            categories: categories ? categories.split(',') : null,
            orientation: orientation ? JSON.parse(orientation) : null,
            sources: sources ? sources.split(',') : null,
            search: search || null,
          },
        },
      });
    }

    res.status(200).json({
      success: true,
      count: articles.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: articles,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des articles',
      error: error.message,
    });
  }
};

// @desc    Récupérer les détails d'un article
// @route   GET /api/articles/:id
// @access  Private
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

// @desc    Marquer un article comme lu
// @route   POST /api/articles/:id/read
// @access  Private
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

    // Mise à jour des interactions de l'utilisateur avec l'article
    let updated = false;

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

// @desc    Sauvegarder un article
// @route   POST /api/articles/:id/save
// @access  Private
export const saveArticle = async (req, res) => {
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

    // Mise à jour des interactions de l'utilisateur avec l'article
    let updated = false;

    // Recherche si l'utilisateur a déjà interagi avec cet article
    const userInteractionIndex = article.userInteractions.findIndex(
      (interaction) => interaction.userId.toString() === userId.toString()
    );

    if (userInteractionIndex !== -1) {
      // Mise à jour de l'interaction existante
      article.userInteractions[userInteractionIndex].isSaved = true;
      article.userInteractions[userInteractionIndex].savedDate = new Date();
    } else {
      // Création d'une nouvelle interaction
      article.userInteractions.push({
        userId,
        isSaved: true,
        savedDate: new Date(),
      });
    }

    await article.save();

    // Enregistrement de l'événement analytique
    await Analytics.create({
      userId,
      eventType: 'articleSave',
      metadata: {
        articleId: article._id,
        sourceId: article.sourceId,
        orientation: article.orientation,
        category: article.categories[0] || null,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Article sauvegardé',
    });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'article:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la sauvegarde de l'article",
      error: error.message,
    });
  }
};

// @desc    Désauvegarder un article
// @route   DELETE /api/articles/:id/save
// @access  Private
export const unsaveArticle = async (req, res) => {
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
      article.userInteractions[userInteractionIndex].isSaved = false;
      article.userInteractions[userInteractionIndex].savedDate = null;
    }

    await article.save();

    // Enregistrement de l'événement analytique
    await Analytics.create({
      userId,
      eventType: 'articleUnsave',
      metadata: {
        articleId: article._id,
        sourceId: article.sourceId,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Article désauvegardé',
    });
  } catch (error) {
    console.error("Erreur lors de la désauvegarde de l'article:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la désauvegarde de l'article",
      error: error.message,
    });
  }
};

// @desc    Récupérer les articles sauvegardés par l'utilisateur
// @route   GET /api/articles/saved
// @access  Private
export const getSavedArticles = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = config.limits.maxArticlesPerPage } = req.query;

    // Conversion des paramètres
    const pageNum = parseInt(page, 10);
    const limitNum = Math.min(parseInt(limit, 10), config.limits.maxArticlesPerPage);
    const skip = (pageNum - 1) * limitNum;

    // Construction du filtre pour les articles sauvegardés
    const filter = {
      userInteractions: {
        $elemMatch: {
          userId: userId,
          isSaved: true,
        },
      },
    };

    // Exécution de la requête
    const articles = await Article.find(filter)
      .sort({ 'userInteractions.savedDate': -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('sourceId', 'name faviconUrl url');

    // Comptage total des articles sauvegardés
    const total = await Article.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: articles.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: articles,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des articles sauvegardés:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des articles sauvegardés',
      error: error.message,
    });
  }
};
