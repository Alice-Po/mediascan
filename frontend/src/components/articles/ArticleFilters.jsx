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
    <div className="border-b border-gray-200 py-3">
      <button
        className="w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-sm text-gray-700">{title}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <div
        className={`pt-3 transition-all duration-200 ease-in-out ${isOpen ? 'block' : 'hidden'}`}
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
    <div className="h-full">
      {/* Barre de recherche avec contexte */}
      <div className="mb-6">
        <div className="relative">
          <input
            id="search"
            type="text"
            value={searchInput}
            onChange={handleSearch}
            placeholder="Rechercher dans mes articles..."
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
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput('');
                setFilters((prev) => ({ ...prev, searchTerm: '' }));
              }}
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

      {/* Filtres dans des accordéons style Feedly */}
      <div className="space-y-1">
        <Accordion title="Orientation politique" defaultOpen={true}>
          <div className="flex flex-wrap gap-2">
            {Object.entries(ORIENTATIONS.political).map(([key, value]) => {
              const bgColor = getOrientationColor(key);
              const isLight = isLightColor(bgColor);
              const textColor = isLight ? '#000000' : '#ffffff';

              return (
                <button
                  key={key}
                  onClick={() => handlePoliticalOrientationChange(key)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors duration-200`}
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
        </Accordion>

        <Accordion title={`Mes sources (${userSources.length})`} defaultOpen={true}>
          <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
            {userSources.map((source) => (
              <label
                key={source._id}
                className="flex items-center py-1.5 px-1 hover:bg-gray-50 rounded cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={filters.sources.includes(source._id)}
                  onChange={(e) => handleSourceChange(e, source._id)}
                  className="mr-2 h-3.5 w-3.5"
                />
                <div className="flex items-center">
                  {source.faviconUrl && (
                    <img src={source.faviconUrl} alt="" className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  <span className="text-sm truncate">{source.name}</span>
                </div>
              </label>
            ))}
          </div>
        </Accordion>
      </div>

      {/* Indicateur de filtres actifs */}
      {(filters.searchTerm ||
        filters.orientation.political.length > 0 ||
        filters.sources.length !== userSources.length) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Filtres actifs</span>
            <button
              onClick={() => {
                setSearchInput('');
                setFilters({
                  searchTerm: '',
                  sources: userSources.map((s) => s._id),
                  orientation: { political: [] },
                });
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Réinitialiser tout
            </button>
          </div>
        </div>
      )}

      {/* Bouton d'expansion pour mobile uniquement */}
      <div className="mt-4 lg:hidden">
        <button
          className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Masquer les filtres' : 'Plus de filtres'}
        </button>
      </div>
    </div>
  );
};

export default ArticleFilters;
