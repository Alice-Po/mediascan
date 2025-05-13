import Collection from '../models/Collection.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { generateColorFromId } from '../utils/colorUtils.js';

// @desc    Récupérer toutes les collections de l'utilisateur connecté
// @route   GET /api/collections
// @access  Private
export const getUserCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ userId: req.user._id })
      .populate('sources', 'name url faviconUrl')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des collections:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des collections',
      error: error.message,
    });
  }
};

// @desc    Récupérer toutes les collections publiques
// @route   GET /api/collections/public
// @access  Private
export const getPublicCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ isPublic: true })
      .populate('sources', 'name url faviconUrl')
      .populate('userId', 'username') // Pour afficher le nom du créateur
      .sort({ updatedAt: -1 })
      .limit(10); // Limiter à 10 collections pour l'affichage dans l'onboarding

    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections.map((collection) => ({
        ...collection.toObject(),
        createdBy: collection.userId, // Renommer userId en createdBy pour le frontend
      })),
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des collections publiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des collections publiques',
      error: error.message,
    });
  }
};

// @desc    Créer une nouvelle collection
// @route   POST /api/collections
// @access  Private
export const createCollection = async (req, res) => {
  try {
    const { name, description, imageUrl, sources, isPublic } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Le nom de la collection est requis',
      });
    }

    // Préparer les données de la collection
    const collectionData = {
      name,
      description: description || '',
      imageUrl: imageUrl || '',
      sources: sources || [],
      userId: req.user._id,
      isPublic: isPublic || false,
    };

    // Si pas d'image fournie, générer une couleur basée sur un ID temporaire
    // La couleur sera mise à jour avec l'ID réel après création
    // if (!imageUrl || imageUrl === '') {
    //   const tempId = new mongoose.Types.ObjectId().toString();
    //   collectionData.colorHex = generateColorFromId(tempId);
    // }

    // Créer la collection
    const collection = await Collection.create(collectionData);

    console.log('collection:', collection);
    // Si pas d'image, mettre à jour la couleur avec l'ID réel de la collection
    if (!imageUrl || imageUrl === '') {
      collection.colorHex = generateColorFromId(collection._id.toString());

      await collection.save();
    }

    // Ajouter la collection à l'utilisateur
    await User.findByIdAndUpdate(req.user._id, { $push: { collections: collection._id } });

    res.status(201).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    console.error('Erreur lors de la création de la collection:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la collection',
      error: error.message,
    });
  }
};

// @desc    Récupérer une collection par son ID
// @route   GET /api/collections/:id
// @access  Private
export const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).populate(
      'sources',
      'name url rssUrl faviconUrl'
    );

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection non trouvée',
      });
    }

    // Vérifier que l'utilisateur est le propriétaire de la collection ou qu'elle est publique
    if (collection.userId.toString() !== req.user._id.toString() && !collection.isPublic) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas l'autorisation d'accéder à cette collection",
      });
    }

    res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la collection:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la collection',
      error: error.message,
    });
  }
};

// @desc    Mettre à jour une collection
// @route   PUT /api/collections/:id
// @access  Private
export const updateCollection = async (req, res) => {
  try {
    const { name, description, imageUrl, isPublic } = req.body;

    // Exclure la modification des sources ici, car géré par des endpoints dédiés
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    // Trouver la collection et vérifier que l'utilisateur en est le propriétaire
    let collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection non trouvée',
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (collection.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas l'autorisation de modifier cette collection",
      });
    }

    // Si l'imageUrl a été supprimée et qu'aucune couleur n'est définie, générer une couleur
    if (imageUrl === '' && (!collection.colorHex || collection.colorHex === '')) {
      updateData.colorHex = generateColorFromId(collection._id);
    }

    // Mettre à jour la collection
    collection = await Collection.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('sources', 'name url faviconUrl');

    res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la collection:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la collection',
      error: error.message,
    });
  }
};

// @desc    Supprimer une collection
// @route   DELETE /api/collections/:id
// @access  Private
export const deleteCollection = async (req, res) => {
  try {
    // Trouver la collection
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection non trouvée',
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (collection.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas l'autorisation de supprimer cette collection",
      });
    }

    // Supprimer la collection
    await Collection.findByIdAndDelete(req.params.id);

    // Retirer la référence de la collection chez l'utilisateur
    await User.findByIdAndUpdate(req.user._id, { $pull: { collections: req.params.id } });

    res.status(200).json({
      success: true,
      message: 'Collection supprimée avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la collection:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la collection',
      error: error.message,
    });
  }
};

// @desc    Ajouter une source à une collection
// @route   POST /api/collections/:id/sources
// @access  Private
export const addSourceToCollection = async (req, res) => {
  try {
    const { sourceId } = req.body;

    if (!sourceId) {
      return res.status(400).json({
        success: false,
        message: "L'identifiant de la source est requis",
      });
    }

    // Vérifier si la source existe
    if (!mongoose.Types.ObjectId.isValid(sourceId)) {
      return res.status(400).json({
        success: false,
        message: "L'identifiant de la source n'est pas valide",
      });
    }

    // Trouver la collection
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection non trouvée',
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (collection.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas l'autorisation de modifier cette collection",
      });
    }

    // Vérifier si la source est déjà dans la collection
    if (collection.sources.includes(sourceId)) {
      return res.status(400).json({
        success: false,
        message: 'Cette source est déjà dans la collection',
      });
    }

    // Ajouter la source à la collection
    collection.sources.push(sourceId);
    await collection.save();

    // Retourner la collection mise à jour
    const updatedCollection = await Collection.findById(req.params.id).populate(
      'sources',
      'name url faviconUrl'
    );

    res.status(200).json({
      success: true,
      data: updatedCollection,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la source à la collection:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout de la source à la collection",
      error: error.message,
    });
  }
};

// @desc    Retirer une source d'une collection
// @route   DELETE /api/collections/:id/sources/:sourceId
// @access  Private
export const removeSourceFromCollection = async (req, res) => {
  try {
    const { id, sourceId } = req.params;

    // Vérifier si les identifiants sont valides
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(sourceId)) {
      return res.status(400).json({
        success: false,
        message: 'Les identifiants fournis ne sont pas valides',
      });
    }

    // Trouver la collection
    const collection = await Collection.findById(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection non trouvée',
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (collection.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas l'autorisation de modifier cette collection",
      });
    }

    // Vérifier si la source est dans la collection
    if (!collection.sources.includes(sourceId)) {
      return res.status(400).json({
        success: false,
        message: "Cette source n'est pas dans la collection",
      });
    }

    // Retirer la source de la collection
    collection.sources = collection.sources.filter((source) => source.toString() !== sourceId);
    await collection.save();

    // Retourner la collection mise à jour
    const updatedCollection = await Collection.findById(id).populate(
      'sources',
      'name url faviconUrl'
    );

    res.status(200).json({
      success: true,
      data: updatedCollection,
    });
  } catch (error) {
    console.error('Erreur lors du retrait de la source de la collection:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du retrait de la source de la collection',
      error: error.message,
    });
  }
};

/**
 * Suivre une collection publique
 * @route   POST /api/collections/:id/follow
 * @access  Private
 */
export const followCollection = async (req, res) => {
  try {
    const collectionId = req.params.id;

    // Vérifier si la collection existe
    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection non trouvée',
      });
    }

    // Vérifier si la collection est publique
    if (!collection.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Vous ne pouvez pas suivre une collection privée',
      });
    }

    // Vérifier si l'utilisateur ne suit pas déjà cette collection
    const user = await User.findById(req.user._id);

    // S'assurer que la propriété followedCollections existe
    if (!user.followedCollections) {
      // Si elle n'existe pas encore, l'initialiser
      user.followedCollections = [];
      await user.save();
    }

    if (user.followedCollections.includes(collectionId)) {
      return res.status(400).json({
        success: false,
        message: 'Vous suivez déjà cette collection',
      });
    }

    // Ajouter la collection aux collections suivies par l'utilisateur
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { followedCollections: collectionId },
    });

    res.status(200).json({
      success: true,
      message: 'Collection suivie avec succès',
    });
  } catch (error) {
    console.error('Erreur lors du suivi de la collection:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du suivi de la collection',
      error: error.message,
    });
  }
};

/**
 * Ne plus suivre une collection
 * @route   DELETE /api/collections/:id/follow
 * @access  Private
 */
export const unfollowCollection = async (req, res) => {
  try {
    const collectionId = req.params.id;

    // Vérifier si l'utilisateur suit cette collection
    const user = await User.findById(req.user._id);

    // S'assurer que la propriété followedCollections existe
    if (!user.followedCollections) {
      // Si elle n'existe pas encore, l'initialiser
      user.followedCollections = [];
      await user.save();

      return res.status(400).json({
        success: false,
        message: 'Vous ne suivez pas cette collection',
      });
    }

    if (!user.followedCollections.includes(collectionId)) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne suivez pas cette collection',
      });
    }

    // Retirer la collection des collections suivies par l'utilisateur
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { followedCollections: collectionId },
    });

    res.status(200).json({
      success: true,
      message: 'Collection retirée des suivis avec succès',
    });
  } catch (error) {
    console.error('Erreur lors du retrait du suivi:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du retrait du suivi',
      error: error.message,
    });
  }
};

/**
 * Vérifier si l'utilisateur suit une collection
 * @route   GET /api/collections/:id/following
 * @access  Private
 */
export const checkIfFollowing = async (req, res) => {
  try {
    const collectionId = req.params.id;

    // Vérifier si l'utilisateur suit cette collection
    const user = await User.findById(req.user._id);

    // S'assurer que la propriété followedCollections existe
    if (!user.followedCollections) {
      // Si elle n'existe pas encore, l'initialiser
      user.followedCollections = [];
      await user.save();

      return res.status(200).json({
        success: true,
        following: false,
      });
    }

    const isFollowing = user.followedCollections.includes(collectionId);

    res.status(200).json({
      success: true,
      following: isFollowing,
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du suivi:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification du suivi',
      error: error.message,
    });
  }
};

/**
 * Récupérer toutes les collections suivies par l'utilisateur
 * @route   GET /api/collections/followed
 * @access  Private
 */
export const getFollowedCollections = async (req, res) => {
  try {
    // Récupérer l'utilisateur avec ses collections suivies
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    // S'assurer que la propriété followedCollections existe
    if (!user.followedCollections) {
      // Si elle n'existe pas encore, l'initialiser
      user.followedCollections = [];
      await user.save();

      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    // Récupérer les collections avec population
    const collections = await Collection.find({
      _id: { $in: user.followedCollections },
    }).populate('sources', 'name url faviconUrl');

    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des collections suivies:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des collections suivies',
      error: error.message,
    });
  }
};
