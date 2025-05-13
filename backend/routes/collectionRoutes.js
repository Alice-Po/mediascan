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
  followCollection,
  unfollowCollection,
  checkIfFollowing,
  getFollowedCollections,
} from '../controllers/collectionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(protect);

// Route pour les collections publiques
router.get('/public', getPublicCollections);

// Route pour les collections suivies
router.get('/followed', getFollowedCollections);

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

// Routes pour suivre/ne plus suivre une collection
router.post('/:id/follow', followCollection); // POST /api/collections/:id/follow
router.delete('/:id/follow', unfollowCollection); // DELETE /api/collections/:id/follow
router.get('/:id/following', checkIfFollowing); // GET /api/collections/:id/following

export default router;
