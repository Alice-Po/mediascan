import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

/**
 * Composant de filtres pour les articles
 */
const ArticleFilters = () => {
  const { filters, updateFilters, resetFilters, userSources } = useContext(AppContext);

  // State local pour afficher/masquer les filtres sur mobile
  const [isExpanded, setIsExpanded] = useState(false);

  // Catégories disponibles
  const categories = [
    'politique',
    'économie',
    'international',
    'société',
    'culture',
    'sport',
    'sciences',
    'tech',
    'environnement',
    'santé',
  ];

  // Options d'orientation
  const orientationOptions = {
    political: ['gauche', 'centre', 'droite'],
    type: ['mainstream', 'alternatif'],
    structure: ['institutionnel', 'indépendant'],
    scope: ['généraliste', 'spécialisé'],
  };

  // Toggle pour un filter de catégorie
  const toggleCategoryFilter = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    updateFilters({ categories: newCategories });
  };

  // Toggle pour un filtre d'orientation
  const toggleOrientationFilter = (type, value) => {
    const currentValues = filters.orientation[type] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    updateFilters({
      orientation: {
        ...filters.orientation,
        [type]: newValues,
      },
    });
  };

  // Toggle pour un filtre de source
  const toggleSourceFilter = (sourceId) => {
    const newSources = filters.sources.includes(sourceId)
      ? filters.sources.filter((id) => id !== sourceId)
      : [...filters.sources, sourceId];

    updateFilters({ sources: newSources });
  };

  // Toggle pour l'affichage des filtres (mobile)
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4">
      {/* En-tête des filtres (toujours visible) */}
      <div className="p-3 flex justify-between items-center cursor-pointer" onClick={toggleExpand}>
        <h2 className="font-medium text-gray-800">Filtres</h2>
        <div className="flex items-center">
          {filters.categories.length > 0 ||
          Object.values(filters.orientation).some((arr) => arr.length > 0) ? (
            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full mr-2">
              {filters.categories.length +
                Object.values(filters.orientation).reduce((sum, arr) => sum + arr.length, 0)}
            </span>
          ) : null}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Contenu des filtres (visible uniquement si développé) */}
      {isExpanded && (
        <div className="p-3 border-t border-gray-100">
          {/* Filtres de catégories */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Catégories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategoryFilter(category)}
                  className={`px-2 py-1 rounded-full text-xs ${
                    filters.categories.includes(category)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Filtres d'orientation */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Orientation</h3>

            {Object.entries(orientationOptions).map(([type, values]) => (
              <div key={type} className="mb-2">
                <h4 className="text-xs text-gray-500 mb-1 capitalize">
                  {type === 'political'
                    ? 'Politique'
                    : type === 'type'
                    ? 'Type'
                    : type === 'structure'
                    ? 'Structure'
                    : 'Portée'}
                </h4>

                <div className="flex flex-wrap gap-2">
                  {values.map((value) => (
                    <button
                      key={`${type}-${value}`}
                      onClick={() => toggleOrientationFilter(type, value)}
                      className={`px-2 py-1 rounded-full text-xs ${
                        filters.orientation[type]?.includes(value)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Filtres de sources */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Sources</h3>
            <div className="max-h-40 overflow-y-auto pr-2">
              {userSources.map((source) => (
                <div key={source.id} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    id={`source-${source.id}`}
                    checked={filters.sources.includes(source.id)}
                    onChange={() => toggleSourceFilter(source.id)}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`source-${source.id}`}
                    className="text-sm flex items-center cursor-pointer"
                  >
                    {source.faviconUrl && (
                      <img src={source.faviconUrl} alt="" className="w-4 h-4 mr-1" />
                    )}
                    {source.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Actions des filtres */}
          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleFilters;
