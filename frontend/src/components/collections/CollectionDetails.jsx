import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useDefaultCollection } from '../../context/DefaultCollectionContext';
import { useSnackbar, SNACKBAR_TYPES } from '../../context/SnackbarContext';
import { generateFollowersFromId } from '../../utils/colorUtils';
import ConfirmationModal from '../common/ConfirmationModal';
import SourceDetails from '../sources/SourceDetails';
import { CollectionShareIcon, CheckIcon, AddSourceIcon, XIcon, StarIcon } from '../common/icons';
import SourceCatalogModal from '../sources/SourceCatalogModal';
import CollectionAvatar from './CollectionAvatar';
import ArticleList from '../articles/ArticleList';
import { useArticles } from '../../hooks/useArticles';
import Accordion from '../common/Accordion';
import SourceItem from '../sources/SourceItem';
import Modal from '../common/Modal';
import SourcesList from '../sources/SourcesList';

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
  const { isDefaultCollection } = useDefaultCollection();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  // États pour la gestion des modales
  const [selectedSource, setSelectedSource] = useState(null);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSourceCatalog, setShowSourceCatalog] = useState(false);
  const [defaultSettingLoading] = useState(false);

  // Configurer les filtres pour le feed d'articles
  const collectionFilters = {
    collection: collection?._id,
    sources: collection?.sources?.map((source) => source._id) || [],
  };

  // Utiliser le hook useArticles pour le feed
  const {
    articles,
    loading: articlesLoading,
    error: articlesError,
    hasMore,
    loadMore,
  } = useArticles({
    collections: [collection],
    options: {
      initialFilters: collectionFilters,
      pageSize: 10, // Limiter à 10 articles pour l'aperçu
    },
  });

  const isUserOwner = collection.createdBy && user._id && collection.createdBy._id === user._id;
  const isDefault = isDefaultCollection(collection._id);
  const canSetAsDefault = isUserOwner || isFollowing;

  // Gestion des actions
  const handleSourceClick = (source) => {
    console.log('[handleSourceClick] Source cliquée :', source);
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
              <span className="inline px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full ml-1">
                Suivie
              </span>
            )}
            {isDefault && (
              <span className="inline px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full ml-1">
                Par défaut
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
          <SourceCatalogModal
            onAddToCollection={handleAddToCollection}
            collectionSources={collection.sources || []}
            userCollections={[]}
          />
        </div>
      )}

      {/* Liste des sources - conditionnelle */}
      {withSourcesList && collection.sources && (
        <Accordion title={`Sources (${collection.sources.length || 0})`} defaultOpen={true}>
          {collection.sources.length === 0 ? (
            <div className="text-center p-6 bg-gray-50 rounded-md">
              <p className="text-gray-500">Cette collection ne contient aucune source</p>
            </div>
          ) : (
            <SourcesList
              sources={collection.sources}
              onSourceClick={handleSourceClick}
              onSourceDelete={isUserOwner && onRemoveSource ? handleRemoveSource : undefined}
              showDeleteAction={isUserOwner && !!onRemoveSource}
            />
          )}
        </Accordion>
      )}

      {/* Section du feed d'articles */}
      {withSourcesList && collection.sources && collection.sources.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Aperçu du flux</h2>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <ArticleList filters={collectionFilters} />
          </div>
        </div>
      )}

      {/* Modales */}
      {selectedSource && (
        <>
          {console.log('[Modal] selectedSource :', selectedSource)}
          <Modal
            isOpen={showSourceModal}
            onClose={handleCloseSourceModal}
            title={selectedSource.name}
            size="md"
          >
            <SourceDetails source={selectedSource} />
          </Modal>
        </>
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
