import React, { useState, useEffect } from 'react';
import { fetchAllSources, createSource } from '../../api/sourcesApi';
import AddSourceForm from './AddSourceForm';
import SourceCard from './SourceCard';

/**
 * Composant qui affiche un catalogue de toutes les sources disponibles
 * avec la possibilité de les ajouter à une collection
 */
const SourceCatalogModal = ({
  isOpen,
  onClose,
  onAddToCollection,
  collectionSources = [], // Sources déjà dans la collection
  userCollections = [], // Collections de l'utilisateur
  isOnboarding = false, // Nouvelle prop pour le contexte d'onboarding
}) => {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSourceModal, setShowAddSourceModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    const loadSources = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchAllSources();
        const sourceData = response.data || response;
        if (!Array.isArray(sourceData)) {
          setError('Format de données invalide reçu du serveur');
          return;
        }
        setSources(sourceData);
      } catch (err) {
        setError('Impossible de charger le catalogue des sources. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    loadSources();
  }, [isOpen]);

  const reloadSources = async () => {
    try {
      setLoading(true);
      const response = await fetchAllSources();
      const sourceData = response.data || response;
      if (!Array.isArray(sourceData)) return;
      setSources(sourceData);
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  const filteredSources = searchTerm
    ? sources.filter(
        (source) =>
          source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          source.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          source.categories?.some((category) =>
            category.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    : sources;

  const isSourceInCollection = (sourceId) => {
    return collectionSources.some(
      (source) => (typeof source === 'string' ? source : source._id) === sourceId
    );
  };

  const handleAddToCollection = (source) => {
    if (onAddToCollection) {
      onAddToCollection(source);
    }
  };

  const handleSubmitSource = async (sourceData) => {
    try {
      const response = await createSource(sourceData);
      if (!response.success) {
        throw new Error(response.message || 'Erreur lors de la création de la source');
      }
      setShowAddSourceModal(false);
      setFormErrors({});
      await reloadSources();
    } catch (error) {
      setFormErrors(error.response?.data?.errors || {});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
        {/* Header sticky complet */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-500 to-purple-600 text-white backdrop-blur-sm border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg sm:text-xl font-medium">Catalogue des sources</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white ml-auto"
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
          {/* Barre de recherche sticky dans le header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 pb-4">
            <div className="relative w-full sm:w-2/3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher une source..."
                className="w-full pl-9 pr-4 py-2.5 sm:py-3 border border-white/70 rounded-lg focus:ring focus:ring-blue-200 focus:border-white text-sm shadow-sm text-white placeholder-white bg-white/10"
                aria-label="Rechercher une source"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white hover:text-gray-200"
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 pb-2">
            <p className="text-xs sm:text-sm text-white mb-2 sm:mb-0">
              {filteredSources.length}{' '}
              {filteredSources.length > 1 ? 'sources trouvées' : 'source trouvée'}
              {searchTerm && ` pour "${searchTerm}"`}
            </p>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="p-2 sm:p-4">
          {/* Afficher un indicateur de chargement */}
          {loading && (
            <div className="flex justify-center items-center p-4 sm:p-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Afficher un message d'erreur */}
          {error && (
            <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm sm:text-base">{error}</p>
              <button
                className="mt-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                onClick={() => window.location.reload()}
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Afficher un message si aucune source n'est disponible */}
          {!loading && !error && sources.length === 0 && (
            <div className="p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <p className="text-gray-600 text-sm sm:text-base">
                Aucune source disponible dans le catalogue.
              </p>
            </div>
          )}

          {/* Liste des sources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 px-2 sm:px-0">
            {filteredSources.map((source) => {
              const isInCollection = isSourceInCollection(source._id);
              return (
                <div
                  key={source._id}
                  className={`relative ${
                    isInCollection ? 'border-2 border-blue-500 rounded-lg' : ''
                  }`}
                >
                  <SourceCard
                    source={source}
                    onAddToCollection={() => handleAddToCollection(source)}
                    isActive={isInCollection}
                    enableAddSourceToCollectionAction={!isOnboarding}
                  />
                </div>
              );
            })}
          </div>

          {/* Message si aucun résultat */}
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
        </div>

        {/* Modale pour le formulaire d'ajout de source */}
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
                  collections={userCollections}
                  hideCollectionSection={isOnboarding}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SourceCatalogModal;
