import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  refreshToken,
  completeOnboarding,
  verifyEmail,
  updateDefaultCollection,
  getDefaultCollection,
  uploadAvatar,
  getUserAvatar,
} from '../controllers/authController.js';
import { protect, logAuthEvent } from '../middleware/authMiddleware.js';
import { uploadAvatar as uploadAvatarMiddleware } from '../middleware/upload.js';

const router = express.Router();

// Routes publiques
router.post('/register', logAuthEvent, register);
router.post('/login', logAuthEvent, login);
router.get('/verify-email/:token', verifyEmail);
router.post('/refresh', refreshToken);

// Route d'upload d'avatar (protégée)
router.post('/upload/avatar', protect, uploadAvatarMiddleware.single('avatar'), uploadAvatar);

// Routes protégées (nécessitant une authentification)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/onboarding', protect, completeOnboarding);
router.get('/default-collection', protect, getDefaultCollection);
router.put('/default-collection', protect, updateDefaultCollection);

// Route pour servir l'avatar d'un utilisateur
router.get('/user/:id/avatar', getUserAvatar);

export default router;
