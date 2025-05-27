import React, { useState, useEffect } from 'react';
import { useCollections } from '../../hooks/useCollections';
import { useSources } from '../../hooks/useSources';
import AddSourceForm from './AddSourceForm';
import SourceCard from './SourceCard';

/**
 * Composant SourceCatalog - Affiche un catalogue de sources avec possibilité de recherche et d'ajout
 *
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {string} [props.collectionId] - ID de la collection courante (optionnel)
 * @param {Function} props.onClose - Callback pour fermer le catalogue
 * @param {boolean} [props.isOnboarding=false] - Indique si le catalogue est utilisé dans le contexte d'onboarding
 *
 * @example
 * <SourceCatalog
 *   collectionId="123"
 *   onClose={() => {}}
 *   isOnboarding={false}
 * />
 */
const SourceCatalog = ({ collectionId, onClose, isOnboarding = false }) => {
  // Hooks pour la gestion des collections et des sources
  const {
    loadCollectionById,
    addSourceToCollection,
    removeSourceFromCollection,
    loadOwnedCollections,
    error,
    loading,
    currentCollection,
    ownedCollections,
  } = useCollections();

  const { allSources, loadAllSources, loading: loadingSources, error: errorSources } = useSources();

  // États locaux
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSourceModal, setShowAddSourceModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // État local pour le chargement par source (Set pour performance)
  const [loadingSourceIds, setLoadingSourceIds] = useState(new Set());

  // Effets pour le chargement initial des données
  useEffect(() => {
    loadAllSources();
  }, [loadAllSources]);

  useEffect(() => {
    if (collectionId) {
      loadCollectionById(collectionId);
    }
  }, [collectionId, loadCollectionById]);

  useEffect(() => {
    loadOwnedCollections();
  }, [loadOwnedCollections]);

  /**
   * Filtre les sources en fonction du terme de recherche
   * @returns {Array} Liste des sources filtrées
   */
  const filteredSources = searchTerm
    ? allSources.filter(
        (source) =>
          source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          source.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          source.categories?.some((category) =>
            category.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    : allSources;

  /**
   * Gère l'ajout ou le retrait d'une source dans la collection
   * @param {Object} source - La source à ajouter/retirer
   * @param {boolean} isActive - Indique si la source est déjà dans la collection
   */
  const handleToggleSourceInCollection = async (source, isActive) => {
    if (!collectionId) return;
    setLoadingSourceIds((prev) => new Set(prev).add(source._id));
    try {
      if (isActive) {
        await removeSourceFromCollection(collectionId, source._id);
      } else {
        await addSourceToCollection(collectionId, source._id);
      }
      // Rafraîchir la collection après modification
      await loadCollectionById(collectionId);
    } finally {
      setLoadingSourceIds((prev) => {
        const next = new Set(prev);
        next.delete(source._id);
        return next;
      });
    }
  };

  /**
   * Vérifie si une source est présente dans la collection courante
   * @param {string} sourceId - ID de la source à vérifier
   * @returns {boolean} True si la source est dans la collection
   */
  const isSourceInCollection = (sourceId) => {
    return currentCollection?.sources?.some((s) => s && s._id === sourceId);
  };

  /**
   * Gère l'ajout d'une nouvelle source au catalogue
   * @param {Object} sourceData - Données de la nouvelle source
   */
  const handleSubmitSource = async (sourceData) => {
    // TODO: Implémenter la logique d'ajout d'une nouvelle source
    console.log("Ajout d'une nouvelle source:", sourceData);
  };

  return (
    <div className="p-2 sm:p-4">
      {/* Indicateur de chargement */}
      {loading && (
        <div className="flex justify-center items-center p-4 sm:p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm sm:text-base">{error}</p>
        </div>
      )}

      {/* Message si aucune source n'est disponible */}
      {!loading && !error && allSources.length === 0 && (
        <div className="p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            Aucune source disponible dans le catalogue.
          </p>
        </div>
      )}

      {/* Barre de recherche et bouton d'ajout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="relative w-full sm:w-2/3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une source..."
            className="w-full pl-9 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400 text-sm shadow-sm text-gray-900 placeholder-gray-400 bg-white"
            aria-label="Rechercher une source"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              aria-label="Effacer la recherche"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <button
          onClick={() => setShowAddSourceModal(true)}
          className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm rounded-md flex items-center justify-center sm:justify-start shadow-sm transition-colors"
        >
          <svg
            className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Ajouter une source
        </button>
      </div>

      {/* Compteur de résultats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-0">
          {filteredSources.length}{' '}
          {filteredSources.length > 1 ? 'sources trouvées' : 'source trouvée'}
          {searchTerm && ` pour "${searchTerm}"`}
        </p>
      </div>

      {/* Grille des sources */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 px-2 sm:px-0">
        {filteredSources.map((source) => {
          const isActive = isSourceInCollection(source._id);
          const loading = loadingSourceIds.has(source._id);
          return (
            <div
              key={source._id}
              className={`relative ${isActive ? 'border-2 border-blue-500 rounded-lg' : ''}`}
            >
              <SourceCard
                source={source}
                onToggleSourceInCollection={handleToggleSourceInCollection}
                isActive={isActive}
                enableAddSourceToCollectionAction={!isOnboarding}
                loading={loading}
              />
            </div>
          );
        })}
      </div>

      {/* Message si aucun résultat de recherche */}
      {filteredSources.length === 0 && searchTerm && (
        <div className="p-4 sm:p-8 bg-gray-50 border border-gray-200 rounded-lg text-center my-4 sm:my-8 mx-2 sm:mx-0">
          <p className="text-gray-600 mb-2 text-sm sm:text-base">
            Aucune source ne correspond à votre recherche.
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Effacer la recherche
          </button>
        </div>
      )}

      {/* Modale d'ajout de source */}
      {showAddSourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 backdrop-blur-sm bg-white/30 animate-fadeIn">
          <div className="bg-white rounded-lg w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-auto m-2 sm:m-0">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <h3 className="text-base sm:text-lg font-medium">Ajouter une nouvelle source</h3>
              <button
                onClick={() => setShowAddSourceModal(false)}
                className="text-white/80 hover:text-white"
                aria-label="Fermer"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-0">
              <AddSourceForm
                onSubmit={handleSubmitSource}
                onCancel={() => setShowAddSourceModal(false)}
                formErrors={formErrors}
                loading={false}
                collections={ownedCollections}
                hideCollectionSection={isOnboarding}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourceCatalog;
