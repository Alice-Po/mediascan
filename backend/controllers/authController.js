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
    console.log('=== Inscription ===');
    console.log('Données reçues:', { email, name });

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer l'utilisateur
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = new User({
      email,
      password,
      name,
      verificationToken,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Sauvegarder l'utilisateur
    await user.save();
    console.log('Utilisateur créé:', {
      id: user._id,
      token: verificationToken,
      expiration: user.verificationTokenExpires,
    });

    // Créer une collection par défaut "Mes sources" pour le nouvel utilisateur
    try {
      const Collection = mongoose.model('Collection');
      const defaultCollection = await Collection.create({
        name: 'Mes sources',
        description: 'Collection par défaut pour vos sources',
        userId: user._id,
        sources: [],
        colorHex: '#3B82F6', // Bleu par défaut
      });

      // Ajouter la collection à l'utilisateur
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { collections: defaultCollection._id },
      });

      console.log('Collection par défaut créée:', {
        id: defaultCollection._id,
        name: defaultCollection.name,
      });
    } catch (collectionError) {
      console.error('Erreur lors de la création de la collection par défaut:', collectionError);
      // On continue malgré l'erreur pour ne pas bloquer l'inscription
    }

    try {
      // Envoyer l'email de vérification
      await sendVerificationEmail(email, verificationToken);
      console.log('Email de vérification envoyé');

      // Enregistrer l'événement analytics
      await Analytics.create({
        userId: user._id,
        eventType: 'userRegister',
        metadata: {
          timestamp: new Date(),
        },
      });

      return res.status(201).json({
        message: 'Inscription réussie. Veuillez vérifier votre email pour activer votre compte.',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
        },
      });
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
      return res.status(201).json({
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
    console.error('Erreur inscription:', error);
    res.status(500).json({
      message: "Erreur lors de l'inscription",
      error: error.message,
    });
  }
};

// @desc    Connexion d'un utilisateur
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  console.log('Login attempt:', {
    headers: req.headers,
    origin: req.headers.origin,
    method: req.method,
  });

  try {
    console.log('=== Tentative de connexion ===');
    console.log('Email reçu:', req.body.email);

    const { email, password } = req.body;

    // Trouver l'utilisateur
    console.log("Recherche de l'utilisateur...");
    const user = await User.findOne({ email }).select('+password');
    console.log('Résultat recherche:', {
      utilisateurTrouvé: !!user,
      email: user?.email,
      isVerified: user?.isVerified,
    });

    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    console.log('Vérification du mot de passe...');
    const isMatch = await user.comparePassword(password);
    console.log('Résultat vérification mot de passe:', { isMatch });

    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier si l'email est vérifié
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Veuillez vérifier votre email avant de vous connecter',
        isVerified: false,
      });
    }

    // Générer le token
    console.log('Génération du token...');
    const token = generateToken(user._id);
    console.log('Token généré avec succès');

    // Log avant l'envoi de la réponse
    console.log('Envoi de la réponse...', {
      userId: user._id,
      email: user.email,
      isVerified: user.isVerified,
      onboardingCompleted: user.onboardingCompleted,
    });

    // Enregistrer l'événement de connexion
    await Analytics.create({
      userId: user._id,
      eventType: 'userLogin',
      metadata: {
        timestamp: new Date(),
      },
    });

    res.json({
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
    // Log détaillé de l'erreur
    console.error('Erreur dans login:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res.status(500).json({ message: 'Erreur lors de la connexion' });
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
