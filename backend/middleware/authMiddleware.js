import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import User from '../models/User.js';

/**
 * Middleware pour protéger les routes nécessitant une authentification
 */
export const protect = async (req, res, next) => {
  let token;

  // Vérification de la présence du token dans les headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Récupération du token
    token = req.headers.authorization.split(' ')[1];
  }

  // Si aucun token n'est trouvé
  if (!token) {
    console.log('Accès refusé: Token manquant');
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé. Veuillez vous connecter.',
    });
  }

  try {
    // Vérification du token
    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    // Ajout des informations de l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expirée. Veuillez vous reconnecter.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token invalide',
    });
  }
};

/**
 * Middleware pour logger les événements d'authentification
 */
export const logAuthEvent = (req, res, next) => {
  next();
};
