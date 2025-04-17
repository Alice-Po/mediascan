import Source from '../models/Source.js';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import Parser from 'rss-parser';
import config from '../config/env.js';

const parser = new Parser();

// Fonction de validation d'une source RSS
const validateRssSource = async (rssUrl) => {
  try {
    // 1. Valider le format de l'URL
    const urlRegex = /^(http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(rssUrl)) {
      throw new Error(
        "L'URL n'est pas dans un format valide. Elle doit commencer par http:// ou https://"
      );
    }

    try {
      // 2. Essayer de parser l'URL comme un flux RSS
      const feed = await parser.parseURL(rssUrl);

      // 3. Vérifier que c'est bien un flux RSS valide
      if (!feed || typeof feed !== 'object') {
        throw new Error('Le contenu ne correspond pas à un flux RSS valide');
      }

      // 4. Vérifier les champs minimums requis
      if (!feed.items || !Array.isArray(feed.items) || feed.items.length === 0) {
        throw new Error('Le flux RSS ne contient aucun article');
      }

      // 5. Vérifier le format des articles
      const sampleItem = feed.items[0];
      const requiredFields = ['title', 'link'];
      for (const field of requiredFields) {
        if (!sampleItem[field]) {
          throw new Error(`Le format du flux RSS est invalide : champ ${field} manquant`);
        }
      }

      return {
        isValid: true,
        feed,
        error: null,
      };
    } catch (error) {
      // Analyser l'erreur pour donner un message approprié
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes('status code 404')) {
        throw new Error("Cette page n'existe pas sur le site (erreur 404)");
      }

      if (errorMessage.includes('status code 403')) {
        throw new Error("Le site refuse l'accès à ce contenu (erreur 403)");
      }

      if (errorMessage.includes('enotfound')) {
        throw new Error("Ce site web n'existe pas. Vérifiez l'URL.");
      }

      if (errorMessage.includes('invalid feed')) {
        throw new Error('Cette URL ne correspond pas à un flux RSS valide');
      }

      // Si l'erreur contient du XML ou HTML mais pas le bon format
      if (errorMessage.includes('xml') || errorMessage.includes('html')) {
        throw new Error("Cette page existe mais ce n'est pas un flux RSS valide");
      }

      // Erreur par défaut si aucune autre ne correspond
      throw new Error('Impossible de lire le contenu de cette URL comme un flux RSS');
    }
  } catch (error) {
    return {
      isValid: false,
      feed: null,
      error: error.message,
    };
  }
};

// @desc    Récupérer toutes les sources disponibles
// @route   GET /api/sources
// @access  Public
export const getAllSources = async (req, res) => {
  try {
    const sources = await Source.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: sources.length,
      data: sources,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des sources:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des sources',
      error: error.message,
    });
  }
};

// @desc    Récupérer les sources activées par l'utilisateur
// @route   GET /api/sources/user
// @access  Private
export const getUserSources = async (req, res) => {
  try {
    const userId = req.user._id;
    // console.log('Getting sources for user:', userId);

    // Récupérer l'utilisateur avec ses sources actives
    const user = await User.findById(userId).populate('activeSources').select('activeSources');

    // console.log('Found user sources:', {
    //   userId,
    //   activeSources: user?.activeSources,
    //   sourceCount: user?.activeSources?.length,
    // });

    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    // Marquer les sources comme enabled
    const enabledSources = user.activeSources.map((source) => ({
      ...source.toObject(),
      enabled: true,
    }));

    // Retourner les sources actives
    res.status(200).json(enabledSources);
  } catch (error) {
    console.error('Error in getUserSources:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des sources',
      error: error.message,
    });
  }
};

// @desc    Ajouter une source aux sources de l'utilisateur
// @route   POST /api/sources/user
// @access  Private
export const addUserSource = async (req, res) => {
  try {
    const { rssUrl, orientation } = req.body;
    const userId = req.user._id;

    // 1. Vérifier si la source existe déjà
    let source = await Source.findOne({ rssUrl });
    let sourceCreated = false;

    if (source) {
      // 2. Si elle existe, vérifier si elle est toujours valide
      const validation = await validateRssSource(rssUrl);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: "La source existe mais n'est plus accessible",
          error: validation.error,
        });
      }
    } else {
      // 3. Si nouvelle source, valider avant création
      const validation = await validateRssSource(rssUrl);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Impossible de valider la source RSS',
          error: validation.error,
        });
      }

      try {
        // 4. Créer la source si valide
        source = await Source.create({
          name: validation.feed.title || 'Source sans nom',
          rssUrl,
          url: validation.feed.link || rssUrl,
          description: validation.feed.description || '',
          faviconUrl: `https://www.google.com/s2/favicons?domain=${validation.feed.link}`,
          lastValidated: new Date(),
          status: 'active',
          orientation: orientation,
        });
        sourceCreated = true;

        // Vérifier que la source a bien été créée
        if (!source || !source._id) {
          throw new Error('Échec de la création de la source dans la base de données');
        }
      } catch (createError) {
        console.error('Erreur lors de la création de la source:', createError);
        return res.status(500).json({
          success: false,
          message: 'Erreur lors de la création de la source',
          error: createError.message,
        });
      }
    }

    // Log pour débugger
    console.log('Source créée/trouvée:', {
      id: source._id,
      name: source.name,
      orientation: source.orientation,
    });

    try {
      // 5. Ajouter aux sources de l'utilisateur
      await User.findByIdAndUpdate(userId, {
        $addToSet: { activeSources: source._id },
      });

      // 6. Enregistrer l'événement analytics
      if (sourceCreated) {
        await Analytics.create({
          userId,
          eventType: 'sourceAdd',
          metadata: {
            sourceName: source.name,
            sourceUrl: source.url,
            sourceId: source._id,
            orientation: source.orientation,
          },
        });
      }

      res.status(201).json({
        success: true,
        data: source,
      });
    } catch (error) {
      // Si l'ajout à l'utilisateur échoue et que c'était une nouvelle source,
      // on supprime la source créée pour maintenir la cohérence
      if (sourceCreated) {
        await Source.findByIdAndDelete(source._id);
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in addUserSource:', error);
    res.status(400).json({
      success: false,
      message: "Impossible d'ajouter la source",
      error: error.message,
    });
  }
};

// @desc    Activer/désactiver une source pour l'utilisateur
// @route   PUT /api/sources/user/:id
// @access  Private
export const toggleUserSource = async (req, res) => {
  try {
    const sourceId = req.params.id;
    const { enabled } = req.body;

    console.log('Toggling source:', { sourceId, enabled });

    // Vérification que la source existe
    const source = await Source.findById(sourceId);
    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Source non trouvée',
      });
    }

    const user = await User.findById(req.user._id);
    if (enabled) {
      // Activation de la source
      if (!user.activeSources.includes(sourceId)) {
        await User.findByIdAndUpdate(req.user._id, { $addToSet: { activeSources: sourceId } });
      }
    } else {
      // Désactivation de la source
      await User.findByIdAndUpdate(req.user._id, { $pull: { activeSources: sourceId } });
    }

    console.log('Source updated successfully');

    res.status(200).json({
      success: true,
      message: enabled ? 'Source activée avec succès' : 'Source désactivée avec succès',
    });
  } catch (error) {
    console.error('Error in toggleUserSource:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification de la source',
      error: error.message,
    });
  }
};

// @desc    Supprimer une source personnalisée
// @route   DELETE /api/sources/user/:id
// @access  Private
export const deleteUserSource = async (req, res) => {
  try {
    const sourceId = req.params.id;

    // Vérification que la source existe et appartient à l'utilisateur
    const source = await Source.findOne({
      _id: sourceId,
      addedBy: req.user._id,
      isUserAdded: true,
    });

    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Source non trouvée ou non autorisée',
      });
    }

    // Suppression de la source
    await Source.findByIdAndDelete(sourceId);

    // Suppression de la référence dans les sources actives de l'utilisateur
    await User.findByIdAndUpdate(req.user._id, { $pull: { activeSources: sourceId } });

    // Enregistrement de l'événement analytique
    await Analytics.create({
      userId: req.user._id,
      eventType: 'sourceRemove',
      metadata: {
        sourceId: sourceId,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Source supprimée avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la source:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la source',
      error: error.message,
    });
  }
};

// @desc    Valider un flux RSS
// @route   POST /api/sources/validate-rss
// @access  Private
export const validateRssUrl = async (req, res) => {
  try {
    const { url } = req.body;

    // Utiliser le parser RSS existant pour vérifier l'URL
    const feed = await parser.parseURL(url);

    if (!feed) {
      throw new Error('Flux RSS invalide');
    }

    res.json({
      isValid: true,
      feed: {
        title: feed.title,
        description: feed.description,
      },
    });
  } catch (error) {
    console.error('Erreur validation RSS:', error);
    res.status(400).json({
      isValid: false,
      error: "Impossible de lire le flux RSS. Vérifiez que l'URL est correcte et accessible.",
    });
  }
};
