import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { AuthContext } from '../../context/AuthContext';
import {
  followCollection,
  unfollowCollection,
  checkIfFollowing,
  fetchCollectionById,
} from '../../api/collectionsApi';
import CollectionDetailComponent from './CollectionDetailComponent';

/**
 * Composant modal pour afficher le détail d'une collection (publique ou privée)
 * - Adapte l'interface selon que la collection appartient ou non à l'utilisateur
 * - Adapte l'interface selon que la collection est publique ou privée
 */
const CollectionDetailsModal = ({
  collectionId,
  isOpen,
  onClose,
  onFollow,
  followStatus,
  isFollowLoading,
  // Propriétés optionnelles pour fonctionnement autonome (hors AppContext)
  externalCollection,
  onDeleteSuccess,
  onEditSuccess,
  onSourceRemove, // Fonction de callback quand une source est supprimée
  standalone = false, // Mode autonome (hors page dédiée)
  isOnboarding = false, // Nouvelle prop pour indiquer le contexte d'onboarding
}) => {
  // Context et navigation
  const { user } = useContext(AuthContext);
  const {
    loadCollectionById: contextLoadCollectionById,
    deleteCollection: contextDeleteCollection,
    removeSourceFromCollection: contextRemoveSourceFromCollection,
    filterByCollection,
    currentCollection: contextCurrentCollection,
    loadingCollections: contextLoadingCollections,
  } = useContext(AppContext);

  const navigate = useNavigate();

  // États pour les données et l'UI
  const [collection, setCollection] = useState(externalCollection || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(followStatus || false);
  const [followLoading, setFollowLoading] = useState(isFollowLoading || false);

  // Détermine si l'utilisateur est le propriétaire de la collection
  const isOwner = user && collection?.userId === user._id;

  // Fonction pour charger une collection - utilise le contexte ou l'API directement
  const loadCollectionById = async (id) => {
    if (contextLoadCollectionById && !standalone) {
      return await contextLoadCollectionById(id);
    } else {
      return await fetchCollectionById(id);
    }
  };

  // Fonction pour supprimer une collection - utilise le contexte ou l'API directement
  const deleteCollection = async (id) => {
    if (contextDeleteCollection && !standalone) {
      return await contextDeleteCollection(id);
    } else {
      // Implémentation à ajouter pour le cas standalone
      throw new Error('Suppression standalone non implémentée');
    }
  };

  // Fonction pour retirer une source - utilise le contexte ou l'API directement
  const removeSourceFromCollection = async (collectionId, sourceId) => {
    if (contextRemoveSourceFromCollection && !standalone) {
      return await contextRemoveSourceFromCollection(collectionId, sourceId);
    } else {
      // Implémentation à ajouter pour le cas standalone
      throw new Error('Retrait de source standalone non implémenté');
    }
  };

  // Charger les détails de la collection
  useEffect(() => {
    const fetchCollectionDetails = async () => {
      if (!collectionId || !isOpen) return;

      // Si une collection externe est fournie, l'utiliser directement
      if (externalCollection) {
        setCollection(externalCollection);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Utiliser currentCollection du contexte si disponible et correspond à l'ID demandé
        if (
          contextCurrentCollection &&
          contextCurrentCollection._id === collectionId &&
          !standalone
        ) {
          setCollection(contextCurrentCollection);
        } else {
          const data = await loadCollectionById(collectionId);
          setCollection(data);
        }

        // Vérifier si l'utilisateur suit déjà cette collection si status non fourni
        if (followStatus === undefined && collection?.isPublic && !isOwner) {
          try {
            const isFollowingStatus = await checkIfFollowing(collectionId);
            setIsFollowing(isFollowingStatus);
          } catch (err) {
            console.error('Erreur lors de la vérification du statut de suivi:', err);
          }
        }
      } catch (err) {
        setError('Impossible de charger les détails de la collection');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionDetails();
  }, [collectionId, isOpen, followStatus, externalCollection, contextCurrentCollection]);

  // Gérer le suivi d'une collection
  const handleFollowToggle = async () => {
    if (!collection || !collection.isPublic || isOwner) return;

    try {
      setFollowLoading(true);

      if (isFollowing) {
        // Si déjà suivi, désabonner
        await unfollowCollection(collection._id);
        setIsFollowing(false);
      } else {
        // Sinon, suivre
        await followCollection(collection._id);
        setIsFollowing(true);
      }

      // Informer le composant parent du changement
      if (onFollow) {
        onFollow(collection._id, !isFollowing);
      }
    } catch (err) {
      console.error('Erreur lors du changement de statut de suivi:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  // Gérer la suppression de la collection
  const handleDelete = async () => {
    if (!isOwner) return;

    try {
      setLoading(true);
      await deleteCollection(collectionId);

      if (onDeleteSuccess) {
        onDeleteSuccess();
      } else if (!standalone) {
        navigate('/');
      }

      onClose();
    } catch (err) {
      setError('Erreur lors de la suppression de la collection');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Gérer le retrait d'une source de la collection
  const handleRemoveSource = async (sourceId) => {
    if (!isOwner) return;

    try {
      await removeSourceFromCollection(collectionId, sourceId);

      // Mettre à jour la collection localement
      setCollection((prev) => ({
        ...prev,
        sources: prev.sources.filter((s) => s._id !== sourceId),
      }));

      // Informer le composant parent de la suppression
      if (onSourceRemove) {
        onSourceRemove(collectionId, sourceId);
      }
    } catch (err) {
      setError('Erreur lors du retrait de la source');
      console.error(err);
    }
  };

  // Gérer le clic sur "Voir les articles"
  const handleBrowseArticles = () => {
    if (filterByCollection && !standalone) {
      filterByCollection(collectionId);
      navigate('/');
    } else {
      // Alternative pour le mode standalone
      window.location.href = `/?collection=${collectionId}`;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm bg-white/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Détails de la collection</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4">
          {(loading || contextLoadingCollections) && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md">
              <p>{error}</p>
            </div>
          )}

          {!loading && !contextLoadingCollections && !error && collection && (
            <>
              <CollectionDetailComponent
                collection={collection}
                isOwner={isOwner}
                isFollowing={isFollowing}
                followLoading={followLoading}
                onFollowToggle={handleFollowToggle}
                onRemoveSource={handleRemoveSource}
                onDelete={handleDelete}
                onBrowseArticles={handleBrowseArticles}
                withSourcesList={true}
                isOnboarding={isOnboarding}
              />

              <div className="mt-6 flex justify-end space-x-2 pt-4 border-t">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Fermer
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionDetailsModal;
