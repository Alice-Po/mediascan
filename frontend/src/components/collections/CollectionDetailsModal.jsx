import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { AuthContext } from '../../context/AuthContext';
import {
  followCollection,
  unfollowCollection,
  checkIfFollowing,
  fetchCollectionById,
} from '../../api/collectionsApi';
import { generateFollowersFromId } from '../../utils/colorUtils';
import SimpleSourceItem from '../sources/SourceItem';
import SourceDetailsModal from '../sources/SourceDetailsModal';
import ConfirmationModal from '../common/ConfirmationModal';

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
  standalone = false, // Mode autonome (hors page dédiée)
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
  const [selectedSource, setSelectedSource] = useState(null);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

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
      // Gérer l'erreur
    } finally {
      setFollowLoading(false);
    }
  };

  // Gérer le clic sur une source pour voir ses détails
  const handleSourceClick = (source) => {
    setSelectedSource(source);
    setShowSourceModal(true);
  };

  // Fermer la modale de détails de la source
  const handleCloseSourceModal = () => {
    setShowSourceModal(false);
    setSelectedSource(null);
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
      setShowDeleteModal(false);
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
              {/* En-tête de la collection - Version mobile d'abord */}
              <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden mr-4"
                    style={{
                      backgroundImage: collection.imageUrl ? `url(${collection.imageUrl})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: !collection.imageUrl
                        ? collection.colorHex || '#6366F1'
                        : undefined,
                    }}
                  >
                    {!collection.imageUrl && (
                      <span className="text-white text-xl font-bold">
                        {collection.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-bold">{collection.name}</h1>
                    <div className="flex flex-wrap items-center mt-1">
                      <span className="text-sm text-gray-500">
                        Par{' '}
                        {isOwner ? 'vous' : collection.createdBy?.username || 'Utilisateur anonyme'}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="text-sm text-gray-500">
                        {collection.sources?.length || 0} sources
                      </span>
                      {collection.isPublic && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-sm text-gray-500">
                            {generateFollowersFromId(collection._id)} suiveurs
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                  {/* Bouton Voir les articles */}
                  <button
                    onClick={handleBrowseArticles}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
                  >
                    Voir les articles
                  </button>

                  {/* Bouton Suivre/Suivi (si collection publique et non propriétaire) */}
                  {collection.isPublic && !isOwner && (
                    <button
                      className={`flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        isFollowing
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                      }`}
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                    >
                      {followLoading ? (
                        <span className="h-4 w-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin mr-1"></span>
                      ) : (
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          {isFollowing ? (
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          ) : (
                            <path
                              fillRule="evenodd"
                              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          )}
                        </svg>
                      )}
                      {isFollowing ? 'Suivi' : 'Suivre'}
                    </button>
                  )}

                  {/* Bouton Partager (si collection publique) */}
                  {collection.isPublic && (
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="px-3 py-1.5 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 flex items-center text-sm font-medium"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                      Partager
                    </button>
                  )}

                  {/* Boutons d'édition et de suppression (si propriétaire) */}
                  {isOwner && (
                    <>
                      <Link
                        to={`/collections/edit/${collection._id}`}
                        className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
                        onClick={onClose}
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-3 py-1.5 border border-red-300 text-red-700 rounded-md hover:bg-red-50 text-sm font-medium"
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Badges de statut */}
              <div className="flex flex-wrap gap-2 mb-4">
                {collection.isPublic ? (
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Public
                  </span>
                ) : (
                  <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    Privé
                  </span>
                )}
                {isFollowing && !isOwner && (
                  <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                    Suivie
                  </span>
                )}
              </div>

              {/* Description */}
              {collection.description && (
                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                  <h2 className="text-sm font-semibold text-gray-500 mb-2">Description</h2>
                  <p className="text-gray-700">{collection.description}</p>
                </div>
              )}

              {/* Liste des sources */}
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Sources ({collection.sources?.length || 0})
                </h2>

                {!collection.sources || collection.sources.length === 0 ? (
                  <div className="text-center p-6 bg-gray-50 rounded-md">
                    <p className="text-gray-500">Cette collection ne contient aucune source</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-1">
                    {collection.sources.map((source) => (
                      <div
                        key={source._id}
                        className="p-3 border border-gray-200 rounded-md flex items-center"
                        onClick={() => handleSourceClick(source)}
                      >
                        <div
                          className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden mr-3 flex-shrink-0"
                          style={{
                            backgroundImage: source.faviconUrl
                              ? `url(${source.faviconUrl})`
                              : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        >
                          {!source.faviconUrl && (
                            <span className="text-gray-500 text-xs">
                              {source.name.substring(0, 1).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{source.name}</h3>
                          <p className="text-xs text-gray-500 truncate">{source.url}</p>
                        </div>

                        {/* Bouton de suppression (visible uniquement pour le propriétaire) */}
                        {isOwner && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSource(source._id);
                            }}
                            className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                            title="Retirer de la collection"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions du bas */}
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

      {/* Modal de détails de la source */}
      {selectedSource && (
        <SourceDetailsModal
          isOpen={showSourceModal}
          onClose={handleCloseSourceModal}
          source={selectedSource}
        />
      )}

      {/* Modale de partage */}
      <ConfirmationModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onConfirm={() => setShowShareModal(false)}
        title="Partager la collection"
        message="Le système de partage de collections sera bientôt disponible ! Vous pourrez partager"
        itemName={collection?.name}
        confirmButtonText="D'accord"
        cancelButtonText="Fermer"
        confirmButtonClass="bg-blue-600 text-white hover:bg-blue-700"
      />

      {/* Modale de confirmation de suppression */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer la collection"
        itemName={collection?.name}
        confirmButtonText="Supprimer"
        cancelButtonText="Annuler"
      />
    </div>
  );
};

export default CollectionDetailsModal;
