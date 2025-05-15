import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useDebounce } from '../../hooks/useDebounce';
import { AuthContext } from '../../context/AuthContext';
import { useDefaultCollection } from '../../context/DefaultCollectionContext';
import Badge from '../common/Badge';
import { GlobeIcon, LockIcon, SidebarToggleIcon, CloseIcon } from '../common/icons';
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
  const { defaultCollection, isDefaultCollection } = useDefaultCollection();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchTerm);
  const debouncedSearch = useDebounce(searchInput, 300);
  const [expandedCollections, setExpandedCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(filters.collection || null);
  const [selectedSource, setSelectedSource] = useState(null);

  // Désactiver le scroll du body quand la sidebar mobile est ouverte
  useEffect(() => {
    if (!isSidebarCollapsed && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarCollapsed]);

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
  const handleSelectCollection = useCallback(
    (collectionId) => {
      // Si la collection était déjà sélectionnée, vérifier si c'est la collection par défaut
      if (selectedCollection === collectionId) {
        // Si c'est la collection par défaut, ne pas la désélectionner
        if (defaultCollection && collectionId === defaultCollection._id) {
          return; // Ne rien faire, garder la collection par défaut sélectionnée
        }

        setSelectedCollection(null);
        setSelectedSource(null);
        setFilters((prev) => ({
          ...prev,
          collection: null,
          sources: userSources.map((s) => s._id), // Sélectionner toutes les sources
        }));

        // Mettre à jour l'URL pour supprimer le paramètre collection
        navigate('/app');
      } else {
        // Sélectionner la nouvelle collection
        setSelectedCollection(collectionId);
        setSelectedSource(null);

        // Trouver toutes les sources de cette collection
        const collection = collections.find((c) => c._id === collectionId);
        const collectionSources = collection
          ? (collection.sources || []).map((s) => s._id || s)
          : [];

        // Mettre à jour les filtres
        setFilters((prev) => ({
          ...prev,
          collection: collectionId,
          sources: collectionSources,
        }));

        // Mettre à jour l'URL avec le paramètre collection
        navigate(`/app?collection=${collectionId}`);
      }
    },
    [
      selectedCollection,
      defaultCollection,
      setSelectedSource,
      setFilters,
      userSources,
      navigate,
      collections,
    ]
  );

  // Effet pour sélectionner la collection par défaut si aucune collection n'est sélectionnée
  useEffect(() => {
    // Si aucune collection n'est sélectionnée et que le defaultCollection est chargé
    if (!selectedCollection && defaultCollection && collections.length > 0) {
      // Sélectionner la collection par défaut
      handleSelectCollection(defaultCollection._id);
    }
  }, [collections, defaultCollection, selectedCollection, handleSelectCollection]);

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

      // Mettre à jour l'URL avec juste la collection
      if (selectedCollection) {
        navigate(`/app?collection=${selectedCollection}`);
      }
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

      // Mettre à jour l'URL pour inclure la collection et la source
      if (selectedCollection) {
        navigate(`/app?collection=${selectedCollection}&source=${sourceIdString}`);
      }
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

  // Styles pour la version mobile et desktop
  const mobileStyles = !isSidebarCollapsed
    ? 'fixed inset-0 bg-white z-50 overflow-y-auto pb-16 transform transition-transform duration-300 ease-in-out translate-x-0'
    : 'fixed inset-0 bg-white z-50 overflow-y-auto pb-16 transform transition-transform duration-300 ease-in-out -translate-x-full';

  const desktopStyles = `h-full ${
    isSidebarCollapsed ? 'w-[60px]' : 'w-[320px]'
  } md:fixed md:top-[110px] md:bottom-0 md:left-0 md:overflow-y-auto md:pb-20 md:border-r md:border-gray-200 bg-white transition-all duration-300 ease-in-out relative`;

  // Trier les collections pour que la collection par défaut soit toujours en premier
  const sortedCollections = useMemo(() => {
    if (!defaultCollection || !collections.length) return collections;

    return [...collections].sort((a, b) => {
      if (a._id === defaultCollection._id) return -1;
      if (b._id === defaultCollection._id) return 1;
      return 0;
    });
  }, [collections, defaultCollection]);

  return (
    <>
      {/* Overlay pour la version mobile */}
      <div
        className={`md:hidden fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-40 ${
          !isSidebarCollapsed ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      {/* Version Mobile (plein écran quand ouverte) */}
      <div className={`md:hidden ${mobileStyles}`}>
        {/* En-tête mobile avec bouton de fermeture */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
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
              {sortedCollections.map((collection) => (
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
                    // Si une collection par défaut existe, la sélectionner
                    if (defaultCollection) {
                      setSelectedCollection(defaultCollection._id);
                      setSelectedSource(null);
                      setFilters({
                        searchTerm: '',
                        sources:
                          defaultCollection.sources?.map((s) =>
                            typeof s === 'string' ? s : s._id
                          ) || [],
                        collection: defaultCollection._id,
                      });
                      // Mettre à jour l'URL
                      navigate(`/app?collection=${defaultCollection._id}`);
                    } else {
                      // Sinon, réinitialiser complètement
                      setSelectedCollection(null);
                      setSelectedSource(null);
                      setFilters({
                        searchTerm: '',
                        sources: userSources.map((s) => s._id),
                        collection: null,
                      });
                      navigate('/app');
                    }
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Réinitialiser tout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Version Desktop (sidebar latérale) */}
      <div className={`hidden md:block ${desktopStyles}`}>
        {/* Bouton de toggle pour la sidebar (version desktop) */}
        <button
          className="hidden md:flex absolute right-[5px] top-[10px] bg-white border border-gray-200 rounded-full p-1.5 shadow-md z-10 hover:bg-gray-50"
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
                  {sortedCollections.map((collection) => (
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
                        // Si une collection par défaut existe, la sélectionner
                        if (defaultCollection) {
                          setSelectedCollection(defaultCollection._id);
                          setSelectedSource(null);
                          setFilters({
                            searchTerm: '',
                            sources:
                              defaultCollection.sources?.map((s) =>
                                typeof s === 'string' ? s : s._id
                              ) || [],
                            collection: defaultCollection._id,
                          });
                          // Mettre à jour l'URL
                          navigate(`/app?collection=${defaultCollection._id}`);
                        } else {
                          // Sinon, réinitialiser complètement
                          setSelectedCollection(null);
                          setSelectedSource(null);
                          setFilters({
                            searchTerm: '',
                            sources: userSources.map((s) => s._id),
                            collection: null,
                          });
                          navigate('/app');
                        }
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Réinitialiser tout
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Version condensée de la sidebar quand repliée */}
          {isSidebarCollapsed && <div className="flex flex-col items-center space-y-4 pt-2"></div>}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
