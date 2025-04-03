import express from 'express';
import {
  getArticles,
  getSavedArticles,
  getArticleById,
  markArticleAsRead,
  saveArticle,
  unsaveArticle,
} from '../controllers/articleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Toutes les routes d'articles nécessitent une authentification
router.use(protect);

// Routes pour les articles
router.get('/', getArticles);
router.get('/saved', getSavedArticles);
router.get('/:id', getArticleById);
router.post('/:id/read', markArticleAsRead);
router.post('/:id/save', saveArticle);
router.delete('/:id/save', unsaveArticle);

export default router;
