import React from 'react';
import { GlobeIcon, LockIcon } from '../common/icons';

/**
 * Composant pour une collection dépliable avec ses sources dans le filtre
 */
const FilterCollectionItem = ({
  collection,
  selectedCollection,
  selectedSource,
  onSelectCollection,
  expandedCollections,
  toggleCollection,
  getCreatorName,
  onSelectSource,
  userSources,
  user,
}) => {
  const isExpanded = expandedCollections.includes(collection._id);

  // S'assurer que collection.sources est un tableau
  const sources = collection.sources || [];

  // Déterminer si cette collection est la collection sélectionnée
  const isSelected = selectedCollection === collection._id;

  // Déterminer si c'est une collection publique que l'utilisateur suit
  const isPublicFollowed = collection.isPublic && user && collection.userId !== user._id;

  return (
    <div className="mb-1">
      <div
        className={`flex items-center py-1.5 px-1 rounded cursor-pointer ${
          isSelected ? 'bg-blue-100 hover:bg-blue-50' : 'hover:bg-gray-50'
        }`}
        onClick={() => toggleCollection(collection._id)}
      >
        {/* Icône pour déplier/replier */}
        <span
          className={`mr-1 transform transition-transform text-xs flex-shrink-0 flex items-center ${
            isExpanded ? 'rotate-90' : ''
          } ${sources.length === 0 ? 'opacity-0' : 'text-gray-500'}`}
        >
          ▶
        </span>

        {/* Conteneur principal incluant l'icône de couleur et le nom */}
        <div
          className="flex-1 min-w-0"
          onClick={(e) => {
            e.stopPropagation();
            onSelectCollection(collection._id);
          }}
        >
          {/* Première ligne avec le nom et l'icône de couleur */}
          <div className="flex items-center">
            <div
              className="w-3.5 h-3.5 rounded-full flex-shrink-0 mr-1.5"
              style={{
                backgroundColor: collection.colorHex || '#e5e7eb',
              }}
            />
            <span
              className={`text-sm font-medium overflow-hidden whitespace-nowrap text-ellipsis ${
                isSelected ? 'text-blue-700' : ''
              }`}
            >
              {collection.name}

              {collection.isPublic ? (
                <span className="inline-flex ml-1.5 items-center">
                  <GlobeIcon />
                </span>
              ) : (
                <span className="inline-flex ml-1.5 items-center">
                  <LockIcon />
                </span>
              )}
            </span>
          </div>

          {/* Information sur le créateur et indicateur pour les collections publiques */}
          <div className="flex flex-wrap items-center ml-5 mt-0.5 gap-1.5 overflow-hidden">
            <span className="text-xs text-gray-500 whitespace-nowrap text-ellipsis overflow-hidden max-w-full">
              Par {getCreatorName(collection)}
            </span>
            <div className="flex gap-1.5 flex-shrink-0 ml-auto">
              {isPublicFollowed && (
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-800 font-medium whitespace-nowrap">
                  Suivi
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Badge du nombre de sources */}
        <div className="ml-auto flex items-center text-xs flex-shrink-0">
          <span className="text-gray-400 whitespace-nowrap">
            {sources.length} {sources.length > 1 ? 'sources' : 'source'}
          </span>
        </div>
      </div>

      {/* Sources de la collection */}
      {isExpanded && sources.length > 0 && (
        <div className="ml-6 space-y-1 mt-1">
          {/* Utiliser un Set pour dédupliquer les sources */}
          {Array.from(new Set(sources.map((s) => (typeof s === 'string' ? s : s._id)))).map(
            (sourceId) => {
              const isSourceSelected = selectedSource === sourceId;

              // Trouver l'objet source complet
              const sourceObj = userSources.find((s) => s._id === sourceId) || {
                name: 'Source inconnue',
              };

              return (
                <div
                  key={`${sourceId}-${collection._id}`} // Utiliser une clé composée
                  className={`flex items-center py-1 px-1 rounded cursor-pointer ${
                    isSourceSelected ? 'bg-blue-100 hover:bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSource(sourceId);
                  }}
                >
                  <div className="flex items-center min-w-0 w-full">
                    {sourceObj.faviconUrl ? (
                      <img
                        src={sourceObj.faviconUrl}
                        alt=""
                        className="w-3.5 h-3.5 mr-1.5 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-3.5 h-3.5 bg-gray-200 rounded-full mr-1.5 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm truncate ${
                        isSourceSelected ? 'font-medium text-blue-700' : ''
                      }`}
                    >
                      {sourceObj.name}
                    </span>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

export default FilterCollectionItem;
