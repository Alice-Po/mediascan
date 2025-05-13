import React, { useState, useEffect } from 'react';
import { fetchAllSources } from '../../api/sourcesApi';
import { CollectibleSourceItem } from './SourceItem';

/**
 * Composant qui affiche un catalogue de toutes les sources disponibles
 * avec la possibilité de les ajouter à une collection
 */
const SourceCatalog = ({ onAddToCollection, userSources = [] }) => {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Charger toutes les sources disponibles au montage du composant
  useEffect(() => {
    const loadSources = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchAllSources();

        // Vérifier la structure de la réponse
        const sourceData = response.data || response;
        setSources(Array.isArray(sourceData) ? sourceData : []);
      } catch (err) {
        console.error('Erreur lors du chargement des sources:', err);
        setError('Impossible de charger le catalogue des sources. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    loadSources();
  }, []);

  // Filtrer les sources en fonction du terme de recherche
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

  // Vérifier si une source est déjà activée par l'utilisateur
  const isSourceActive = (sourceId) => {
    return userSources.some((userSource) => userSource._id === sourceId);
  };

  // Gérer l'ajout d'une source à une collection
  const handleAddToCollection = (source) => {
    if (onAddToCollection) {
      onAddToCollection(source);
    } else {
      console.log("Fonctionnalité d'ajout à une collection non implémentée", source);
    }
  };

  // Afficher un indicateur de chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Afficher un message si aucune source n'est disponible
  if (sources.length === 0) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <p className="text-gray-600">Aucune source disponible dans le catalogue.</p>
      </div>
    );
  }

  return (
    <div className="source-catalog">
      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une source..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 text-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400"
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
      </div>

      {/* Compteur de résultats */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {filteredSources.length}{' '}
          {filteredSources.length > 1 ? 'sources trouvées' : 'source trouvée'}
          {searchTerm && ` pour "${searchTerm}"`}
        </p>
      </div>

      {/* Liste des sources */}
      <div className="space-y-4">
        {filteredSources.map((source) => (
          <div key={source._id} className="relative">
            {isSourceActive(source._id) && (
              <div className="absolute top-0 right-0 mt-2 mr-2 z-10">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Activée
                </span>
              </div>
            )}
            <CollectibleSourceItem
              source={source}
              onAddToCollection={() => handleAddToCollection(source)}
            />
          </div>
        ))}
      </div>

      {/* Message si aucun résultat */}
      {filteredSources.length === 0 && searchTerm && (
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-gray-600">Aucune source ne correspond à votre recherche.</p>
        </div>
      )}
    </div>
  );
};

export default SourceCatalog;
