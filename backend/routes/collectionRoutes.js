import express from 'express';
import {
  getUserCollections,
  createCollection,
  getCollectionById,
  updateCollection,
  deleteCollection,
  addSourceToCollection,
  removeSourceFromCollection,
  getPublicCollections,
} from '../controllers/collectionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(protect);

// Route pour les collections publiques
router.get('/public', getPublicCollections);

// Routes pour les collections
router
  .route('/')
  .get(getUserCollections) // GET /api/collections
  .post(createCollection); // POST /api/collections

router
  .route('/:id')
  .get(getCollectionById) // GET /api/collections/:id
  .put(updateCollection) // PUT /api/collections/:id
  .delete(deleteCollection); // DELETE /api/collections/:id

// Routes pour les sources dans les collections
router.post('/:id/sources', addSourceToCollection); // POST /api/collections/:id/sources
router.delete('/:id/sources/:sourceId', removeSourceFromCollection); // DELETE /api/collections/:id/sources/:sourceId

export default router;
