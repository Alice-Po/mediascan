import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import config from '../config/config.js';
import crypto from 'crypto';
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

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer l'utilisateur
    const user = new User({
      email,
      password,
      name,
      verificationToken: crypto.randomBytes(32).toString('hex'),
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Sauvegarder l'utilisateur d'abord
    await user.save();
    console.log('Utilisateur créé:', user._id);

    try {
      // Puis envoyer l'email de vérification
      await sendVerificationEmail(email, user.verificationToken);

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
      // Si l'envoi d'email échoue, on garde l'utilisateur mais on log l'erreur
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
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: 'Veuillez vérifier votre email avant de vous connecter',
      });
    }

    // Enregistrer l'événement analytics de connexion
    await Analytics.create({
      userId: user._id,
      eventType: 'userLogin',
      metadata: {
        timestamp: new Date(),
      },
    });

    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        interests: user.interests,
      },
    });
  } catch (error) {
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
    const userId = req.user._id;
    const { categories, sources } = req.body;

    if (!categories || !Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: 'Les catégories sont requises et doivent être un tableau',
      });
    }

    // Mise à jour de l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          interests: categories,
          activeSources: sources,
          onboardingCompleted: true,
        },
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Onboarding complété avec succès',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la complétion de l'onboarding",
      error: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        message: 'Token de vérification manquant',
      });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Le lien de vérification est invalide ou a expiré',
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    await Analytics.create({
      userId: user._id,
      eventType: 'emailVerification',
      metadata: {
        timestamp: new Date(),
      },
    });

    res.json({ message: 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.' });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la vérification de l'email" });
  }
};
