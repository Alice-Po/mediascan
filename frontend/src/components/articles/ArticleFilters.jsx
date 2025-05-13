import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { ORIENTATIONS } from '../../constants';
import { getOrientationColor, getOrientationLabel } from '../../constants';
import { isLightColor } from '../../utils/colorUtils';
import { useDebounce } from '../../hooks/useDebounce';
import { AuthContext } from '../../context/AuthContext';

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

// Composant pour une collection dépliable avec ses sources
const CollectionItem = ({
  collection,
  selectedCollection,
  selectedSource,
  onSelectCollection,
  expandedCollections,
  toggleCollection,
  getCreatorName,
  onSelectSource,
  userSources,
}) => {
  const isExpanded = expandedCollections.includes(collection._id);

  // S'assurer que collection.sources est un tableau
  const sources = collection.sources || [];

  // Déterminer si cette collection est la collection sélectionnée
  const isSelected = selectedCollection === collection._id;

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
          className={`mr-1.5 transform transition-transform text-xs ${
            isExpanded ? 'rotate-90' : ''
          } ${sources.length === 0 ? 'opacity-0' : 'text-gray-500'}`}
        >
          ▶
        </span>

        {/* Nom de la collection */}
        <div
          className="flex flex-col flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onSelectCollection(collection._id);
          }}
        >
          <div className="flex items-center">
            <div
              className="w-3.5 h-3.5 rounded-full mr-1.5"
              style={{
                backgroundColor: collection.colorHex || '#e5e7eb',
              }}
            />
            <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : ''}`}>
              {collection.name}
            </span>
          </div>

          {/* Information sur le créateur */}
          <span className="text-xs text-gray-500 ml-5">Par {getCreatorName(collection)}</span>
        </div>

        {/* Badge du nombre de sources */}
        <div className="ml-auto flex items-center text-xs">
          <span className="text-gray-400">
            {sources.length} {sources.length > 1 ? 'sources' : 'source'}
          </span>
        </div>
      </div>

      {/* Sources de la collection */}
      {isExpanded && sources.length > 0 && (
        <div className="ml-6 space-y-1 mt-1">
          {sources.map((source) => {
            const sourceId = source._id || source;
            const isSourceSelected = selectedSource === sourceId;

            // Trouver l'objet source complet si nous n'avons que l'ID
            const sourceObj =
              typeof source === 'string' || !source.name
                ? userSources.find((s) => s._id === sourceId) || { name: 'Source inconnue' }
                : source;

            return (
              <div
                key={sourceId}
                className={`flex items-center py-1 px-1 rounded cursor-pointer ${
                  isSourceSelected ? 'bg-blue-100 hover:bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={(e) => {
                  console.log('Clic sur la source dans CollectionItem:', sourceId, sourceObj.name);
                  e.stopPropagation(); // Empêcher l'événement de remonter
                  onSelectSource(sourceId);
                }}
              >
                <div className="flex items-center">
                  {sourceObj.faviconUrl ? (
                    <img src={sourceObj.faviconUrl} alt="" className="w-3.5 h-3.5 mr-1.5" />
                  ) : (
                    <div className="w-3.5 h-3.5 bg-gray-200 rounded-full mr-1.5" />
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
          })}
        </div>
      )}
    </div>
  );
};

/**
 * Composant de filtres pour les articles
 */
const ArticleFilters = () => {
  const { filters, setFilters, userSources, collections, loadCollections } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchTerm);
  const debouncedSearch = useDebounce(searchInput, 300);
  const [expandedCollections, setExpandedCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(filters.collection || null);
  const [selectedSource, setSelectedSource] = useState(null);

  // Charger les collections au montage du composant
  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

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

  // Gérer l'expansion/contraction des collections
  const toggleCollection = (collectionId) => {
    setExpandedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  // Handler pour sélectionner une collection
  const handleSelectCollection = (collectionId) => {
    // Si la collection était déjà sélectionnée, la désélectionner (tous les articles)
    if (selectedCollection === collectionId) {
      setSelectedCollection(null);
      setSelectedSource(null);
      setFilters((prev) => ({
        ...prev,
        collection: null,
        sources: userSources.map((s) => s._id), // Sélectionner toutes les sources
      }));
    } else {
      // Sélectionner la nouvelle collection
      setSelectedCollection(collectionId);
      setSelectedSource(null);

      // Trouver toutes les sources de cette collection
      const collection = collections.find((c) => c._id === collectionId);
      const collectionSources = collection ? (collection.sources || []).map((s) => s._id || s) : [];

      // Mettre à jour les filtres
      setFilters((prev) => ({
        ...prev,
        collection: collectionId,
        sources: collectionSources,
      }));
    }
  };

  // Handler pour sélectionner une source spécifique dans une collection
  const handleSelectSource = (sourceId) => {
    // S'assurer que sourceId est une chaîne de caractères
    const sourceIdString = String(sourceId);

    // Si la source est déjà sélectionnée, revenir à toute la collection
    if (selectedSource === sourceIdString) {
      setSelectedSource(null);
      // Trouver toutes les sources de la collection actuelle
      const collection = collections.find((c) => c._id === selectedCollection);
      const collectionSources = collection
        ? (collection.sources || []).map((s) => (typeof s === 'string' ? s : s._id))
        : [];

      setFilters((prev) => {
        const newFilters = {
          ...prev,
          sources: collectionSources,
        };
        return newFilters;
      });
    } else {
      // Sélectionner uniquement cette source
      setSelectedSource(sourceIdString);
      setFilters((prev) => {
        const newFilters = {
          ...prev,
          sources: [sourceIdString],
        };
        return newFilters;
      });
    }
  };

  // Sélectionner les sources sans collection
  const handleSelectUncategorized = () => {
    // Créer un ID virtuel pour les sources sans collection
    const uncategorizedId = 'uncategorized';

    // Si "Sans collection" était déjà sélectionné, désélectionner (tous les articles)
    if (selectedCollection === uncategorizedId) {
      setSelectedCollection(null);
      setSelectedSource(null);
      setFilters((prev) => ({
        ...prev,
        collection: null,
        sources: userSources.map((s) => s._id), // Sélectionner toutes les sources
      }));
    } else {
      // Sélectionner les sources sans collection
      setSelectedCollection(uncategorizedId);
      setSelectedSource(null);

      // Trouver toutes les sources sans collection
      const uncategorizedSources = userSources
        .filter((source) => !collections.some((c) => c.sources?.some((s) => s._id === source._id)))
        .map((s) => s._id);

      // Mettre à jour les filtres
      setFilters((prev) => ({
        ...prev,
        collection: uncategorizedId,
        sources: uncategorizedSources,
      }));
    }
  };

  // Handler pour sélectionner une source sans collection
  const handleSelectUncategorizedSource = (sourceId) => {
    // Si la source est déjà sélectionnée, revenir à toutes les sources sans collection
    if (selectedSource === sourceId) {
      console.log(
        'La source sans collection était déjà sélectionnée, revenir à toutes les sources sans collection'
      );
      setSelectedSource(null);

      // Récupérer toutes les sources sans collection
      const uncategorizedSources = userSources
        .filter((source) => !collections.some((c) => c.sources?.some((s) => s._id === source._id)))
        .map((s) => s._id);
      console.log('Sources sans collection:', uncategorizedSources);

      setFilters((prev) => {
        const newFilters = {
          ...prev,
          sources: uncategorizedSources,
        };
        console.log('Nouveaux filtres après désélection de source sans collection:', newFilters);
        return newFilters;
      });
    } else {
      // Sélectionner uniquement cette source
      setSelectedSource(sourceId);
      setFilters((prev) => {
        const newFilters = {
          ...prev,
          sources: [sourceId],
        };
        return newFilters;
      });
    }
  };

  // Structure sources par collection
  const uncategorizedSources = userSources.filter(
    (source) => !collections.some((c) => c.sources?.some((s) => s._id === source._id))
  );

  // Vérifier si les sources sans collection sont sélectionnées
  const isUncategorizedSelected = selectedCollection === 'uncategorized';

  // Fonction pour afficher le nom du créateur de la collection
  const getCreatorName = (collection) => {
    // Si la collection appartient à l'utilisateur courant
    if (user && collection.userId === user._id) {
      return 'vous';
    }
    // Si la collection a un creator défini
    if (collection.creator) {
      return collection.creator;
    }
    // Fallback
    return 'un utilisateur';
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

  // Gérer la recherche
  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchInput(value);
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

        <Accordion title="Collections" defaultOpen={true}>
          <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
            {/* Option pour "Toutes les collections" */}
            <div
              className={`flex items-center py-1.5 px-1 rounded cursor-pointer ${
                selectedCollection === null ? 'bg-blue-100 hover:bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelectCollection(null)}
            >
              <div className="flex items-center flex-1">
                <div
                  className="w-3.5 h-3.5 rounded-full mr-1.5"
                  style={{ backgroundColor: '#64748b' }}
                />
                <span
                  className={`text-sm font-medium ${
                    selectedCollection === null ? 'text-blue-700' : ''
                  }`}
                >
                  Toutes les collections
                </span>
              </div>
            </div>

            {/* Afficher les collections */}
            {collections.map((collection) => (
              <CollectionItem
                key={collection._id}
                collection={collection}
                selectedCollection={selectedCollection}
                selectedSource={selectedSource}
                onSelectCollection={handleSelectCollection}
                expandedCollections={expandedCollections}
                toggleCollection={toggleCollection}
                getCreatorName={getCreatorName}
                onSelectSource={handleSelectSource}
                userSources={userSources}
              />
            ))}

            {/* Sources sans collection */}
            {uncategorizedSources.length > 0 && (
              <div className="mt-2">
                <div
                  className={`flex items-center py-1.5 px-1 rounded cursor-pointer ${
                    isUncategorizedSelected ? 'bg-blue-100 hover:bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() =>
                    setExpandedCollections((prev) =>
                      prev.includes('uncategorized')
                        ? prev.filter((id) => id !== 'uncategorized')
                        : [...prev, 'uncategorized']
                    )
                  }
                >
                  {/* Icône pour déplier/replier */}
                  <span
                    className={`mr-1.5 transform transition-transform text-xs text-gray-500 ${
                      expandedCollections.includes('uncategorized') ? 'rotate-90' : ''
                    }`}
                  >
                    ▶
                  </span>

                  {/* Titre */}
                  <div
                    className="flex items-center flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectUncategorized();
                    }}
                  >
                    <div className="w-3.5 h-3.5 rounded-full mr-1.5 bg-gray-300" />
                    <span
                      className={`text-sm font-medium ${
                        isUncategorizedSelected ? 'text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      Sources sans collection
                    </span>
                  </div>

                  {/* Badge du nombre de sources */}
                  <div className="ml-auto flex items-center text-xs">
                    <span className="text-gray-400">
                      {uncategorizedSources.length}{' '}
                      {uncategorizedSources.length > 1 ? 'sources' : 'source'}
                    </span>
                  </div>
                </div>

                {/* Liste des sources sans collection */}
                {expandedCollections.includes('uncategorized') && (
                  <div className="ml-6 space-y-1 mt-1">
                    {uncategorizedSources.map((source) => {
                      const sourceId = source._id;
                      const isSourceSelected = selectedSource === sourceId;

                      console.log('Source sans collection dans la liste:', {
                        sourceId,
                        name: source.name,
                        isSelected: isSourceSelected,
                      });

                      return (
                        <div
                          key={sourceId}
                          className={`flex items-center py-1 px-1 rounded cursor-pointer ${
                            isSourceSelected ? 'bg-blue-100 hover:bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={(e) => {
                            console.log(
                              'Clic sur la source sans collection:',
                              sourceId,
                              source.name
                            );
                            e.stopPropagation(); // Empêcher la propagation
                            handleSelectUncategorizedSource(sourceId);
                          }}
                        >
                          <div className="flex items-center">
                            {source.faviconUrl ? (
                              <img src={source.faviconUrl} alt="" className="w-3.5 h-3.5 mr-1.5" />
                            ) : (
                              <div className="w-3.5 h-3.5 bg-gray-200 rounded-full mr-1.5" />
                            )}
                            <span
                              className={`text-sm truncate ${
                                isSourceSelected ? 'font-medium text-blue-700' : ''
                              }`}
                            >
                              {source.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </Accordion>
      </div>

      {/* Indicateur de filtres actifs */}
      {(filters.searchTerm ||
        filters.orientation.political.length > 0 ||
        selectedCollection !== null) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Filtres actifs</span>
            <button
              onClick={() => {
                setSearchInput('');
                setSelectedCollection(null);
                setSelectedSource(null);
                setFilters({
                  searchTerm: '',
                  sources: userSources.map((s) => s._id),
                  orientation: { political: [] },
                  collection: null,
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
