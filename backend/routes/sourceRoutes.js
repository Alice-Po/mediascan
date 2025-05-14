import express from 'express';
import {
  getAllSources,
  getUserSources,
  addUserSource,
  deleteUserSource,
  validateRssUrl,
  getSourceById,
  removeSourceFromAllCollections,
} from '../controllers/sourceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes publiques
router.get('/', getAllSources);

// Routes protégées (nécessitant une authentification)
router.get('/user', protect, getUserSources);
router.post('/user', protect, addUserSource);
router.delete('/user/:id', protect, deleteUserSource);
router.post('/validate-rss', protect, validateRssUrl);
router.post('/user/:sourceId/remove-from-collections', protect, removeSourceFromAllCollections);
router.get('/:id', protect, getSourceById);

export default router;
