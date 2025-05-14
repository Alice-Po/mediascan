import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateColorFromId, generateFollowersFromId } from '../../utils/colorUtils';
import { useCollections } from '../../hooks/useCollections';
import { AuthContext } from '../../context/AuthContext';
import {
  GlobeIcon,
  LockIcon,
  CollectionShareIcon,
  ViewIcon,
  EditIcon,
  TrashIcon,
} from './../common/icons';
/**
 * Composant réutilisable pour afficher un élément de collection
 * Adapté pour les collections personnelles, publiques et suivies
 */
const CollectionItem = ({
  collectionId,
  collection: initialCollection,
  isSelected,
  onClick,
  onDelete,
  onShare,
  currentUserId,
  showActionButtons = true,
}) => {
  const { user } = useContext(AuthContext);
  const [collection, setCollection] = useState(initialCollection);
  const { loadCollectionById, loading } = useCollections(user);

  useEffect(() => {
    console.log('la collection est', collection);
    // Si initialCollection est fourni directement, l'utiliser
    if (initialCollection) {
      setCollection(initialCollection);
      console.log('la collection initial est fournie', initialCollection);
      return;
    }

    // Sinon, charger la collection par son ID
    if (collectionId) {
      const fetchCollection = async () => {
        try {
          const fetchedCollection = await loadCollectionById(collectionId);
          console.log('la collection est chargée', fetchedCollection);
          setCollection(fetchedCollection);
        } catch (error) {
          console.error('Erreur lors du chargement de la collection:', error);
        }
      };

      fetchCollection();
    }
  }, [collectionId, initialCollection, loadCollectionById]);

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
    if (onDelete) onDelete(collection);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    if (onShare) onShare(collection);
  };

  return (
    <div
      className={`p-3 hover:bg-gray-50 cursor-pointer transition ${
        isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
      }`}
      onClick={() => onClick && onClick(collection)}
    >
      <div className="flex items-center space-x-3">
        {/* Avatar de la collection */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: !collection.imageUrl
              ? collection.colorHex || generateColorFromId(collection._id)
              : undefined,
            backgroundImage: collection.imageUrl ? `url(${collection.imageUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {!collection.imageUrl && (
            <span className="text-white font-medium">
              {collection.name.substring(0, 1).toUpperCase()}
            </span>
          )}
        </div>

        {/* Informations sur la collection */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <p className="font-medium text-gray-900 truncate mr-2">{collection.name}</p>
            {collection.isPublic ? (
              <span className="inline-flex ml-1.5 items-center">
                <GlobeIcon />
              </span>
            ) : (
              <span className="inline-flex ml-1.5 items-center">
                <LockIcon />
              </span>
            )}
            <div className="flex flex-wrap gap-1">
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
            </div>
          </div>

          {/* Créateur et statistiques */}
          <p className="text-xs text-gray-500">
            {/* Afficher "Par vous" ou le nom du créateur */}
            Par{' '}
            {collection.userId === currentUserId
              ? 'vous'
              : collection.creator?.username || 'Utilisateur anonyme'}
            {/* Nombre de sources */}
            <span className="mx-1">•</span>
            {collection.sources?.length || 0} source
            {collection.sources?.length !== 1 ? 's' : ''}
            {/* Nombre de suiveurs pour les collections publiques */}
            {collection.isPublic && (
              <>
                <span className="mx-1">•</span>
                {generateFollowersFromId(collection._id)} suiveurs
              </>
            )}
          </p>

          {/* Description (si elle existe) */}
          {collection.description && (
            <p className="text-xs text-gray-700 mt-1 truncate">{collection.description}</p>
          )}
        </div>

        {/* Boutons d'action */}
        {showActionButtons && (
          <div className="flex space-x-1">
            {/* Bouton Partager (uniquement pour les collections publiques) */}
            {collection.isPublic && (
              <button
                className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-gray-100"
                onClick={handleShareClick}
                title="Partager cette collection"
              >
                <CollectionShareIcon />
              </button>
            )}

            {/* Bouton Voir (pour toutes les collections) */}
            <Link
              to={`/collections/${collection._id}`}
              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <ViewIcon />
            </Link>

            {/* Boutons Modifier et Supprimer (uniquement pour les collections de l'utilisateur) */}
            {canModify && (
              <>
                <Link
                  to={`/collections/edit/${collection._id}`}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <EditIcon />
                </Link>
                <button
                  className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-gray-100"
                  onClick={handleDeleteClick}
                  title="Supprimer cette collection"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionItem;
