import React, { useContext, useState, useEffect } from 'react';
import { GlobeIcon, LockIcon, StarIcon } from '../common/icons';
import { AppContext } from '../../context/AppContext';
import { AuthContext } from '../../context/AuthContext';
import { useDefaultCollection } from '../../context/DefaultCollectionContext';
import { useNavigate } from 'react-router-dom';

/**
 * Composant pour une collection dépliable avec ses sources dans le filtre
 * @param {Object} props
 * @param {Object} props.collection - La collection à afficher
 */
const FilterCollectionItem = ({ collection }) => {
  const { filters, setFilters, toggleSidebar, allSources, userSources } = useContext(AppContext);
  const { defaultCollection, isDefaultCollection } = useDefaultCollection();

  const navigate = useNavigate();

  // Expansion locale
  const [isExpanded, setIsExpanded] = useState(false);

  // Sélection locale
  const isSelected = filters.collection === collection._id;
  const [selectedSource, setSelectedSource] = useState(null);

  // Gérer l'expansion/repli
  const handleToggleExpand = () => setIsExpanded((prev) => !prev);

  // Fonction utilitaire pour collapse la sidebar en mobile
  const collapseSidebarIfMobile = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile && typeof toggleSidebar === 'function') {
      toggleSidebar();
    }
  };

  // Handler pour sélectionner une collection
  const handleCollectionClick = (e) => {
    e.stopPropagation();
    if (isSelected) {
      // Si c'est la collection par défaut, ne pas la désélectionner
      if (defaultCollection && collection._id === defaultCollection._id) return;
      setFilters((prev) => ({
        ...prev,
        collection: null,
        sources: userSources.map((s) => s._id),
      }));
      setSelectedSource(null);
      navigate('/app');
    } else {
      // Sélectionner la collection
      const collectionSources = (collection.sources || []).map((s) => s._id || s);
      setFilters((prev) => ({
        ...prev,
        collection: collection._id,
        sources: collectionSources,
      }));
      setSelectedSource(null);
      navigate(`/app?collection=${collection._id}`);
    }
    collapseSidebarIfMobile();
  };

  // Handler pour sélectionner une source spécifique dans la collection
  const handleSourceClick = (e, sourceId) => {
    e.stopPropagation();
    const sourceIdString = String(sourceId);
    if (selectedSource === sourceIdString) {
      setSelectedSource(null);
      const collectionSources = (collection.sources || []).map((s) =>
        typeof s === 'string' ? s : s._id
      );
      setFilters((prev) => ({
        ...prev,
        sources: collectionSources,
      }));
      navigate(`/app?collection=${collection._id}`);
    } else {
      setSelectedSource(sourceIdString);
      setFilters((prev) => ({
        ...prev,
        sources: [sourceIdString],
      }));
      navigate(`/app?collection=${collection._id}&source=${sourceIdString}`);
    }
    collapseSidebarIfMobile();
  };

  // Sélectionner la collection par défaut si aucune n'est sélectionnée (sans écraser la sélection utilisateur)
  useEffect(() => {
    if (!filters.collection && defaultCollection) {
      setFilters((prev) => ({
        ...prev,
        collection: defaultCollection._id,
        sources: (defaultCollection.sources || []).map((s) => (typeof s === 'string' ? s : s._id)),
      }));
      setSelectedSource(null);
      navigate(`/app?collection=${defaultCollection._id}`);
    }
    // eslint-disable-next-line
  }, [defaultCollection, filters.collection]);

  // S'assurer que collection.sources est un tableau
  const sources = collection.sources || [];
  const isDefault = isDefaultCollection(collection._id);
  const isMobile = window.innerWidth < 768;

  // Fonction robuste pour afficher le nom du créateur
  const getCreatorNameRobust = (collection) => {
    return collection.creator || collection.createdBy?.username || 'Utilisateur anonyme';
  };

  // Trouver le nom de la source dans userSources ou allSources
  const getSourceName = (sourceId) => {
    const foundUserSource = userSources.find((s) => s._id === sourceId);
    if (foundUserSource) return foundUserSource.name;
    if (allSources) {
      const foundAllSource = allSources.find((s) => s._id === sourceId);
      if (foundAllSource) return foundAllSource.name;
    }
    return 'Source inconnue';
  };

  return (
    <div className="mb-1">
      <div
        className={`flex items-center py-1.5 px-1 rounded cursor-pointer ${
          isSelected
            ? 'bg-blue-100 hover:bg-blue-50'
            : isDefault
            ? 'bg-yellow-50 hover:bg-yellow-100'
            : 'hover:bg-gray-50'
        }`}
        onClick={handleToggleExpand}
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
        <div className="flex-1 min-w-0" onClick={handleCollectionClick}>
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
              {isDefault && (
                <span className="inline-flex ml-1.5 items-center">
                  <StarIcon className="h-3.5 w-3.5 text-yellow-500" />
                </span>
              )}
            </span>
          </div>

          {/* Information sur le créateur et indicateur pour les collections publiques */}
          <div className="flex flex-wrap items-center ml-5 mt-0.5 gap-1.5 overflow-hidden">
            <span className="text-xs text-gray-500 whitespace-nowrap text-ellipsis overflow-hidden max-w-full">
              Par {getCreatorNameRobust(collection)}
            </span>
            <div className="flex gap-1.5 flex-shrink-0 ml-auto">
              {collection.isPublic && user && collection.userId !== user._id && (
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

              // Trouver le nom de la source dans userSources ou allSources
              const sourceName = getSourceName(sourceId);

              // Trouver l'objet source complet pour l'icône
              const sourceObj =
                userSources.find((s) => s._id === sourceId) ||
                (allSources ? allSources.find((s) => s._id === sourceId) : null) ||
                {};

              return (
                <div
                  key={`${sourceId}-${collection._id}`}
                  className={`flex items-center py-1 px-1 rounded cursor-pointer ${
                    isSourceSelected ? 'bg-blue-100 hover:bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={(e) => handleSourceClick(e, sourceId)}
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
                      {sourceName}
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
