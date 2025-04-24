import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { ORIENTATIONS } from '../../constants';
import { getOrientationColor, getOrientationLabel } from '../../constants';
import { isLightColor } from '../../utils/colorUtils';
import { useDebounce } from '../../hooks/useDebounce';

// Composant Accordion réutilisable
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg">
      <button
        className="w-full px-4 py-2 flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-t-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{title}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <div
        className={`px-4 py-2 transition-all duration-200 ease-in-out ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * Composant de filtres pour les articles
 */
const ArticleFilters = () => {
  const { filters, setFilters, userSources } = useContext(AppContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchTerm);
  const debouncedSearch = useDebounce(searchInput, 300);

  // Mettre à jour les filtres quand la valeur debouncée change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: debouncedSearch,
    }));
  }, [debouncedSearch, setFilters]);

  // Gestion des filtres d'orientation
  const handleOrientationChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      orientation: {
        ...prev.orientation,
        [type]: prev.orientation[type]?.includes(value)
          ? prev.orientation[type].filter((v) => v !== value)
          : [...(prev.orientation[type] || []), value],
      },
    }));
  };

  // Gestion des sources
  const handleSourceChange = (e, sourceId) => {
    e.stopPropagation();
    setFilters((prev) => ({
      ...prev,
      sources: prev.sources.includes(sourceId)
        ? prev.sources.filter((id) => id !== sourceId)
        : [...prev.sources, sourceId],
    }));
  };

  // Gérer la recherche
  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchInput(value);
  };

  // Nouveau handler pour les orientations politiques
  const handlePoliticalOrientationChange = (orientation) => {
    setFilters((prev) => ({
      ...prev,
      orientation: {
        ...prev.orientation,
        political: prev.orientation.political?.includes(orientation)
          ? prev.orientation.political.filter((v) => v !== orientation)
          : [...(prev.orientation.political || []), orientation],
      },
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {/* En-tête des filtres avec explication */}
      <div className="border-b pb-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Filtrer mes articles</h2>
          <button
            className="p-2 hover:bg-gray-100 rounded-full lg:hidden"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span
              className={`transform transition-transform block ${isExpanded ? 'rotate-180' : ''}`}
            >
              ▼
            </span>
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Affinez les articles de vos {userSources.length} sources sélectionnées
        </p>
      </div>

      {/* Barre de recherche avec contexte */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Rechercher dans mes articles
        </label>
        <div className="relative">
          <input
            id="search"
            type="text"
            value={searchInput}
            onChange={handleSearch}
            placeholder="Ex: climat, économie, europe..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
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
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput('');
                setFilters((prev) => ({ ...prev, searchTerm: '' }));
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <p className="mt-1 text-xs text-gray-500">
          {searchInput
            ? 'Recherche dans les titres et le contenu des articles'
            : "La recherche s'effectue uniquement dans les articles de vos sources"}
        </p>
      </div>

      {/* Filtres toujours visibles sur desktop */}
      <div className={`space-y-4 lg:block ${isExpanded ? 'block' : 'hidden'}`}>
        {/* Orientations politiques */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Orientation politique</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(ORIENTATIONS.political).map(([key, value]) => {
              const bgColor = getOrientationColor(key);
              const isLight = isLightColor(bgColor);
              const textColor = isLight ? '#000000' : '#ffffff';

              return (
                <button
                  key={key}
                  onClick={() => handlePoliticalOrientationChange(key)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors duration-200`}
                  style={{
                    backgroundColor: filters.orientation.political?.includes(key)
                      ? bgColor
                      : 'transparent',
                    color: filters.orientation.political?.includes(key) ? textColor : '#666666',
                    border: `1px solid ${bgColor}`,
                  }}
                >
                  {value.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sources */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Mes sources ({userSources.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {userSources.map((source) => (
              <label
                key={source._id}
                className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.sources.includes(source._id)}
                  onChange={(e) => handleSourceChange(e, source._id)}
                  className="mr-2"
                />
                <div className="flex items-center">
                  {source.faviconUrl && (
                    <img src={source.faviconUrl} alt="" className="w-4 h-4 mr-1" />
                  )}
                  <span className="text-sm">{source.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Indicateur de filtres actifs */}
        {(filters.searchTerm ||
          filters.orientation.political.length > 0 ||
          filters.sources.length !== userSources.length) && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Filtres actifs</span>
              <button
                onClick={() => {
                  setSearchInput('');
                  setFilters({
                    searchTerm: '',
                    sources: userSources.map((s) => s._id),
                    orientation: { political: [] },
                  });
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Réinitialiser tout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleFilters;
