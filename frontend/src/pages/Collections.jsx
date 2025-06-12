import React, { useEffect, useContext, useState } from 'react';
import { CollectionsList } from '../components/collections';
import { useCollections } from '../hooks/useCollections';
import { AuthContext } from '../context/AuthContext';
import { useDefaultCollection } from '../context/DefaultCollectionContext';
import { Link, useNavigate } from 'react-router-dom';
import PublicCollectionsCatalog from '../components/collections/PublicCollectionsCatalog';
import { useSnackbar, SNACKBAR_TYPES } from '../context/SnackbarContext';
import ConfirmationModal from '../components/common/ConfirmationModal';

const Collections = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();
  const { defaultCollection, setAsDefault } = useDefaultCollection();
  const {
    ownedCollections,
    followedCollections,
    loading,
    deleteCollection,
    removeSourceFromCollection,
  } = useCollections(user);

  const [showPublicCollectionsModal, setShowPublicCollectionsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

  // Configuration des actions disponibles
  const actionConfig = {
    view: true,
    edit: true,
    delete: true,
    share: true,
  };

  // Callbacks pour les collections
  const handleCollectionClick = (collection) => {
    navigate(`/collections/${collection._id}`);
  };

  const handleDeleteClick = (collection) => {
    setSelectedCollection(collection);
    setShowDeleteModal(true);
  };

  const handleShareClick = (collection) => {
    setSelectedCollection(collection);
    setShowShareModal(true);
  };

  const handleSourceRemove = async (collectionId, sourceId) => {
    try {
      await removeSourceFromCollection(collectionId, sourceId);
      showSnackbar('Source supprimée avec succès', SNACKBAR_TYPES.SUCCESS);
    } catch (error) {
      console.error('Error removing source:', error);
      showSnackbar('Erreur lors de la suppression de la source', SNACKBAR_TYPES.ERROR);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCollection) return;

    try {
      await deleteCollection(selectedCollection._id);
      showSnackbar('Collection supprimée avec succès', SNACKBAR_TYPES.SUCCESS);
    } catch (error) {
      console.error('Error deleting collection:', error);
      showSnackbar('Erreur lors de la suppression de la collection', SNACKBAR_TYPES.ERROR);
    } finally {
      setShowDeleteModal(false);
      setSelectedCollection(null);
    }
  };

  // Callback pour gérer le changement de collection par défaut
  const handleDefaultCollectionChange = async (collectionId) => {
    try {
      const success = await setAsDefault(collectionId);
      if (success) {
        showSnackbar('Collection par défaut mise à jour', SNACKBAR_TYPES.SUCCESS);
      } else {
        showSnackbar(
          'Erreur lors de la mise à jour de la collection par défaut',
          SNACKBAR_TYPES.ERROR
        );
      }
    } catch (error) {
      console.error('Error setting default collection:', error);
      showSnackbar(
        'Erreur lors de la mise à jour de la collection par défaut',
        SNACKBAR_TYPES.ERROR
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-8 gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mes Collections</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/collections/new"
            className="inline-flex items-center justify-center flex-1 sm:flex-initial px-4 py-2 bg-blue-500 text-white text-sm sm:text-base rounded hover:bg-blue-600 transition-colors min-h-[40px]"
          >
            Nouvelle collection
          </Link>
          <button
            onClick={() => setShowPublicCollectionsModal(true)}
            className="inline-flex items-center justify-center flex-1 sm:flex-initial px-4 py-2 bg-indigo-500 text-white text-sm sm:text-base rounded hover:bg-indigo-600 transition-colors min-h-[40px]"
          >
            Explorer les collections publiques
          </button>
        </div>
      </div>

      {/* Collections personnelles */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        {loading ? (
          <div className="p-4 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <CollectionsList
            collections={ownedCollections}
            actionConfig={actionConfig}
            onCollectionClick={handleCollectionClick}
            onDelete={handleDeleteClick}
            onShare={handleShareClick}
            onSourceRemove={handleSourceRemove}
            currentUserId={user?._id}
            defaultCollection={defaultCollection}
            onDefaultChange={handleDefaultCollectionChange}
          />
        )}
      </div>

      {/* Collections suivies */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        {loading ? (
          <div className="p-4 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : followedCollections && followedCollections.length > 0 ? (
          <>
            <h2 className="text-lg font-medium text-gray-900 mb-4 px-3">Collections suivies</h2>
            <CollectionsList
              collections={followedCollections}
              actionConfig={{ ...actionConfig, delete: false }} // Pas de suppression pour les collections suivies
              onCollectionClick={handleCollectionClick}
              onShare={handleShareClick}
              onSourceRemove={handleSourceRemove}
              currentUserId={user?._id}
              defaultCollection={defaultCollection}
              onDefaultChange={handleDefaultCollectionChange}
            />
          </>
        ) : (
          <div className="p-4 text-gray-500">
            <p className="italic mb-4">Vous ne suivez aucune collection publique pour le moment.</p>
            <button
              onClick={() => setShowPublicCollectionsModal(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 transition-colors"
            >
              Explorer les collections publiques
            </button>
          </div>
        )}
      </div>

      {/* Modales */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer la collection"
        itemName={selectedCollection?.name}
        confirmButtonText="Supprimer"
        cancelButtonText="Annuler"
      />

      <ConfirmationModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onConfirm={() => setShowShareModal(false)}
        title="Partager la collection"
        message="Le système de partage de collections sera bientôt disponible !"
        itemName={selectedCollection?.name}
        confirmButtonText="D'accord"
        cancelButtonText="Fermer"
        confirmButtonClass="bg-blue-600 text-white hover:bg-blue-700"
      />

      {/* Catalogue de collections publiques */}
      <PublicCollectionsCatalog
        isOpen={showPublicCollectionsModal}
        onClose={() => setShowPublicCollectionsModal(false)}
        minSourcesRequired={5}
        onFollowStatusChange={() => {}} // Géré par le hook useCollections
      />
    </div>
  );
};

export default Collections;
