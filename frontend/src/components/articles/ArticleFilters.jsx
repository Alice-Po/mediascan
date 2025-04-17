import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  CATEGORIES,
  ORIENTATIONS,
  getOrientationColor,
  getOrientationLabel,
} from '../../constants';
import { isLightColor } from '../../utils/colorUtils';

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

  // State local pour afficher/masquer les filtres sur mobile
  const [isExpanded, setIsExpanded] = useState(false);

  // Utilisation des catégories depuis le fichier de constantes
  const handleCategoryChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

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
    setFilters((prev) => ({
      ...prev,
      searchTerm: value,
    }));
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
      {/* Header séparé avec le bouton toggle */}
      <div className="border-b pb-2 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="font-medium">Filtres</h2>
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span
              className={`transform transition-transform block ${isExpanded ? 'rotate-180' : ''}`}
            >
              ▼
            </span>
          </button>
        </div>
      </div>

      {/* Contenu des filtres dans un conteneur séparé */}
      {isExpanded && (
        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
          {/* Teaser pour la future fonctionnalité */}
          <Accordion title="Catégories" defaultOpen={true}>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-200">
              <div className="flex items-center mb-2">
                <span className="text-blue-500 font-mono mr-2">🚧</span>
                <span className="bg-yellow-100 px-2 py-0.5 rounded-full text-xs font-mono text-yellow-800">
                  En développement
                </span>
              </div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Quelque chose de beaucoup plus cool qu'un filtre par catégorie arrive !
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Abonnez-vous à notre infolettre pour être informé lorsque cette fonctionnalité sera
                disponible !
              </p>
              <div className="font-mono text-xs text-gray-500"></div>
            </div>
          </Accordion>

          {/* Orientations politiques */}
          <Accordion title="Orientation politique">
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
          </Accordion>

          {/* Sources avec conteneur isolé */}
          <Accordion title="Sources">
            <div className="space-y-2">
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
          </Accordion>

          {/* Bouton de réinitialisation */}
          <div className="flex justify-end pt-2 border-t">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchTerm: '' }))}
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
