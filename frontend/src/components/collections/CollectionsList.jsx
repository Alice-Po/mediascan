import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { generateColorFromId } from '../../utils/colorUtils';

/**
 * Composant pour afficher la liste des collections de l'utilisateur
 */
const CollectionsList = () => {
  const { collections, loadingCollections, filterByCollection, filters, deleteCollection } =
    useContext(AppContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);

  const handleDeleteClick = (e, collection) => {
    e.stopPropagation();
    setCollectionToDelete(collection);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!collectionToDelete) return;

    try {
      await deleteCollection(collectionToDelete._id);
      setShowDeleteModal(false);
      setCollectionToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCollectionToDelete(null);
  };

  if (loadingCollections) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500 mb-3">Vous n'avez pas encore de collections</p>
        <Link
          to="/collections/new"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Créer une collection
        </Link>
      </div>
    );
  }

  return (
    <div className="collections-list">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-lg font-semibold">Mes Collections</h2>
        <Link
          to="/collections/new"
          className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          <span className="hidden sm:inline">Nouvelle collection</span>
          <span className="sm:hidden">+</span>
        </Link>
      </div>

      <div className="divide-y divide-gray-200">
        {collections.map((collection) => (
          <div
            key={collection._id}
            className={`p-3 hover:bg-gray-50 cursor-pointer transition ${
              filters.collection === collection._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
            onClick={() => filterByCollection(collection._id)}
          >
            <div className="flex items-center space-x-3">
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
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{collection.name}</p>
                <p className="text-xs text-gray-500">
                  {collection.sources?.length || 0} source
                  {collection.sources?.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex space-x-1">
                <Link
                  to={`/collections/${collection._id}`}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </Link>
                <Link
                  to={`/collections/edit/${collection._id}`}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </Link>
                <button
                  className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-gray-100"
                  onClick={(e) => handleDeleteClick(e, collection)}
                  title="Supprimer cette collection"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bouton pour réinitialiser les filtres si une collection est sélectionnée */}
      {filters.collection && (
        <div className="mt-2 px-4">
          <button
            onClick={() => filterByCollection(null)}
            className="w-full py-2 text-xs text-blue-500 hover:text-blue-700 transition"
          >
            Voir toutes les sources
          </button>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && collectionToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer la collection{' '}
              <span className="font-semibold">{collectionToDelete.name}</span> ? Cette action est
              irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsList;
