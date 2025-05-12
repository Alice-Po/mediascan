import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

/**
 * Composant de menu déroulant pour filtrer les articles par collection
 */
const CollectionDropdown = () => {
  const { collections, loadingCollections, loadCollections, filterByCollection, filters } =
    useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Charger les collections au montage
  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Trouver la collection active
  const activeCollection = filters.collection
    ? collections.find((c) => c._id === filters.collection)
    : null;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Bouton déclencheur du menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
      >
        <span className="mr-2 truncate max-w-[150px] inline-block">
          {activeCollection ? activeCollection.name : 'Toutes les sources'}
        </span>
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white z-50">
          <div className="py-1 overflow-y-auto max-h-60">
            {/* Option pour toutes les sources */}
            <button
              onClick={() => {
                filterByCollection(null);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm ${
                !filters.collection
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Toutes les sources
            </button>

            <div className="border-t border-gray-100 my-1"></div>

            {/* Options pour chaque collection */}
            {loadingCollections ? (
              <div className="px-4 py-2 text-sm text-gray-500 flex justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : collections.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">Aucune collection</div>
            ) : (
              collections.map((collection) => (
                <button
                  key={collection._id}
                  onClick={() => {
                    filterByCollection(collection._id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center ${
                    filters.collection === collection._id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2"
                    style={{
                      backgroundImage: collection.imageUrl ? `url(${collection.imageUrl})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!collection.imageUrl && (
                      <span className="text-gray-500 text-xs">
                        {collection.name.substring(0, 1).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="truncate">{collection.name}</span>
                </button>
              ))
            )}

            <div className="border-t border-gray-100 my-1"></div>

            {/* Lien pour gérer les collections */}
            <Link
              to="/collections"
              className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
              onClick={() => setIsOpen(false)}
            >
              Gérer les collections
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionDropdown;
