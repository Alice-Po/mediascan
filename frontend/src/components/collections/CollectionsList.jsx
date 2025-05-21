import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { AuthContext } from '../../context/AuthContext';
import { useSnackbar, SNACKBAR_TYPES } from '../../context/SnackbarContext';
import ConfirmationModal from '../common/ConfirmationModal';
import CollectionItem from './CollectionItem';
import PropTypes from 'prop-types';

/**
 * Composant pour afficher la liste des collections de l'utilisateur
 *
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.collections - Collections externes à afficher (obligatoire)
 * @param {boolean} props.showViewAction - Afficher le bouton de visualisation (par défaut: true)
 * @param {boolean} props.showEditAction - Afficher le bouton d'édition (par défaut: true)
 * @param {boolean} props.showDeleteAction - Afficher le bouton de suppression (par défaut: true)
 * @param {boolean} props.showShareAction - Afficher le bouton de partage (par défaut: true)
 * @param {boolean} props.isOnboarding - Indique si le composant est utilisé dans l'onboarding (par défaut: false)
 * @param {Function} props.onCollectionDeleted - Callback appelé après la suppression réussie d'une collection
 */
const CollectionsList = ({
  collections,
  showViewAction = true,
  showEditAction = true,
  showDeleteAction = true,
  showShareAction = true,
  isOnboarding = false,
  onCollectionDeleted = null,
}) => {
  const { filterByCollection, filters } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();

  // Si la prop collections n'est pas fournie ou vide, afficher un message
  if (!collections || !Array.isArray(collections) || collections.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500 mb-3">Aucune collection à afficher</p>
      </div>
    );
  }

  // Nouvel état pour suivre les IDs des collections supprimées
  const [deletedCollectionIds, setDeletedCollectionIds] = useState([]);

  // Rafraîchir la liste locale si la prop collections change
  const [collectionsList, setCollectionsList] = useState(collections);
  useEffect(() => {
    setCollectionsList(collections);
  }, [collections]);

  // Séparer les collections personnelles et les collections suivies
  // en filtrant également les collections supprimées
  const personalCollections = collectionsList.filter(
    (collection) => !collection.isFollowed && !deletedCollectionIds.includes(collection._id)
  );
  const followedCollections = collectionsList.filter(
    (collection) => collection.isFollowed && !deletedCollectionIds.includes(collection._id)
  );

  // Gérer le clic sur le bouton supprimer
  const handleDeleteClick = (collection) => {
    setCollectionToDelete(collection);
    setShowDeleteModal(true);
  };

  // Gérer le clic sur le bouton partager
  const handleShareClick = (collection) => {
    setCollectionToShare(collection);
    setShowShareModal(true);
  };

  // Confirmer la suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [collectionToShare, setCollectionToShare] = useState(null);

  const handleConfirmDelete = async () => {
    if (!collectionToDelete) return;

    try {
      // Ici, il faudrait appeler la fonction de suppression du parent si besoin
      setDeletedCollectionIds((prev) => [...prev, collectionToDelete._id]);
      setCollectionsList((prevCollections) =>
        prevCollections.filter((collection) => collection._id !== collectionToDelete._id)
      );
      setShowDeleteModal(false);
      setCollectionToDelete(null);
      showSnackbar(
        `Collection "${collectionToDelete.name}" supprimée avec succès`,
        SNACKBAR_TYPES.SUCCESS
      );
      if (onCollectionDeleted) {
        onCollectionDeleted(collectionToDelete);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Annuler la suppression
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCollectionToDelete(null);
  };

  // Fermer la modale de partage
  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setCollectionToShare(null);
  };

  // Gérer le clic sur une collection
  const handleCollectionClick = (collection) => {
    filterByCollection(collection._id);
  };

  // Gérer la suppression d'une source depuis la liste des collections
  const handleSourceRemoved = (collectionId, sourceId) => {
    setCollectionsList((prevCollections) =>
      prevCollections.map((collection) => {
        if (collection._id === collectionId) {
          return {
            ...collection,
            sources: collection.sources ? collection.sources.filter((s) => s._id !== sourceId) : [],
          };
        }
        return collection;
      })
    );
  };

  // Configuration des actions disponibles
  const actionConfig = {
    view: showViewAction,
    edit: showEditAction,
    delete: showDeleteAction,
    share: showShareAction,
  };

  return (
    <div className="collections-list">
      {/* Mes collections personnelles */}
      <div className="mb-8">
        <div className="divide-y divide-gray-200">
          {personalCollections.map((collection) => (
            <CollectionItem
              key={collection._id}
              collection={collection}
              isSelected={filters.collection === collection._id}
              onClick={handleCollectionClick}
              onDelete={showDeleteAction ? handleDeleteClick : null}
              onShare={showShareAction ? handleShareClick : null}
              onSourceRemove={handleSourceRemoved}
              currentUserId={user?._id}
              showActionButtons={true}
              actionConfig={actionConfig}
              isOnboarding={isOnboarding}
            />
          ))}
        </div>
      </div>

      {/* Collections suivies */}
      {followedCollections.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4 px-4">
            <h2 className="text-lg font-semibold">Collections Suivies</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {followedCollections.map((collection) => (
              <CollectionItem
                key={collection._id}
                collection={collection}
                isSelected={filters.collection === collection._id}
                onClick={handleCollectionClick}
                onShare={showShareAction ? handleShareClick : null}
                onDelete={null}
                onSourceRemove={handleSourceRemoved}
                currentUserId={user?._id}
                showActionButtons={true}
                actionConfig={actionConfig}
                isOnboarding={isOnboarding}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bouton pour réinitialiser les filtres si une collection est sélectionnée */}
      {filters.collection && !isOnboarding && (
        <div className="mt-6 px-4">
          <button
            onClick={() => filterByCollection(null)}
            className="w-full py-2 text-xs text-blue-500 hover:text-blue-700 transition"
          >
            Voir toutes les sources
          </button>
        </div>
      )}

      {/* Modale de partage */}
      <ConfirmationModal
        isOpen={showShareModal && !!collectionToShare}
        onClose={handleCloseShareModal}
        onConfirm={handleCloseShareModal}
        title="Partager la collection"
        message="Le système de partage de collections sera bientôt disponible ! Vous pourrez partager"
        itemName={collectionToShare?.name}
        confirmButtonText="D'accord"
        cancelButtonText="Fermer"
        confirmButtonClass="bg-blue-600 text-white hover:bg-blue-700"
      />

      {/* Utilisation du composant ConfirmationModal pour suppression */}
      <ConfirmationModal
        isOpen={showDeleteModal && !!collectionToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer la collection"
        itemName={collectionToDelete?.name}
        confirmButtonText="Supprimer"
        cancelButtonText="Annuler"
      />
    </div>
  );
};

CollectionsList.propTypes = {
  collections: PropTypes.array.isRequired,
  showViewAction: PropTypes.bool,
  showEditAction: PropTypes.bool,
  showDeleteAction: PropTypes.bool,
  showShareAction: PropTypes.bool,
  isOnboarding: PropTypes.bool,
  onCollectionDeleted: PropTypes.func,
};

export default CollectionsList;
