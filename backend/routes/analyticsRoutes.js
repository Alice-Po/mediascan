import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getDiversityScore,
  resetHistory,
  trackEvent,
  getUserAnalytics,
} from '../controllers/analyticsController.js';

const router = express.Router();

// Toutes les routes analytics nécessitent une authentification
router.use(protect);

// Routes pour les analytics
router.get('/diversity', getDiversityScore);
router.delete('/history', resetHistory);
router.post('/track', trackEvent);
router.get('/user', getUserAnalytics);

export default router;
