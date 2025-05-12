import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

/**
 * Composant pour afficher la liste des collections de l'utilisateur
 */
const CollectionsList = () => {
  const { collections, loadingCollections, filterByCollection, filters } = useContext(AppContext);

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
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
                style={{
                  backgroundImage: collection.imageUrl ? `url(${collection.imageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!collection.imageUrl && (
                  <span className="text-gray-500 text-xs">
                    {collection.name.substring(0, 2).toUpperCase()}
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
                  to={`/collections/${collection._id}/edit`}
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
    </div>
  );
};

export default CollectionsList;
