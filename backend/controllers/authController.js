import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import config from '../config/env.js';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { sendVerificationEmail } from '../services/emailService.js';
import path from 'path';
import sharp from 'sharp';
import { compressAndResizeImage } from '../utils/imageUtils.js';

// Génération du token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// @desc    Inscription d'un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  console.log('\n=== Inscription ===');
  console.log('Données reçues:', {
    email: req.body.email,
    name: req.body.name,
    hasPassword: !!req.body.password,
  });

  try {
    const { email, password, name } = req.body;

    // Vérifier si l'utilisateur existe déjà
    console.log("Vérification de l'existence de l'utilisateur...");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email déjà utilisé:', email);
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé',
      });
    }

    // Créer l'utilisateur sans sauvegarder immédiatement
    console.log('Création du nouvel utilisateur...');
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = new User({
      email,
      password,
      name,
      verificationToken,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Créer une collection par défaut "Mes sources" pour le nouvel utilisateur
    console.log('Création de la collection par défaut...');
    let defaultCollection;
    try {
      const Collection = mongoose.model('Collection');
      defaultCollection = await Collection.create({
        name: 'Mes sources',
        description: 'Collection par défaut pour vos sources',
        userId: user._id,
        sources: [],
        colorHex: '#3B82F6', // Bleu par défaut
      });

      console.log('Collection par défaut créée:', {
        id: defaultCollection._id,
        name: defaultCollection.name,
      });
    } catch (collectionError) {
      console.error('Erreur lors de la création de la collection par défaut:', {
        message: collectionError.message,
        stack: collectionError.stack,
      });
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la création de la collection par défaut. L'inscription a échoué.",
        error: collectionError.message,
      });
    }

    // Associer la collection par défaut à l'utilisateur
    user.defaultCollection = defaultCollection._id;
    user.collections = [defaultCollection._id];

    // Sauvegarder l'utilisateur avec sa collection par défaut
    console.log("Sauvegarde de l'utilisateur...");
    await user.save();
    console.log('Utilisateur créé avec succès:', {
      id: user._id,
      email: user.email,
      isVerified: user.isVerified,
      defaultCollection: user.defaultCollection,
    });

    try {
      // Envoyer l'email de vérification
      console.log("Envoi de l'email de vérification...");
      await sendVerificationEmail(email, verificationToken);
      console.log('Email de vérification envoyé avec succès');

      // Enregistrer l'événement analytics
      await Analytics.create({
        userId: user._id,
        eventType: 'userRegister',
        metadata: {
          timestamp: new Date(),
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Inscription réussie. Veuillez vérifier votre email pour activer votre compte.',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
        },
      });
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", {
        message: emailError.message,
        stack: emailError.stack,
      });
      return res.status(201).json({
        success: true,
        message:
          "Inscription réussie mais erreur lors de l'envoi de l'email de vérification. Un nouvel email sera envoyé ultérieurement.",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
        },
      });
    }
  } catch (error) {
    console.error("Erreur lors de l'inscription:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription",
      error: error.message,
    });
  }
};

// @desc    Connexion d'un utilisateur
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  console.log('\n=== Tentative de connexion ===');
  console.log('Données reçues:', {
    email: req.body.email,
    hasPassword: !!req.body.password,
  });

  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    console.log("Recherche de l'utilisateur...");
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('Utilisateur non trouvé:', email);
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
    }

    console.log('Utilisateur trouvé:', {
      id: user._id,
      email: user.email,
      isVerified: user.isVerified,
    });

    // Vérifier le mot de passe
    console.log('Vérification du mot de passe...');
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log('Mot de passe incorrect pour:', email);
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
    }

    // Vérifier si l'email est vérifié
    if (!user.isVerified) {
      console.log('Email non vérifié pour:', email);
      return res.status(403).json({
        success: false,
        message: 'Veuillez vérifier votre email avant de vous connecter',
        isVerified: false,
      });
    }

    // Générer le token
    console.log('Génération du token...');
    const token = generateToken(user._id);
    console.log('Token généré avec succès');

    // Enregistrer l'événement de connexion
    await Analytics.create({
      userId: user._id,
      eventType: 'userLogin',
      metadata: {
        timestamp: new Date(),
      },
    });

    console.log('Connexion réussie pour:', email);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        onboardingCompleted: user.onboardingCompleted || false,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message,
    });
  }
};

// @desc    Récupération du profil de l'utilisateur
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    // console.error('Erreur lors de la récupération du profil:', error);
    // res.status(500).json({
    //   success: false,
    //   message: 'Erreur lors de la récupération du profil',
    //   error: error.message,
    // });
  }
};

// @desc    Mise à jour du profil de l'utilisateur
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, socialLinks } = req.body;
    const userId = req.user.id;

    // Validation des données
    if (!name) {
      return res.status(400).json({ message: 'Le nom est requis' });
    }

    // Validation des liens sociaux
    if (socialLinks && !Array.isArray(socialLinks)) {
      return res.status(400).json({ message: 'Les liens sociaux doivent être un tableau' });
    }

    if (socialLinks) {
      for (const link of socialLinks) {
        if (!link.url || !link.url.startsWith('http')) {
          return res.status(400).json({
            message: 'Chaque lien social doit être une URL valide commençant par http',
          });
        }
      }
    }

    // Mise à jour du profil (on ignore le champ avatar)
    const updateFields = {
      name,
      bio,
      socialLinks: socialLinks || [],
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message,
    });
  }
};

// @desc    Mise à jour de la collection par défaut de l'utilisateur
// @route   PUT /api/auth/default-collection
// @access  Private
export const updateDefaultCollection = async (req, res) => {
  try {
    const { collectionId } = req.body;

    if (!collectionId) {
      return res.status(400).json({
        success: false,
        message: 'ID de collection non fourni',
      });
    }

    // Vérifier que l'ID est un ObjectId MongoDB valide
    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de collection invalide',
      });
    }

    // Vérifier que la collection existe
    const Collection = mongoose.model('Collection');
    const collection = await Collection.findById(collectionId);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection non trouvée',
      });
    }

    // Vérifier que l'utilisateur a accès à cette collection
    // (soit il en est le propriétaire, soit il la suit)
    const isOwner = collection.userId.toString() === req.user._id.toString();
    const isFollowing = req.user.followedCollections.includes(collectionId);

    if (!isOwner && !isFollowing) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas le droit d'utiliser cette collection comme collection par défaut",
      });
    }

    // Mettre à jour la collection par défaut
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { defaultCollection: collectionId },
      { new: true }
    ).select('-password');

    // Si l'utilisateur est propriétaire, s'assurer que la collection est dans ses collections
    if (isOwner && !updatedUser.collections.includes(collectionId)) {
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { collections: collectionId } });
    }

    // Si l'utilisateur suit la collection, s'assurer qu'elle est dans ses collections suivies
    if (!isOwner && !updatedUser.followedCollections.includes(collectionId)) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { followedCollections: collectionId },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Collection par défaut mise à jour avec succès',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la collection par défaut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la collection par défaut',
      error: error.message,
    });
  }
};

// @desc    Récupération de la collection par défaut de l'utilisateur
// @route   GET /api/auth/default-collection
// @access  Private
export const getDefaultCollection = async (req, res) => {
  try {
    // Utiliser la méthode du modèle User pour récupérer la collection par défaut
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    const defaultCollection = await user.getDefaultCollection();

    res.status(200).json({
      success: true,
      defaultCollection,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la collection par défaut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la collection par défaut',
      error: error.message,
    });
  }
};

// @desc    Rafraîchissement du token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token non fourni',
      });
    }

    // Vérification du token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Génération d'un nouveau token
    const newToken = generateToken(decoded.id);

    res.status(200).json({
      success: true,
      token: newToken,
    });
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré',
    });
  }
};

// @desc    Complétion de l'onboarding
// @route   POST /api/auth/onboarding
// @access  Private
export const completeOnboarding = async (req, res) => {
  try {
    const { sources } = req.body;

    // Mise à jour de l'utilisateur pour marquer l'onboarding comme complété
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        onboardingCompleted: true,
      },
      { new: true }
    ).select('-password');

    res.json({ user });
  } catch (error) {
    console.error('Erreur onboarding:', error);
    res.status(500).json({ message: "Erreur lors de la finalisation de l'onboarding" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log('=== Vérification Email ===');
    console.log('Token reçu:', token);

    // Rechercher l'utilisateur
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    console.log('Recherche utilisateur:', {
      utilisateurTrouvé: !!user,
      email: user?.email,
      tokenStocké: user?.verificationToken,
      dateExpiration: user?.verificationTokenExpires,
      maintenant: new Date(),
    });

    if (!user) {
      console.log('Utilisateur non trouvé ou token expiré');
      return res.status(400).json({
        message: 'Le lien de vérification est invalide ou a expiré',
      });
    }

    // Si l'utilisateur n'est pas encore vérifié, le marquer comme vérifié
    if (!user.isVerified) {
      user.isVerified = true;

      // Au lieu de supprimer le token, prolonger sa validité de 30 minutes
      user.verificationTokenExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      await user.save();

      console.log('Utilisateur vérifié avec succès:', {
        id: user._id,
        email: user.email,
        tokenValidePour: '30 minutes supplémentaires',
      });

      // Enregistrer l'événement analytics
      await Analytics.create({
        userId: user._id,
        eventType: 'emailVerification',
        metadata: {
          timestamp: new Date(),
        },
      });
    } else {
      console.log('Utilisateur déjà vérifié:', {
        id: user._id,
        email: user.email,
      });
    }

    res.json({ message: 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.' });
  } catch (error) {
    console.error('Erreur lors de la vérification:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: "Erreur lors de la vérification de l'email" });
  }
};

// Contrôleur pour l'upload d'avatar (compression et stockage en base)
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      console.log('[Avatar] Aucun fichier envoyé');
      return res.status(400).json({ message: 'Aucun fichier envoyé' });
    }
    // Utiliser l'utilitaire pour compresser et redimensionner
    let outputBuffer;
    try {
      outputBuffer = await compressAndResizeImage(req.file.buffer);
    } catch (err) {
      console.log('[Avatar] Erreur de compression:', err.message);
      return res.status(400).json({ message: err.message });
    }
    console.log('[Avatar] Buffer uploadé, taille:', outputBuffer.length);
    // Stocker dans le document utilisateur
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        avatar: outputBuffer,
        avatarType: 'image/jpeg',
      },
      { new: true }
    );
    if (!user) {
      console.log("[Avatar] Utilisateur non trouvé lors de l'upload");
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur upload avatar:', error);
    res.status(500).json({ message: "Erreur lors de l'upload de l'avatar" });
  }
};

// Endpoint pour servir l'avatar d'un utilisateur
export const getUserAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('avatar avatarType');
    if (!user) {
      console.log('[Avatar] Utilisateur non trouvé lors de la récupération');
      return res.status(404).send('Avatar non trouvé');
    }
    if (!user.avatar || !user.avatar.length) {
      console.log('[Avatar] Pas de buffer à servir pour user', req.params.id);
      return res.status(404).send('Avatar non trouvé');
    }
    console.log('[Avatar] Buffer servi, taille:', user.avatar.length);
    res.set('Content-Type', user.avatarType || 'image/jpeg');
    res.send(user.avatar);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'avatar:", error);
    res.status(500).send("Erreur lors de la récupération de l'avatar");
  }
};
