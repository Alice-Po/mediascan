import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { generateFollowersFromId } from '../../utils/colorUtils';
import { useCollections } from '../../hooks/useCollections';
import { AuthContext } from '../../context/AuthContext';
import { useDefaultCollection } from '../../context/DefaultCollectionContext';
import { useSnackbar, SNACKBAR_TYPES } from '../../context/SnackbarContext';
import {
  GlobeIcon,
  LockIcon,
  CollectionShareIcon,
  ViewIcon,
  EditIcon,
  TrashIcon,
  StarIcon,
} from './../common/icons';
import CollectionDetails from './CollectionDetails';
import CollectionAvatar from './CollectionAvatar';
/**
 * Composant réutilisable pour afficher un élément de collection
 * Adapté pour les collections personnelles, publiques et suivies
 *
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.collectionId - ID de la collection à afficher
 * @param {Object} props.collection - Objet collection à afficher directement
 * @param {boolean} props.isSelected - Indique si cette collection est sélectionnée
 * @param {Function} props.onClick - Fonction appelée quand l'élément est cliqué
 * @param {Function} props.onDelete - Fonction appelée quand le bouton supprimer est cliqué
 * @param {Function} props.onShare - Fonction appelée quand le bouton partager est cliqué
 * @param {Function} props.onSourceRemove - Fonction appelée quand une source est supprimée
 * @param {string} props.currentUserId - ID de l'utilisateur actuel
 * @param {boolean} props.showActionButtons - Afficher ou non les boutons d'action
 * @param {Object} props.actionConfig - Configuration des boutons d'action à afficher
 * @param {boolean} props.isOnboarding - Indique si le composant est utilisé dans l'onboarding
 */
const CollectionItem = ({
  collectionId,
  collection: initialCollection,
  isSelected,
  onClick,
  onDelete,
  onShare,
  onSourceRemove,
  currentUserId,
  showActionButtons = true,
  actionConfig = { view: true, edit: true, delete: true, share: true },
  isOnboarding = false,
}) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { isDefaultCollection, setAsDefault } = useDefaultCollection();
  const { showSnackbar } = useSnackbar();
  const [collection, setCollection] = useState(initialCollection);
  const { loadCollectionById, removeSourceFromCollection, loading } = useCollections(user);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    // Si initialCollection est fourni directement, l'utiliser
    if (initialCollection) {
      setCollection(initialCollection);
      return;
    }

    // Sinon, charger la collection par son ID
    if (collectionId) {
      const fetchCollection = async () => {
        try {
          const fetchedCollection = await loadCollectionById(collectionId);
          console.log('la collection est chargée', fetchedCollection);

          console.log('la collection et ses sourc e', fetchedCollection.sources);
          setCollection(fetchedCollection);
        } catch (error) {
          console.error('Erreur lors du chargement de la collection:', error);
        }
      };

      fetchCollection();
    }
  }, [collectionId, initialCollection, loadCollectionById]);

  // Mettre à jour la collection dans l'état local lorsque initialCollection change
  useEffect(() => {
    if (initialCollection) {
      setCollection(initialCollection);
    }
  }, [initialCollection]);

  // Ne rien afficher si la collection n'est pas encore chargée
  if (!collection) {
    return (
      <div className="p-3 animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Déterminer si c'est une collection suivie (n'appartient pas à l'utilisateur)
  const isFollowed =
    collection.isFollowed || (collection.userId !== currentUserId && collection.isPublic);

  // Déterminer si l'utilisateur peut modifier/supprimer (c'est sa collection)
  const canModify = !isFollowed && collection.userId === currentUserId;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      // Suppression de la notification, on se contente de passer la collection au parent
      onDelete(collection);
    }
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    if (onShare) onShare(collection);
  };

  const handleViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
  };

  const handleItemClick = (e) => {
    // Vérifier si l'événement provient d'un élément qui doit empêcher la navigation
    const isActionButton = e.target.closest('button') || e.target.closest('a');

    if (isActionButton) {
      return; // Ne pas traiter le clic si ça vient d'un bouton d'action
    }

    // Si en mode onboarding, juste afficher les détails sans naviguer
    if (isOnboarding) {
      setShowDetailsModal(true);
      return;
    }

    // 1. Naviguer vers la page de détail de la collection
    navigate(`/collections/${collection._id}`);

    // 2. Si la fonction onClick est fournie, l'appeler après la navigation
    // pour appliquer le filtrage en arrivant sur la page
    if (onClick) {
      onClick(collection);
    }
  };

  const handleSourceRemove = async (collectionId, sourceId) => {
    try {
      // Mettre à jour la collection localement pour un affichage immédiat
      setCollection((prev) => {
        if (!prev || !prev.sources) return prev;
        return {
          ...prev,
          sources: prev.sources.filter((s) => s._id !== sourceId),
        };
      });

      // Propager la mise à jour au composant parent s'il a fourni une fonction onSourceRemove
      if (onSourceRemove) {
        onSourceRemove(collectionId, sourceId);
      }
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour de la collection après suppression de source:',
        error
      );
    }
  };

  // Gérer le clic sur l'étoile pour définir comme collection par défaut
  const handleSetAsDefault = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!collection) return;

    // Permettre la définition comme collection par défaut pour les collections suivies aussi
    const canSetAsDefault = canModify || isFollowed;

    if (!canSetAsDefault) return;

    try {
      const success = await setAsDefault(collection._id);
      if (success) {
        showSnackbar(
          `"${collection.name}" définie comme collection par défaut`,
          SNACKBAR_TYPES.SUCCESS
        );
      } else {
        showSnackbar('Impossible de définir la collection par défaut', SNACKBAR_TYPES.ERROR);
      }
    } catch (error) {
      console.error('Erreur lors de la définition de la collection par défaut:', error);
      showSnackbar('Une erreur est survenue', SNACKBAR_TYPES.ERROR);
    }
  };

  return (
    <>
      <div
        className={`p-3 hover:bg-gray-50 cursor-pointer transition ${
          isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
        }`}
        onClick={handleItemClick}
      >
        <div className="flex">
          {/* Avatar de la collection */}
          <CollectionAvatar collection={collection} size="md" className="mr-3" />

          <div className="flex-1 min-w-0 overflow-hidden">
            {/* Première ligne: titre et badges */}
            <div className="flex items-center flex-wrap">
              <h3 className="font-medium text-gray-900 truncate mr-2">{collection.name}</h3>
              {collection.isPublic ? (
                <span className="inline-flex items-center">
                  <GlobeIcon />
                  {(canModify || isFollowed) && (
                    <span
                      onClick={handleSetAsDefault}
                      className={`cursor-pointer ml-1 ${
                        isDefaultCollection(collection._id)
                          ? 'text-yellow-500'
                          : 'text-gray-300 hover:text-yellow-500'
                      }`}
                      title={
                        isDefaultCollection(collection._id)
                          ? 'Collection par défaut'
                          : 'Définir comme collection par défaut'
                      }
                    >
                      <StarIcon className="h-3 w-3" filled={isDefaultCollection(collection._id)} />
                    </span>
                  )}
                  {!(canModify || isFollowed) && isDefaultCollection(collection._id) && (
                    <StarIcon
                      className="h-3 w-3 ml-1 text-yellow-500"
                      title="Collection par défaut"
                    />
                  )}
                </span>
              ) : (
                <span className="inline-flex items-center">
                  <LockIcon />
                  {(canModify || isFollowed) && (
                    <span
                      onClick={handleSetAsDefault}
                      className={`cursor-pointer ml-1 ${
                        isDefaultCollection(collection._id)
                          ? 'text-yellow-500'
                          : 'text-gray-300 hover:text-yellow-500'
                      }`}
                      title={
                        isDefaultCollection(collection._id)
                          ? 'Collection par défaut'
                          : 'Définir comme collection par défaut'
                      }
                    >
                      <StarIcon className="h-3 w-3" filled={isDefaultCollection(collection._id)} />
                    </span>
                  )}
                  {!(canModify || isFollowed) && isDefaultCollection(collection._id) && (
                    <StarIcon
                      className="h-3 w-3 ml-1 text-yellow-500"
                      title="Collection par défaut"
                    />
                  )}
                </span>
              )}
              <div className="flex flex-wrap gap-1 ml-1">
                {isFollowed && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    Suivie
                  </span>
                )}
                {collection.isPublic && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-800">
                    Public
                  </span>
                )}
                {isDefaultCollection(collection._id) && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                    Par défaut
                  </span>
                )}
              </div>
            </div>

            {/* Seconde ligne: Créateur et métadonnées */}
            <div className="flex flex-wrap text-xs text-gray-500 w-full">
              <span className="truncate">
                Par{' '}
                {collection.userId === currentUserId
                  ? 'vous'
                  : collection.createdBy?.username || 'Utilisateur anonyme'}
              </span>
              <span className="mx-1 flex-shrink-0">•</span>
              <span className="flex-shrink-0">
                {collection.sources?.length || 0} source
                {collection.sources?.length !== 1 ? 's' : ''}
              </span>
              {/* Nombre de suiveurs pour les collections publiques */}
              {collection.isPublic && (
                <>
                  <span className="mx-1 flex-shrink-0">•</span>
                  <span className="truncate flex-shrink-0">
                    {generateFollowersFromId(collection._id)} suiveurs
                  </span>
                </>
              )}
            </div>

            {/* Description sur une ligne distincte avec plus d'espace */}
            {collection.description && (
              <p className="text-xs text-gray-700 mt-2 sm:max-w-none overflow-hidden">
                {/* Sur mobile: afficher plus de texte, sur desktop: garder compact */}
                <span className="sm:hidden">
                  {collection.description.length > 100
                    ? `${collection.description.substring(0, 100)}...`
                    : collection.description}
                </span>
                <span className="hidden sm:inline truncate">{collection.description}</span>
              </p>
            )}
          </div>

          {/* Boutons d'action */}
          {showActionButtons && (
            <div className="flex flex-shrink-0 space-x-1 ml-2">
              {/* Bouton Voir (pour toutes les collections) */}
              {actionConfig.view && (
                <button
                  className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 inline-flex items-center justify-center"
                  onClick={handleViewClick}
                  title="Voir les détails de la collection"
                >
                  <ViewIcon className="h-5 w-5" />
                </button>
              )}

              {/* Bouton Partager (uniquement pour les collections publiques) */}
              {actionConfig.share && collection.isPublic && onShare && (
                <button
                  className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-gray-100 inline-flex items-center justify-center"
                  onClick={handleShareClick}
                  title="Partager cette collection"
                >
                  <CollectionShareIcon className="h-5 w-5" />
                </button>
              )}

              {/* Boutons Modifier et Supprimer (uniquement pour les collections de l'utilisateur) */}
              {canModify && (
                <>
                  {actionConfig.edit && !isOnboarding && (
                    <Link
                      to={`/collections/edit/${collection._id}`}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 inline-flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                      title="Modifier cette collection"
                    >
                      <EditIcon className="h-5 w-5" />
                    </Link>
                  )}
                  {actionConfig.delete && onDelete && (
                    <button
                      className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-gray-100 inline-flex items-center justify-center"
                      onClick={handleDeleteClick}
                      title="Supprimer cette collection"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de détails de la collection */}
      {showDetailsModal && (
        <CollectionDetails
          collectionId={collection._id}
          isOpen={showDetailsModal}
          onClose={handleCloseModal}
          externalCollection={collection}
          onSourceRemove={handleSourceRemove}
          standalone={true}
          isOnboarding={isOnboarding}
        />
      )}
    </>
  );
};

export default CollectionItem;
