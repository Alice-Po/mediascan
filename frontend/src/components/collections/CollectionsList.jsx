import React from 'react';
import PropTypes from 'prop-types';
import CollectionItem from './CollectionItem';

/**
 * Composant pour afficher la liste des collections
 *
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.collections - Collections à afficher
 * @param {Object} props.actionConfig - Configuration des actions disponibles
 * @param {Function} props.onCollectionClick - Callback pour le clic sur une collection
 * @param {Function} props.onDelete - Callback pour la suppression
 * @param {Function} props.onShare - Callback pour le partage
 * @param {Function} props.onSourceRemove - Callback pour la suppression d'une source
 * @param {string} props.currentUserId - ID de l'utilisateur courant
 * @param {boolean} props.isOnboarding - Indique si le composant est utilisé dans l'onboarding
 */
const CollectionsList = ({
  collections,
  actionConfig,
  onCollectionClick,
  onDelete,
  onShare,
  onSourceRemove,
  currentUserId,
  isOnboarding = false,
}) => {
  if (!collections || !Array.isArray(collections) || collections.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500 mb-3">Aucune collection à afficher</p>
      </div>
    );
  }

  return (
    <div className="collections-list">
      <div className="divide-y divide-gray-200">
        {collections.map((collection) => (
          <CollectionItem
            key={collection._id}
            collection={collection}
            onClick={onCollectionClick}
            onDelete={onDelete}
            onShare={onShare}
            onSourceRemove={onSourceRemove}
            currentUserId={currentUserId}
            showActionButtons={true}
            actionConfig={actionConfig}
            isOnboarding={isOnboarding}
          />
        ))}
      </div>
    </div>
  );
};

CollectionsList.propTypes = {
  collections: PropTypes.array.isRequired,
  actionConfig: PropTypes.shape({
    view: PropTypes.bool,
    edit: PropTypes.bool,
    delete: PropTypes.bool,
    share: PropTypes.bool,
  }).isRequired,
  onCollectionClick: PropTypes.func,
  onDelete: PropTypes.func,
  onShare: PropTypes.func,
  onSourceRemove: PropTypes.func,
  currentUserId: PropTypes.string,
  isOnboarding: PropTypes.bool,
};

export default CollectionsList;
