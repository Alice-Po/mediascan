import Source from '../models/Source.js';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import Collection from '../models/Collection.js';
import Parser from 'rss-parser';
import config from '../config/env.js';
import mongoose from 'mongoose';

const parser = new Parser();

// Fonction de validation d'une source RSS
const validateRssSource = async (rssUrl) => {
  try {
    console.log('Début validation RSS:', { rssUrl });

    // 1. Valider le format de l'URL
    const urlRegex = /^(http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(rssUrl)) {
      console.log('Format URL invalide:', rssUrl);
      throw new Error(
        "L'URL n'est pas dans un format valide. Elle doit commencer par http:// ou https://"
      );
    }

    try {
      console.log('Tentative de parsing du flux RSS...');
      // 2. Essayer de parser l'URL comme un flux RSS
      const feed = await parser.parseURL(rssUrl);
      console.log('Flux RSS parsé avec succès:', {
        title: feed.title,
        itemCount: feed.items?.length,
      });

      // 3. Vérifier que c'est bien un flux RSS valide
      if (!feed || typeof feed !== 'object') {
        console.log('Contenu invalide: pas un objet feed');
        throw new Error('Le contenu ne correspond pas à un flux RSS valide');
      }

      // 4. Vérifier les champs minimums requis
      if (!feed.items || !Array.isArray(feed.items) || feed.items.length === 0) {
        console.log('Flux RSS invalide: aucun article trouvé');
        throw new Error('Le flux RSS ne contient aucun article');
      }

      // 5. Vérifier le format des articles
      const sampleItem = feed.items[0];
      const requiredFields = ['title', 'link'];
      for (const field of requiredFields) {
        if (!sampleItem[field]) {
          console.log('Format article invalide:', { missingField: field });
          throw new Error(`Le format du flux RSS est invalide : champ ${field} manquant`);
        }
      }

      console.log('Validation RSS réussie');
      return {
        isValid: true,
        feed,
        error: null,
      };
    } catch (error) {
      console.log('Erreur lors du parsing RSS:', error.message);
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
    console.log('Validation RSS échouée:', error.message);
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
export const getSourcesFromUserCollections = async (req, res) => {
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

// @desc    Créer une nouvelle source dans le catalogue (l'utilisateur en est le créateur)
// @route   POST /api/sources
// @access  Private
export const createSource = async (req, res) => {
  try {
    const { name, url, rssUrl, description, funding, orientation, collectionId } = req.body;
    const userId = req.user._id;

    console.log('Début création source:', {
      name,
      url,
      rssUrl,
      collectionId,
      userId: userId.toString(),
    });

    // 1. Vérifier si la source existe déjà (par RSS)
    let source = await Source.findOne({ rssUrl });
    let sourceCreated = false;

    console.log('Vérification existence source:', {
      exists: !!source,
      rssUrl,
    });

    if (source) {
      // 2. Si elle existe, vérifier si elle est toujours valide
      console.log('Source existante trouvée, validation du flux...');
      const validation = await validateRssSource(rssUrl);
      if (!validation.isValid) {
        console.log('Source existante invalide:', validation.error);
        return res.status(400).json({
          success: false,
          message: "La source existe mais n'est plus accessible",
          error: validation.error,
        });
      }
      console.log('Source existante validée avec succès');
    } else {
      // 3. Si nouvelle source, valider avant création
      console.log('Nouvelle source, validation du flux...');
      const validation = await validateRssSource(rssUrl);
      if (!validation.isValid) {
        console.log('Validation du flux échouée:', validation.error);
        return res.status(400).json({
          success: false,
          message: 'Impossible de valider la source RSS',
          error: validation.error,
        });
      }
      console.log('Validation du flux réussie, création de la source...');

      try {
        // 4. Créer la source avec tous les champs transmis
        source = await Source.create({
          name: name || validation.feed.title || 'Source sans nom',
          rssUrl,
          url: url || validation.feed.link || rssUrl,
          description: description || validation.feed.description || '',
          faviconUrl: `https://www.google.com/s2/favicons?domain=${(
            url ||
            validation.feed.link ||
            ''
          ).replace(/^https?:\/\//, '')}`,
          lastValidated: new Date(),
          status: 'active',
          funding: funding || {},
          orientation: orientation || [],
          isUserAdded: true,
          addedBy: userId,
        });
        sourceCreated = true;
        console.log('Source créée avec succès:', {
          sourceId: source._id.toString(),
          name: source.name,
        });

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

    // 5. Vérifier la collection cible
    console.log('Vérification de la collection cible:', {
      collectionId,
      userId: userId.toString(),
    });
    const targetCollection = await Collection.findOne({ _id: collectionId, userId });
    if (!targetCollection) {
      console.log('Collection non trouvée ou non autorisée:', {
        collectionId,
        userId: userId.toString(),
      });
      // Si la collection n'existe pas ou n'appartient pas à l'utilisateur
      if (sourceCreated) {
        console.log('Suppression de la source créée car collection invalide');
        await Source.findByIdAndDelete(source._id);
      }
      return res.status(400).json({
        success: false,
        message: "La collection spécifiée n'existe pas ou ne vous appartient pas.",
      });
    }
    console.log('Collection cible trouvée:', {
      collectionId: targetCollection._id.toString(),
      name: targetCollection.name,
    });

    // 6. Ajouter la source à la collection si pas déjà présente
    if (!targetCollection.sources.some((s) => s.toString() === source._id.toString())) {
      console.log('Ajout de la source à la collection...');
      targetCollection.sources.push(source._id);
      await targetCollection.save();
      console.log('Source ajoutée à la collection avec succès');
    } else {
      console.log('Source déjà présente dans la collection');
    }

    // 7. Enregistrer l'événement analytics si besoin
    if (sourceCreated) {
      console.log("Enregistrement de l'événement analytics...");
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
      console.log('Événement analytics enregistré');
    }

    console.log('Création de source terminée avec succès');
    res.status(201).json({
      success: true,
      data: source,
    });
  } catch (error) {
    console.error('Erreur globale dans createSource:', error);
    res.status(400).json({
      success: false,
      message: 'Impossible de créer la source',
      error: error.message,
    });
  }
};

// @desc    Supprimer une source personnalisée du catalogue (seul le créateur peut supprimer)
// @route   DELETE /api/sources/:id
// @access  Private
export const deleteSource = async (req, res) => {
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
 * - Pour supprimer complètement une source personnalisée, utiliser deleteSource
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

export const getSourceExists = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ exists: false, error: 'URL requise' });
    }
    const source = await Source.findOne({ $or: [{ rssUrl: url }, { url }] });
    if (source) {
      return res.json({
        exists: true,
        source: { name: source.name, _id: source._id, rssUrl: source.rssUrl },
      });
    }
    return res.json({ exists: false });
  } catch (error) {
    res.status(500).json({ exists: false, error: error.message });
  }
};
