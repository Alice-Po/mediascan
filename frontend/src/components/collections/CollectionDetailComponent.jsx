import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useSnackbar, SNACKBAR_TYPES } from '../../context/SnackbarContext';
import { generateFollowersFromId } from '../../utils/colorUtils';
import ConfirmationModal from '../common/ConfirmationModal';
import SourceDetailsModal from '../sources/SourceDetailsModal';
import { CollectionShareIcon, CheckIcon, AddSourceIcon, XIcon } from '../common/icons';
import SourceCatalog from '../sources/SourceCatalog';
import CollectionAvatar from './CollectionAvatar';

/**
 * Composant réutilisable pour afficher les détails d'une collection
 * Peut être utilisé à la fois dans une modal et dans une page complète
 */
const CollectionDetailComponent = ({
  collection,
  isOwner,
  isFollowing = false,
  followLoading = false,
  onFollowToggle,
  onRemoveSource,
  onAddSource,
  onDelete,
  onEdit,
  onBrowseArticles,
  withSourcesList = true,
  layoutType = 'full', // 'full' ou 'compact'
  isOnboarding = false, // Nouvelle prop pour indiquer le contexte d'onboarding
}) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  // États pour la gestion des modales
  const [selectedSource, setSelectedSource] = useState(null);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSourceCatalog, setShowSourceCatalog] = useState(false);

  const isUserOwner = collection.createdBy && user._id && collection.createdBy._id === user._id;

  // Gestion des actions
  const handleSourceClick = (source) => {
    setSelectedSource(source);
    setShowSourceModal(true);
  };

  const handleRemoveSource = (sourceId) => {
    if (onRemoveSource) {
      onRemoveSource(sourceId);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const handleCloseSourceModal = () => {
    setShowSourceModal(false);
    setSelectedSource(null);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete();
      // Afficher une notification de succès après la suppression
      showSnackbar(`Collection "${collection.name}" supprimée avec succès`, SNACKBAR_TYPES.SUCCESS);
    }
    setShowDeleteModal(false);
  };

  // Ajouter une source à la collection
  const handleAddToCollection = async (source) => {
    try {
      if (onAddSource) {
        await onAddSource(source._id);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la source à la collection:", error);
    }
  };

  // Nouvelle fonction pour gérer le clic sur "Voir les articles"
  const handleBrowseArticles = () => {
    if (onBrowseArticles) {
      // Si une fonction personnalisée est fournie, l'utiliser
      onBrowseArticles();
    } else {
      // Sinon, naviguer vers le dashboard avec le paramètre de collection
      navigate(`/app?collection=${collection._id}`);
    }
  };

  if (!collection) return null;

  // Obtenir le nom du créateur
  let creatorName = 'Utilisateur anonyme';
  if (isUserOwner) {
    creatorName = 'vous';
  } else if (collection.createdBy?.username) {
    creatorName = collection.createdBy.username;
  } else if (collection.creator?.username) {
    creatorName = collection.creator.username;
  } else if (collection.user?.username) {
    creatorName = collection.user.username;
  }

  return (
    <div className={`collection-details ${layoutType === 'compact' ? 'compact' : ''}`}>
      {/* En-tête de la collection */}
      <div className="flex flex-col sm:flex-row sm:items-center ">
        <div className="flex items-center mb-4 sm:mb-0">
          <CollectionAvatar collection={collection} />
          <div className="flex-1">
            <h1 className="text-xl font-bold">{collection.name}</h1>

            {/* Badges de statut */}
            {collection.isPublic ? (
              <span className="inline px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                Public
              </span>
            ) : (
              <span className="inline px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                Privé
              </span>
            )}
            {isFollowing && !isUserOwner && (
              <span className="inline px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                Suivie
              </span>
            )}

            <div className="flex flex-wrap items-center mt-1">
              <span className="text-sm text-gray-500">Par {creatorName}</span>
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
      </div>

      {/* Description */}
      {collection.description && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <p className="text-gray-700">{collection.description}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 mb-2">
        {/* Bouton Voir les articles - n'apparaît pas pendant l'onboarding */}
        {onBrowseArticles && !isOnboarding && (
          <button
            onClick={handleBrowseArticles}
            className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
          >
            Voir les articles
          </button>
        )}

        {/* Bouton Suivre/Suivi (si collection publique et non propriétaire) */}
        {collection.isPublic && !isUserOwner && onFollowToggle && (
          <button
            className={`flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isFollowing
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
            }`}
            onClick={onFollowToggle}
            disabled={followLoading}
          >
            {followLoading ? (
              <span className="h-4 w-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin mr-1"></span>
            ) : (
              <CheckIcon className="w-4 h-4 mr-1" />
            )}
            {isFollowing ? 'Suivi' : 'Suivre'}
          </button>
        )}

        {/* Bouton pour ajouter des sources (uniquement si propriétaire) */}
        {isUserOwner && (
          <button
            onClick={() => setShowSourceCatalog(!showSourceCatalog)}
            className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-medium flex items-center"
          >
            <AddSourceIcon className="w-4 h-4 mr-1.5" />
            {showSourceCatalog ? 'Masquer le catalogue' : 'Ajouter des sources'}
          </button>
        )}

        {/* Bouton Partager (si collection publique) */}
        {collection.isPublic && (
          <button
            onClick={() => setShowShareModal(true)}
            className="px-3 py-1.5 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 flex items-center text-sm font-medium"
          >
            <CollectionShareIcon className="h-4 w-4 mr-1" />
            Partager
          </button>
        )}

        {/* Boutons d'édition et de suppression (si propriétaire) */}
        {isUserOwner && (
          <>
            {onEdit ? (
              <button
                onClick={handleEditClick}
                className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
              >
                Modifier
              </button>
            ) : (
              <Link
                to={`/collections/edit/${collection._id}`}
                className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
              >
                Modifier
              </Link>
            )}
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="px-3 py-1.5 border border-red-300 text-red-700 rounded-md hover:bg-red-50 text-sm font-medium"
              >
                Supprimer
              </button>
            )}
          </>
        )}
      </div>

      {/* Catalogue de sources (affiché uniquement si propriétaire et si showSourceCatalog est true) */}
      {isUserOwner && showSourceCatalog && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Catalogue de sources</h3>
          <SourceCatalog
            onAddToCollection={handleAddToCollection}
            collectionSources={collection.sources || []}
            userCollections={[]}
          />
        </div>
      )}

      {/* Liste des sources - conditionnelle */}
      {withSourcesList && collection.sources && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Sources ({collection.sources.length || 0})</h2>

          {collection.sources.length === 0 ? (
            <div className="text-center p-6 bg-gray-50 rounded-md">
              <p className="text-gray-500">Cette collection ne contient aucune source</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-1">
              {collection.sources.map((source) => (
                <div
                  key={source._id}
                  className="p-3 border border-gray-200 rounded-md flex items-center cursor-pointer"
                  onClick={() => handleSourceClick(source)}
                >
                  <div
                    className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden mr-3 flex-shrink-0"
                    style={{
                      backgroundImage: source.faviconUrl ? `url(${source.faviconUrl})` : 'none',
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
                  {isUserOwner && onRemoveSource && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSource(source._id);
                      }}
                      className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                      title="Retirer de la collection"
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modales */}
      {selectedSource && (
        <SourceDetailsModal
          isOpen={showSourceModal}
          onClose={handleCloseSourceModal}
          source={selectedSource}
        />
      )}

      <ConfirmationModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onConfirm={() => setShowShareModal(false)}
        title="Partager la collection"
        message="Le système de partage de collections sera bientôt disponible !"
        confirmButtonText="D'accord"
        cancelButtonText="Fermer"
        confirmButtonClass="bg-blue-600 text-white hover:bg-blue-700"
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer la collection"
        itemName={collection?.name}
        confirmButtonText="Supprimer"
        cancelButtonText="Annuler"
      />
    </div>
  );
};

export default CollectionDetailComponent;
