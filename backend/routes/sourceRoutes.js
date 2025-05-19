import express from 'express';
import {
  getAllSources,
  getSourcesFromUserCollections,
  deleteSource,
  validateRssUrl,
  getSourceById,
  removeSourceFromAllCollections,
  createSource,
} from '../controllers/sourceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkRssFeed } from '../services/rssFetcher.js';

const router = express.Router();

// Routes publiques
router.get('/', getAllSources);

// Routes protégées (nécessitant une authentification)
router.post('/', protect, createSource);
router.post('/validate-rss', protect, validateRssUrl);
router.post('/user/:sourceId/remove-from-collections', protect, removeSourceFromAllCollections);
router.get('/:id', protect, getSourceById);
router.get('/user-collections', protect, getSourcesFromUserCollections);

// Route pour vérifier un flux RSS
router.post('/check-rss', async (req, res) => {
  try {
    const { rssUrl } = req.body;
    if (!rssUrl) {
      return res.status(400).json({ error: 'URL du flux RSS requise' });
    }

    const feed = await checkRssFeed(rssUrl);
    res.json(feed);
  } catch (error) {
    console.error('Erreur lors de la vérification du flux RSS:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
