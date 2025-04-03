import express from 'express';
import {
  getAllSources,
  getUserSources,
  addUserSource,
  toggleUserSource,
  deleteUserSource,
} from '../controllers/sourceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes publiques
router.get('/', getAllSources);

// Routes protégées (nécessitant une authentification)
router.get('/user', protect, getUserSources);
router.post('/user', protect, addUserSource);
router.put('/user/:id', protect, toggleUserSource);
router.delete('/user/:id', protect, deleteUserSource);

export default router;
