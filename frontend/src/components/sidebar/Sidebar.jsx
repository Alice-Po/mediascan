import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { useDebounce } from '../../hooks/useDebounce';
import { AuthContext } from '../../context/AuthContext';
import Badge from '../common/Badge';
import { GlobeIcon, LockIcon, SidebarToggleIcon } from '../common/icons';
import FilterCollectionItem from './FilterCollectionItem';
import SearchBar from './SearchBar';
import SavedArticles from './SavedArticles';

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
const Sidebar = () => {
  const {
    filters,
    setFilters,
    userSources,
    collections,
    loadCollections,
    isSidebarCollapsed,
    toggleSidebar,
  } = useContext(AppContext);
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

  // Fonction pour afficher le nom du créateur de la collection
  const getCreatorName = (collection) => {
    // Si la collection appartient à l'utilisateur courant
    if (user && collection.userId === user._id) {
      return 'vous';
    }

    // Utiliser la même approche que dans CollectionItem.jsx
    return collection.createdBy?.username || 'Utilisateur anonyme';
  };

  // Gérer la recherche
  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchInput(value);
  };

  // Effacer la recherche
  const clearSearch = () => {
    setSearchInput('');
    setFilters((prev) => ({ ...prev, searchTerm: '' }));
  };

  return (
    <div
      className={`h-full ${
        isSidebarCollapsed ? 'w-[60px]' : 'w-[320px]'
      } md:fixed md:top-[110px] md:bottom-0 md:left-0 md:overflow-y-auto md:pb-20 md:border-r md:border-gray-200 bg-white transition-all duration-300 ease-in-out relative`}
    >
      {/* Bouton de toggle pour la sidebar (version desktop) */}
      <button
        className="hidden md:flex absolute right-[10px] top-[10px] bg-white border border-gray-200 rounded-full p-1.5 shadow-md z-10 hover:bg-gray-50"
        onClick={toggleSidebar}
        aria-label={isSidebarCollapsed ? 'Déplier la sidebar' : 'Replier la sidebar'}
      >
        <SidebarToggleIcon collapsed={isSidebarCollapsed} className="h-4 w-4 text-gray-600" />
      </button>

      <div className={`${isSidebarCollapsed ? 'px-2 py-2' : 'p-4'}`}>
        {/* Contenu de la sidebar, visible uniquement quand déplié */}
        {!isSidebarCollapsed && (
          <>
            {/* Barre de recherche avec contexte */}
            <SearchBar
              searchInput={searchInput}
              handleSearch={handleSearch}
              clearSearch={clearSearch}
            />

            {/* Collections */}
            <Accordion title="Collections" defaultOpen={true}>
              <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
                {/* Afficher les collections */}
                {collections.map((collection) => (
                  <FilterCollectionItem
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
                    user={user}
                  />
                ))}
              </div>
            </Accordion>

            {/* Articles sauvegardés */}
            <SavedArticles />

            {/* Indicateur de filtres actifs */}
            {(filters.searchTerm || selectedCollection !== null) && (
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
          </>
        )}

        {/* Version condensée de la sidebar quand repliée */}
        {isSidebarCollapsed && (
          <div className="flex flex-col items-center space-y-4 pt-2">
            {/* <button
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  searchTerm: '',
                  collection: null,
                  sources: userSources.map((s) => s._id),
                }));
              }}
              title="Tous les articles"
            >
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 5-7-5M5 19h14a2 2 0 002-2V9a2 2 0 00-2-2h-2"
                />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100" title="Articles sauvegardés">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
