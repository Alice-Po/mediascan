import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  refreshToken,
  completeOnboarding,
  verifyEmail,
} from '../controllers/authController.js';
import { protect, logAuthEvent } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes publiques
router.post('/register', logAuthEvent, register);
router.post('/login', logAuthEvent, login);
router.get('/verify-email/:token', verifyEmail);
router.post('/refresh', refreshToken);

// Routes protégées (nécessitant une authentification)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/onboarding', protect, completeOnboarding);

export default router;
