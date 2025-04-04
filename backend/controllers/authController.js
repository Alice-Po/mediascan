import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import config from '../config/config.js';

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
    const { email, password, name, interests } = req.body;

    // Vérification si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé',
      });
    }

    // Création de l'utilisateur
    const user = await User.create({
      email,
      password,
      name,
      interests: interests || [],
    });

    // Enregistrement de l'événement analytique
    await Analytics.create({
      userId: user._id,
      eventType: 'userRegister',
      metadata: {
        userAgent: req.headers['user-agent'],
        platform: req.headers['sec-ch-ua-platform'] || 'unknown',
      },
    });

    // Génération du token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        interests: user.interests,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
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

    // Vérification que l'email et le mot de passe sont fournis
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un email et un mot de passe',
      });
    }

    // Recherche de l'utilisateur
    const user = await User.findOne({ email });

    // Vérification que l'utilisateur existe et que le mot de passe est correct
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides',
      });
    }

    // Mise à jour de la date de dernière connexion
    user.lastLogin = new Date();
    await user.save();

    // Enregistrer l'événement de connexion
    const analytics = new Analytics({
      userId: user._id,
      eventType: 'userLogin',
      metadata: {
        timestamp: new Date(),
        userAgent: req.headers['user-agent'],
        platform: req.headers['sec-ch-ua-platform'],
        success: true,
      },
    });

    await analytics.save();

    // Génération du token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        interests: user.interests,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
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
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message,
    });
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
    console.error('Erreur lors de la mise à jour du profil:', error);
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

    console.log('Données onboarding reçues:', {
      userId,
      categories,
      sources,
    });

    // Validation des données
    if (!categories || !Array.isArray(categories)) {
      console.log('Validation échouée - catégories:', categories);
      return res.status(400).json({
        success: false,
        message: 'Les catégories sont requises et doivent être un tableau',
      });
    }

    // Mise à jour de l'utilisateur avec les bons champs
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

    console.log('Utilisateur mis à jour:', updatedUser);

    res.status(200).json({
      success: true,
      message: 'Onboarding complété avec succès',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Erreur onboarding backend:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la complétion de l'onboarding",
      error: error.message,
    });
  }
};
