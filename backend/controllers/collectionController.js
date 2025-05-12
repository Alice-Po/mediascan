import Collection from '../models/Collection.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

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

    // Créer la collection
    const collection = await Collection.create({
      name,
      description: description || '',
      imageUrl: imageUrl || '/default-collection.png',
      sources: sources || [],
      userId: req.user._id,
      isPublic: isPublic || false,
    });

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
    if (imageUrl) updateData.imageUrl = imageUrl;
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
