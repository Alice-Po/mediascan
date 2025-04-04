import Source from '../models/Source.js';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import Parser from 'rss-parser';
import config from '../config/config.js';

const parser = new Parser();

// Fonction utilitaire pour valider l'URL RSS
const validateRSS = async (url) => {
  try {
    const feed = await parser.parseURL(url);
    return {
      isValid: true,
      feed,
    };
  } catch (error) {
    return {
      isValid: false,
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
    console.log('Getting sources for user:', userId);

    // Récupérer l'utilisateur avec ses sources actives
    const user = await User.findById(userId).populate('activeSources').select('activeSources');

    console.log('Found user sources:', {
      userId,
      activeSources: user?.activeSources,
      sourceCount: user?.activeSources?.length,
    });

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

    console.log('Sending enabled sources:', enabledSources);

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

// @desc    Ajouter une source personnalisée
// @route   POST /api/sources/user
// @access  Private
export const addUserSource = async (req, res) => {
  try {
    console.log('Received source data:', req.body); // Debug log

    // Validation des données requises
    const { name, url, rssUrl, categories, orientation } = req.body;

    if (!name || !url || !rssUrl || !categories || !orientation) {
      return res.status(400).json({
        success: false,
        message: 'Toutes les informations sont requises',
      });
    }

    // Création de la source
    const source = new Source({
      name,
      url,
      rssUrl,
      categories,
      orientation,
      isUserAdded: true,
      addedBy: req.user._id,
    });

    // Sauvegarde de la source
    const savedSource = await source.save();
    console.log('Saved source:', savedSource); // Debug log

    // Ajout de la source aux sources actives de l'utilisateur
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { activeSources: savedSource._id },
    });

    res.status(201).json({
      success: true,
      data: savedSource,
    });
  } catch (error) {
    console.error('Error in addUserSource:', error); // Debug log détaillé
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout de la source",
      error: error.message,
      details: error.errors
        ? Object.keys(error.errors).map((key) => ({
            field: key,
            message: error.errors[key].message,
          }))
        : null,
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
