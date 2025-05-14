import Source from '../models/Source.js';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import Parser from 'rss-parser';
import config from '../config/env.js';
import mongoose from 'mongoose';

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

// @desc    Récupérer les sources de l'utilisateur qu'elles soient dans ses collections ou les collections qu'il suit. L'objectif est d'optimiser le chargement des sources nécéssaires au parcours utilisateurs.
// @route   GET /api/sources/user
// @access  Private
export const getUserSources = async (req, res) => {
  try {
    const userId = req.user._id;

    // Récupérer l'utilisateur avec ses collections et collections suivies
    const user = await User.findById(userId)
      .populate('collections')
      .populate('followedCollections');

    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    // Récupérer les sources depuis les collections de l'utilisateur
    // et les collections qu'il suit
    let userSourceIds = new Set();
    let userSources = [];

    // Ajouter les sources des collections propres à l'utilisateur
    if (user.collections && user.collections.length > 0) {
      for (const collection of user.collections) {
        if (collection.sources && collection.sources.length > 0) {
          for (const sourceId of collection.sources) {
            userSourceIds.add(sourceId.toString());
          }
        }
      }
    }

    // Ajouter les sources des collections suivies par l'utilisateur
    if (user.followedCollections && user.followedCollections.length > 0) {
      for (const collection of user.followedCollections) {
        if (collection.sources && collection.sources.length > 0) {
          for (const sourceId of collection.sources) {
            userSourceIds.add(sourceId.toString());
          }
        }
      }
    }

    // Récupérer les données complètes des sources
    if (userSourceIds.size > 0) {
      userSources = await Source.find({
        _id: { $in: Array.from(userSourceIds) },
      });
    }

    // Retourner les sources actives
    res.status(200).json(userSources);
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
      // 5. Rechercher la collection par défaut "Mes sources" de l'utilisateur
      const Collection = mongoose.model('Collection');
      let defaultCollection = await Collection.findOne({
        userId,
        name: 'Mes sources',
      });

      // Créer la collection par défaut si elle n'existe pas
      if (!defaultCollection) {
        console.log(
          'Création de la collection par défaut "Mes sources" pour l\'utilisateur:',
          userId
        );
        defaultCollection = await Collection.create({
          name: 'Mes sources',
          description: 'Collection par défaut pour vos sources',
          userId,
          sources: [source._id],
          colorHex: '#3B82F6', // Bleu par défaut
        });

        // Ajouter la collection à l'utilisateur
        await User.findByIdAndUpdate(userId, {
          $addToSet: { collections: defaultCollection._id },
        });

        console.log('Collection par défaut créée avec succès:', {
          id: defaultCollection._id,
          name: defaultCollection.name,
        });
      } else {
        // Ajouter la source à la collection existante si elle n'y est pas déjà
        if (!defaultCollection.sources.some((s) => s.toString() === source._id.toString())) {
          console.log('Ajout de la source à la collection par défaut existante');
          await Collection.findByIdAndUpdate(defaultCollection._id, {
            $addToSet: { sources: source._id },
          });
        } else {
          console.log('La source est déjà dans la collection par défaut');
        }
      }

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

/**
 * @desc    Supprimer définitivement une source personnalisée ajoutée par l'utilisateur
 * @route   DELETE /api/sources/user/:id
 * @access  Private
 *
 * @example
 * // Utilisation côté frontend:
 * await axios.delete(`/api/sources/user/${sourceId}`);
 *
 * @description
 * Cette fonction supprime DÉFINITIVEMENT une source de la base de données.
 * Elle ne doit être utilisée que pour les sources personnalisées créées par l'utilisateur.
 *
 * ATTENTION:
 * - Cette fonction supprime la source de toutes les collections de l'utilisateur
 * - La source est complètement effacée de la base de données
 * - Ne pas utiliser pour les sources système/prédéfinies (utiliser removeSourceFromAllCollections)
 * - Vérifier la propriété isUserAdded=true avant suppression
 *
 * Cas d'usage:
 * - Lorsqu'un utilisateur souhaite supprimer une source RSS personnalisée qu'il a lui-même créée
 * - Lorsqu'une source personnalisée n'est plus fonctionnelle et doit être retirée
 */
export const deleteUserSource = async (req, res) => {
  try {
    const sourceId = req.params.id;
    const userId = req.user._id;

    console.log('Tentative de suppression de source:', {
      sourceId,
      userId,
    });

    // Vérification que la source existe et appartient à l'utilisateur
    const source = await Source.findOne({
      _id: sourceId,
      addedBy: req.user._id,
      isUserAdded: true,
    });

    if (!source) {
      console.log('Source non trouvée ou non autorisée:', sourceId);
      return res.status(404).json({
        success: false,
        message: 'Source non trouvée ou non autorisée',
      });
    }

    // Supprimer la référence dans toutes les collections
    const Collection = mongoose.model('Collection');
    const userCollections = await Collection.find({
      userId,
      sources: sourceId,
    });

    console.log('Collections contenant la source à supprimer:', {
      sourceId,
      collectionCount: userCollections.length,
      collections: userCollections.map((c) => ({ id: c._id, name: c.name })),
    });

    // Retirer la source de chaque collection
    const updatePromises = userCollections.map((collection) =>
      Collection.findByIdAndUpdate(collection._id, { $pull: { sources: sourceId } }, { new: true })
    );

    await Promise.all(updatePromises);
    console.log('Source retirée de toutes les collections');

    // Suppression de la source
    await Source.findByIdAndDelete(sourceId);
    console.log('Source supprimée avec succès:', sourceId);

    // Enregistrement de l'événement analytique
    await Analytics.create({
      userId: req.user._id,
      eventType: 'sourceRemove',
      metadata: {
        sourceId: sourceId,
        collectionsUpdated: userCollections.length,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Source supprimée avec succès',
      collectionsUpdated: userCollections.length,
      collections: userCollections.map((c) => ({ id: c._id, name: c.name })),
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

/**
 * @desc    Récupérer une source par son ID
 * @route   GET /api/sources/:id
 * @access  Private
 */
export const getSourceById = async (req, res) => {
  try {
    const source = await Source.findById(req.params.id);

    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Source non trouvée',
      });
    }

    res.json({
      success: true,
      data: source,
    });
  } catch (error) {
    console.error('Erreur dans getSourceById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la source',
      error: error.message,
    });
  }
};

/**
 * @desc    Retirer une source de toutes les collections de l'utilisateur
 * @route   POST /api/sources/user/:sourceId/remove-from-collections
 * @access  Private
 *
 * @example
 * // Utilisation côté frontend:
 * await axios.post(`/api/sources/user/${sourceId}/remove-from-collections`);
 *
 * @description
 * Cette fonction retire la référence à une source de toutes les collections de l'utilisateur,
 * SANS supprimer la source elle-même de la base de données.
 *
 * ATTENTION:
 * - La source reste dans la base de données et reste disponible pour d'autres utilisateurs
 * - À utiliser pour les sources système/prédéfinies que l'utilisateur ne veut plus suivre
 * - Pour supprimer complètement une source personnalisée, utiliser deleteUserSource
 *
 * Cas d'usage:
 * - Lorsqu'un utilisateur ne souhaite plus suivre une source dans ses collections
 * - Lors du désabonnement à une source système que d'autres utilisateurs continuent à utiliser
 * - Lorsqu'un utilisateur veut se désabonner d'une source sans la supprimer définitivement
 */
export const removeSourceFromAllCollections = async (req, res) => {
  try {
    const sourceId = req.params.sourceId;
    const userId = req.user._id;

    console.log('Tentative de retrait de la source de toutes les collections:', {
      sourceId,
      userId,
    });

    // Vérifier que la source existe
    const sourceExists = await Source.findById(sourceId);
    if (!sourceExists) {
      console.log('Source non trouvée:', sourceId);
      return res.status(404).json({
        success: false,
        message: 'Source non trouvée',
      });
    }

    // Trouver toutes les collections de l'utilisateur qui contiennent cette source
    const Collection = mongoose.model('Collection');
    const userCollections = await Collection.find({
      userId,
      sources: sourceId,
    });

    console.log('Collections trouvées contenant la source:', {
      sourceId,
      collectionCount: userCollections.length,
      collections: userCollections.map((c) => ({ id: c._id, name: c.name })),
    });

    // Retirer la source de chaque collection
    const updateOperations = userCollections.map((collection) =>
      Collection.findByIdAndUpdate(collection._id, { $pull: { sources: sourceId } }, { new: true })
    );

    const updatedCollections = await Promise.all(updateOperations);

    console.log('Source retirée avec succès de toutes les collections:', {
      sourceId,
      collectionsUpdated: updatedCollections.length,
    });

    // Enregistrer l'événement analytics
    await Analytics.create({
      userId,
      eventType: 'sourceRemoveFromCollections',
      metadata: {
        sourceId,
        collectionsUpdated: userCollections.length,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Source retirée de toutes les collections',
      collectionsUpdated: userCollections.length,
      collections: userCollections.map((c) => ({ id: c._id, name: c.name })),
    });
  } catch (error) {
    console.error('Erreur lors du retrait de la source:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du retrait de la source des collections',
      error: error.message,
    });
  }
};
