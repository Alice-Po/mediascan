import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  refreshToken,
} from '../controllers/authController.js';
import { protect, logAuthEvent } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes d'authentification
router.post('/register', logAuthEvent, register);
router.post('/login', logAuthEvent, login);
router.post('/refresh', refreshToken);

// Routes protégées (nécessitant une authentification)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
