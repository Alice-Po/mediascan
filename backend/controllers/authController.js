import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import config from '../config/env.js';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { sendVerificationEmail } from '../services/emailService.js';

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
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé',
      });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = new User({
      email,
      password,
      name,
      verificationToken,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    let defaultCollection;
    try {
      const Collection = mongoose.model('Collection');
      defaultCollection = await Collection.create({
        name: 'Mes sources',
        description: 'Collection par défaut pour vos sources',
        userId: user._id,
        sources: [],
        colorHex: '#3B82F6',
      });
    } catch (collectionError) {
      console.error('Erreur création collection par défaut:', collectionError.message);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la création de la collection par défaut. L'inscription a échoué.",
        error: collectionError.message,
      });
    }

    user.defaultCollection = defaultCollection._id;
    user.collections = [defaultCollection._id];

    await user.save();

    try {
      await sendVerificationEmail(email, verificationToken);
      await Analytics.create({
        userId: user._id,
        eventType: 'userRegister',
        metadata: { timestamp: new Date() },
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
      console.error('Erreur envoi email:', emailError.message);
      return res.status(201).json({
        success: true,
        message: "Inscription réussie mais erreur lors de l'envoi de l'email de vérification.",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
        },
      });
    }
  } catch (error) {
    console.error('Erreur inscription:', error.message);
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
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Veuillez vérifier votre email avant de vous connecter',
        isVerified: false,
      });
    }

    const token = generateToken(user._id);
    await Analytics.create({
      userId: user._id,
      eventType: 'userLogin',
      metadata: { timestamp: new Date() },
    });

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
    console.error('Erreur connexion:', error.message);
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
    const { name, interests } = req.body;

    // Mise à jour des informations de l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || req.user.name,
        interests: interests || req.user.interests,
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
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
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Le lien de vérification est invalide ou a expiré',
      });
    }

    if (!user.isVerified) {
      user.isVerified = true;
      user.verificationTokenExpires = new Date(Date.now() + 30 * 60 * 1000);
      await user.save();

      await Analytics.create({
        userId: user._id,
        eventType: 'emailVerification',
        metadata: { timestamp: new Date() },
      });
    }

    res.json({ message: 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.' });
  } catch (error) {
    console.error('Erreur vérification email:', error.message);
    res.status(500).json({ message: "Erreur lors de la vérification de l'email" });
  }
};
