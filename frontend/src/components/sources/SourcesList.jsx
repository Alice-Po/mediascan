import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SourceItem from './SourceItem';
import ConfirmationModal from '../common/ConfirmationModal';

/**
 * Composant générique pour afficher une liste de sources
 * @param {Object} props
 * @param {Array} props.sources - Liste des sources à afficher
 * @param {Function} props.onSourceClick - Callback lors du clic sur une source (détail)
 * @param {Function} props.onSourceDelete - Callback lors de la suppression d'une source
 * @param {Function} props.onAddToCollection - Callback pour ajouter une source à une collection
 * @param {boolean} props.showDeleteAction - Afficher le bouton de suppression
 * @param {boolean} props.showAddToCollectionAction - Afficher le bouton d'ajout à une collection
 */
const SourcesList = ({
  sources = [],
  onSourceClick = null,
  onSourceDelete = null,
  onAddToCollection = null,
  showDeleteAction = true,
  showAddToCollectionAction = false,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sourceToDelete, setSourceToDelete] = useState(null);

  if (!sources || !Array.isArray(sources) || sources.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500 mb-3">Aucune source à afficher</p>
      </div>
    );
  }

  // Gérer le clic sur le bouton supprimer
  const handleDeleteClick = (source) => {
    setSourceToDelete(source);
    setShowDeleteModal(true);
  };

  // Confirmer la suppression
  const handleConfirmDelete = () => {
    if (onSourceDelete && sourceToDelete) {
      onSourceDelete(sourceToDelete);
    }
    setShowDeleteModal(false);
    setSourceToDelete(null);
  };

  // Annuler la suppression
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSourceToDelete(null);
  };

  return (
    <div className="sources-list divide-y divide-gray-200">
      {sources.map((source) => (
        <SourceItem
          key={source._id}
          source={source}
          onClick={onSourceClick}
          onAddToCollection={showAddToCollectionAction ? onAddToCollection : undefined}
          onDelete={showDeleteAction ? () => handleDeleteClick(source) : undefined}
        />
      ))}

      {/* Modale de confirmation pour suppression */}
      <ConfirmationModal
        isOpen={showDeleteModal && !!sourceToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer la source"
        itemName={sourceToDelete?.name}
        confirmButtonText="Supprimer"
        cancelButtonText="Annuler"
      />
    </div>
  );
};

SourcesList.propTypes = {
  sources: PropTypes.array.isRequired,
  onSourceClick: PropTypes.func,
  onSourceDelete: PropTypes.func,
  onAddToCollection: PropTypes.func,
  showDeleteAction: PropTypes.bool,
  showAddToCollectionAction: PropTypes.bool,
};

export default SourcesList;
