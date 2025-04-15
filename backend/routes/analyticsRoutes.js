import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getStatisticsData,
  resetAnalytics,
  trackEvent,
  getUserAnalytics,
} from '../controllers/analyticsController.js';

const router = express.Router();

// Toutes les routes analytics nécessitent une authentification
router.use(protect);

// Routes pour les analytics
router.get('/statistics', getStatisticsData);
router.delete('/history', resetAnalytics);
router.post('/track', trackEvent);
router.get('/user', getUserAnalytics);

export default router;
