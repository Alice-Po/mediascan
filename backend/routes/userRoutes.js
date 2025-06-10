import express from 'express';
import { getUserProfile } from '../controllers/userController.js';

const router = express.Router();

/**
 * Route pour récupérer le profil complet d'un utilisateur
 * @route GET /api/users/:userId/profile
 * @access Public - Tout le monde peut voir le profil d'un utilisateur
 */
router.get('/:userId/profile', getUserProfile);

export default router;
