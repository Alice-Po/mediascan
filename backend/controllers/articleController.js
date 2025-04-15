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
    const { page = 1, limit = 20, sources, categories } = req.query;
    const userId = req.user._id;

    // Récupérer l'utilisateur avec ses sources actives et ses intérêts
    const user = await User.findById(userId)
      .populate('activeSources')
      .select('activeSources interests savedArticles');

    // Construire la requête
    const query = {};

    // Filtrer par sources actives
    if (sources && sources.length) {
      query.sourceId = { $in: sources.split(',') };
    } else if (user.activeSources.length) {
      query.sourceId = { $in: user.activeSources.map((s) => s._id) };
    }

    // Filtrer par catégories spécifiées dans la requête OU par les intérêts de l'utilisateur
    if (categories && categories.length) {
      query.categories = { $in: categories.split(',') };
    } else if (user.interests && user.interests.length) {
      // Par défaut, filtrer par les intérêts de l'utilisateur
      query.categories = { $in: user.interests };
    }

    // Récupérer les articles
    let articles = await Article.find(query)
      .sort({ pubDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('sourceId', 'name faviconUrl url');

    // Convertir les articles en objets simples et ajouter le flag isSaved
    articles = articles.map((article) => ({
      ...article.toObject(),
      isSaved: user.savedArticles.includes(article._id),
    }));

    // Log pour vérifier les articles filtrés
    // console.log(
    //   'Articles filtered by interests:',
    //   articles.map((a) => ({
    //     title: a.title.substring(0, 30),
    //     categories: a.categories,
    //     matches: a.categories.filter((c) => user.interests.includes(c)),
    //   }))
    // );

    res.json({
      articles,
      hasMore: articles.length === parseInt(limit),
      total: await Article.countDocuments(query),
    });
  } catch (error) {
    console.error('Error in getArticles:', error);
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

    console.log('Saving article:', { articleId, userId }); // Debug log

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
      { new: true } // Pour retourner le document mis à jour
    );

    console.log('Updated user:', updatedUser); // Debug log

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

// @desc    Désauvegarder un article
// @route   DELETE /api/articles/:id/save
// @access  Private
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

// @desc    Récupérer les articles sauvegardés par l'utilisateur
// @route   GET /api/articles/saved
// @access  Private
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

const createOrUpdateArticle = async (articleData, source) => {
  try {
    console.log('Creating/Updating article with source data:', {
      sourceId: source._id,
      sourceName: source.name,
      sourceOrientation: source.orientation,
      articleTitle: articleData.title,
    });

    const article = await Article.findOneAndUpdate(
      { title: articleData.title, sourceId: source._id },
      {
        ...articleData,
        sourceId: source._id,
        sourceName: source.name,
        sourceFavicon: source.faviconUrl,
        orientation: source.orientation,
        categories: source.categories,
      },
      { upsert: true, new: true }
    );

    console.log('Article created/updated:', {
      articleId: article._id,
      title: article.title,
      sourceId: article.sourceId,
      orientation: article.orientation,
      categories: article.categories,
    });

    return article;
  } catch (error) {
    console.error('Error in createOrUpdateArticle:', error);
    throw error;
  }
};
