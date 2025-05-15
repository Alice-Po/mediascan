import React, { useEffect, useContext, useState } from 'react';
import { CollectionsList } from '../components/collections';
import { useCollections } from '../hooks/useCollections';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import PublicCollectionsCatalog from '../components/collections/PublicCollectionsCatalog';

const Collections = () => {
  const { user } = useContext(AuthContext);
  const { collections, loading, loadCollections } = useCollections(user);
  const [showPublicCollectionsModal, setShowPublicCollectionsModal] = useState(false);

  // Nombre minimum de sources requises pour afficher une collection
  const MIN_SOURCES_REQUIRED = 5;

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  // Ouvrir la modal des collections publiques
  const handleOpenPublicCollections = () => {
    setShowPublicCollectionsModal(true);
  };

  // Fermer la modal des collections publiques
  const handleClosePublicCollections = () => {
    setShowPublicCollectionsModal(false);
  };

  // Gérer les changements de statut de suivi
  const handleFollowStatusChange = async (collectionId, isFollowing) => {
    // Rafraîchir les collections de l'utilisateur pour inclure/exclure la collection suivie/non suivie
    await loadCollections();
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-4">
      {/* Header responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-8 gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mes Collections</h1>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/collections/new"
            className="flex-1 sm:flex-auto text-center px-3 py-2 bg-blue-500 text-white text-sm sm:text-base rounded hover:bg-blue-600 transition"
          >
            Nouvelle collection
          </Link>
          <button
            onClick={handleOpenPublicCollections}
            className="flex-1 sm:flex-auto text-center px-3 py-2 bg-indigo-500 text-white text-sm sm:text-base rounded hover:bg-indigo-600 transition"
          >
            Explorer les collections
          </button>
        </div>
      </div>

      {/* Affichage des collections */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="p-4 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <CollectionsList collections={collections} />
        )}
      </div>

      {/* Catalogue de collections publiques */}
      <PublicCollectionsCatalog
        isOpen={showPublicCollectionsModal}
        onClose={handleClosePublicCollections}
        minSourcesRequired={MIN_SOURCES_REQUIRED}
        onFollowStatusChange={handleFollowStatusChange}
      />
    </div>
  );
};

export default Collections;
