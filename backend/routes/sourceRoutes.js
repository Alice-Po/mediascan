import express from 'express';
import {
  getAllSources,
  getUserSources,
  addUserSource,
  enableUserSource,
  disableUserSource,
  deleteUserSource,
  validateRssUrl,
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
router.post('/user/:sourceId/enable', protect, enableUserSource);
router.post('/user/:sourceId/disable', protect, disableUserSource);

export default router;
