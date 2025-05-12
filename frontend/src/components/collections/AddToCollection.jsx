import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';

/**
 * Composant pour ajouter une source à une ou plusieurs collections
 * @param {Object} props - Propriétés du composant
 * @param {string} props.sourceId - ID de la source à ajouter
 * @param {function} props.onClose - Fonction à appeler pour fermer le menu
 * @param {React.ReactNode} props.trigger - Élément déclencheur du menu
 */
const AddToCollection = ({ sourceId, onClose, trigger }) => {
  const {
    collections,
    loadCollections,
    loadingCollections,
    addSourceToCollection,
    createCollection,
  } = useContext(AppContext);

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const menuRef = useRef(null);

  // Charger les collections au montage
  useEffect(() => {
    if (isOpen) {
      loadCollections();
    }
  }, [isOpen, loadCollections]);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setError(null);
    setShowNewForm(false);
    setNewCollectionName('');
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  // Ajouter la source à une collection
  const handleAddToCollection = async (collectionId) => {
    try {
      setLoading(true);
      setError(null);
      await addSourceToCollection(collectionId, sourceId);
      handleClose();
    } catch (err) {
      setError("Impossible d'ajouter la source à cette collection");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle collection et y ajouter la source
  const handleCreateAndAdd = async (e) => {
    e.preventDefault();

    if (!newCollectionName.trim()) {
      setError('Le nom de la collection est requis');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Créer la collection
      const newCollection = await createCollection({
        name: newCollectionName,
        description: '',
        sources: [sourceId], // Ajouter directement la source
      });

      handleClose();
    } catch (err) {
      setError('Impossible de créer la collection');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Élément déclencheur (bouton ou icône) */}
      <div onClick={toggleMenu}>{trigger}</div>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">Ajouter à une collection</h3>
          </div>

          {/* Affichage d'erreur */}
          {error && <div className="p-3 text-xs text-red-600 bg-red-50">{error}</div>}

          {/* Formulaire pour nouvelle collection */}
          {showNewForm ? (
            <form onSubmit={handleCreateAndAdd} className="p-3 border-b border-gray-200">
              <input
                type="text"
                placeholder="Nom de la collection"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded mb-2"
                required
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Créer
                </button>
              </div>
            </form>
          ) : (
            <div className="p-3 border-b border-gray-200">
              <button
                onClick={() => setShowNewForm(true)}
                className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Nouvelle collection
              </button>
            </div>
          )}

          {/* Liste des collections existantes */}
          <div className="max-h-60 overflow-y-auto p-1">
            {loadingCollections || loading ? (
              <div className="p-3 flex justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : collections.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 text-center">
                Aucune collection existante
              </div>
            ) : (
              collections.map((collection) => {
                // Vérifier si la source est déjà dans cette collection
                const isSourceInCollection = collection.sources?.some(
                  (source) => source._id === sourceId || source === sourceId
                );

                return (
                  <div
                    key={collection._id}
                    className="px-3 py-2 hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div className="flex items-center flex-1">
                      <div
                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2"
                        style={{
                          backgroundImage: collection.imageUrl
                            ? `url(${collection.imageUrl})`
                            : 'none',
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
                      <span className="text-sm truncate">{collection.name}</span>
                    </div>
                    {isSourceInCollection ? (
                      <span className="text-xs text-green-600 px-2 py-1 bg-green-50 rounded-full">
                        Ajouté
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddToCollection(collection._id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Ajouter
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Lien vers la gestion des collections */}
          <div className="p-3 border-t border-gray-200">
            <Link
              to="/collections"
              className="text-xs text-blue-600 hover:text-blue-800"
              onClick={handleClose}
            >
              Gérer toutes mes collections
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCollection;
