import express from 'express';
import { getDiversityScore, resetHistory } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Toutes les routes analytics nécessitent une authentification
router.use(protect);

// Routes pour les analytics
router.get('/diversity', getDiversityScore);
router.delete('/history', resetHistory);

export default router;
