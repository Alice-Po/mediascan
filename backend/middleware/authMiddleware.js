import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import User from '../models/User.js';

/**
 * Middleware pour protéger les routes nécessitant une authentification
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé. Veuillez vous connecter.',
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur authentification:', error.message);

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
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};
