import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import User from '../models/User.js';

/**
 * Middleware pour protéger les routes nécessitant une authentification
 */
export const protect = async (req, res, next) => {
  console.log('\n=== Protection de route ===');
  console.log('URL:', req.originalUrl);
  console.log('Méthode:', req.method);
  console.log('Headers:', req.headers);

  let token;

  // Vérification de la présence du token dans les headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Récupération du token
    token = req.headers.authorization.split(' ')[1];
    console.log('Token trouvé dans les headers');
  } else {
    console.log('Aucun token trouvé dans les headers');
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
    console.log('Vérification du token...');
    const decoded = jwt.verify(token, config.jwt.secret);
    console.log('Token décodé:', { userId: decoded.id });

    // Recherche de l'utilisateur
    console.log("Recherche de l'utilisateur...");
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      console.log('Utilisateur non trouvé');
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    console.log('Utilisateur trouvé:', {
      id: user._id,
      email: user.email,
      isVerified: user.isVerified,
    });

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
  console.log("\n=== Événement d'authentification ===");
  console.log('Timestamp:', new Date().toISOString());
  console.log('URL:', req.originalUrl);
  console.log('Méthode:', req.method);
  console.log('Headers:', {
    origin: req.headers.origin,
    'content-type': req.headers['content-type'],
    'user-agent': req.headers['user-agent'],
  });
  console.log('Body:', {
    email: req.body.email,
    name: req.body.name,
    // Ne pas logger le mot de passe
    hasPassword: !!req.body.password,
  });
  console.log('===============================\n');
  next();
};
