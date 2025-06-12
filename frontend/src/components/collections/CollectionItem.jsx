import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { generateFollowersFromId } from '../../utils/colorUtils';
import { useDefaultCollection } from '../../context/DefaultCollectionContext';
import {
  GlobeIcon,
  LockIcon,
  CollectionShareIcon,
  ViewIcon,
  EditIcon,
  TrashIcon,
  StarIcon,
  ProfileIcon,
} from './../common/icons';
import CollectionAvatar from './CollectionAvatar';
import Avatar from '../common/Avatar';

/**
 * Composant réutilisable pour afficher un élément de collection
 *
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.collection - Objet collection à afficher
 * @param {boolean} props.isSelected - Indique si cette collection est sélectionnée
 * @param {Function} props.onClick - Fonction appelée quand l'élément est cliqué
 * @param {Function} props.onDelete - Fonction appelée quand le bouton supprimer est cliqué
 * @param {Function} props.onShare - Fonction appelée quand le bouton partager est cliqué
 * @param {Function} props.onSourceRemove - Fonction appelée quand une source est supprimée
 * @param {Function} props.onDefaultChange - Fonction appelée quand la collection est définie par défaut
 * @param {string} props.currentUserId - ID de l'utilisateur actuel
 * @param {boolean} props.showActionButtons - Afficher ou non les boutons d'action
 * @param {Object} props.actionConfig - Configuration des boutons d'action à afficher
 * @param {boolean} props.isOnboarding - Indique si le composant est utilisé dans l'onboarding
 */
const CollectionItem = ({
  collection,
  isSelected,
  onClick,
  onDelete,
  onShare,
  onSourceRemove,
  onDefaultChange,
  currentUserId,
  showActionButtons = true,
  actionConfig = { view: true, edit: true, delete: true, share: true },
  isOnboarding = false,
}) => {
  const { isDefaultCollection } = useDefaultCollection();
  const isDefault = isDefaultCollection(collection._id);

  // Déterminer si c'est une collection suivie (n'appartient pas à l'utilisateur)
  const isFollowed =
    collection.isFollowed || (collection.userId !== currentUserId && collection.isPublic);

  // Déterminer si l'utilisateur peut modifier/supprimer (c'est sa collection)
  const canModify = !isFollowed && collection.userId === currentUserId;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
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
    if (onClick) onClick(collection);
  };

  const handleItemClick = (e) => {
    // Vérifier si l'événement provient d'un élément qui doit empêcher la navigation
    const isActionButton = e.target.closest('button') || e.target.closest('a');

    if (isActionButton) {
      return; // Ne pas traiter le clic si ça vient d'un bouton d'action
    }

    if (onClick) onClick(collection);
  };

  const handleSetDefaultClick = async (e) => {
    e.stopPropagation();
    if (onDefaultChange) {
      onDefaultChange(collection._id);
    }
  };

  return (
    <div
      className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
        isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
      }`}
      onClick={handleItemClick}
    >
      <div className="flex flex-col space-y-3">
        {/* En-tête avec avatar et informations principales */}
        <div className="flex items-start">
          <CollectionAvatar collection={collection} size="md" className="mr-3 flex-shrink-0" />

          <div className="flex-1 min-w-0">
            {/* Titre et badges */}
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="font-medium text-gray-900 truncate">{collection.name}</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleSetDefaultClick}
                  className="focus:outline-none"
                  title={
                    isDefault ? 'Collection par défaut' : 'Définir comme collection par défaut'
                  }
                >
                  <StarIcon
                    className={`h-5 w-5 transition-colors ${
                      isDefault
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-400 hover:text-yellow-400'
                    }`}
                  />
                </button>
                {collection.isPublic ? (
                  <GlobeIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <LockIcon className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Badges de statut */}
            <div className="flex flex-wrap gap-1 mt-1">
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
        </div>

        {/* Informations du créateur et métadonnées */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span className="flex items-center">
            {collection.createdBy?.avatar ? (
              <Avatar
                userId={collection.createdBy._id}
                avatarUrl={collection.createdBy.avatar}
                avatarType={collection.createdBy.avatarType}
                size={24}
                className="mr-1"
              />
            ) : (
              <ProfileIcon className="w-6 h-6 text-gray-400 mr-1" />
            )}
            <span className="font-semibold text-gray-800 text-sm">
              {collection.userId === currentUserId
                ? 'vous'
                : collection.createdBy?.username || 'Utilisateur anonyme'}
            </span>
          </span>
          <span className="flex items-center">
            <span className="mx-1">•</span>
            {collection.sources?.length || 0} source{collection.sources?.length !== 1 ? 's' : ''}
          </span>
          {collection.isPublic && (
            <span className="flex items-center">
              <span className="mx-1">•</span>
              {generateFollowersFromId(collection._id)} suiveurs
            </span>
          )}
        </div>

        {/* Description */}
        {collection.description && (
          <p className="text-sm text-gray-700 line-clamp-2">{collection.description}</p>
        )}

        {/* Boutons d'action */}
        {showActionButtons && (
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            {actionConfig.view && (
              <button
                className="text-gray-500 hover:text-gray-700 p-1.5 rounded hover:bg-gray-100 inline-flex items-center"
                onClick={handleViewClick}
                title="Voir les détails de la collection"
              >
                <ViewIcon className="h-5 w-5" />
                <span className="ml-1 text-sm">Voir</span>
              </button>
            )}

            {actionConfig.share && collection.isPublic && onShare && (
              <button
                className="text-gray-500 hover:text-blue-600 p-1.5 rounded hover:bg-gray-100 inline-flex items-center"
                onClick={handleShareClick}
                title="Partager cette collection"
              >
                <CollectionShareIcon className="h-5 w-5" />
                <span className="ml-1 text-sm">Partager</span>
              </button>
            )}

            {canModify && (
              <>
                {actionConfig.edit && !isOnboarding && (
                  <Link
                    to={`/collections/edit/${collection._id}`}
                    className="text-gray-500 hover:text-gray-700 p-1.5 rounded hover:bg-gray-100 inline-flex items-center"
                    onClick={(e) => e.stopPropagation()}
                    title="Modifier cette collection"
                  >
                    <EditIcon className="h-5 w-5" />
                    <span className="ml-1 text-sm">Modifier</span>
                  </Link>
                )}
                {actionConfig.delete && onDelete && (
                  <button
                    className="text-gray-500 hover:text-red-600 p-1.5 rounded hover:bg-gray-100 inline-flex items-center"
                    onClick={handleDeleteClick}
                    title="Supprimer cette collection"
                  >
                    <TrashIcon className="h-5 w-5" />
                    <span className="ml-1 text-sm">Supprimer</span>
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

CollectionItem.propTypes = {
  collection: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  onShare: PropTypes.func,
  onSourceRemove: PropTypes.func,
  onDefaultChange: PropTypes.func,
  currentUserId: PropTypes.string,
  showActionButtons: PropTypes.bool,
  actionConfig: PropTypes.shape({
    view: PropTypes.bool,
    edit: PropTypes.bool,
    delete: PropTypes.bool,
    share: PropTypes.bool,
  }),
  isOnboarding: PropTypes.bool,
};

export default CollectionItem;
