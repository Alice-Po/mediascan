import React, { useState, useContext, useEffect, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { useDebounce } from '../../hooks/useDebounce';
import { AuthContext } from '../../context/AuthContext';
import { useDefaultCollection } from '../../context/DefaultCollectionContext';
import { SidebarToggleIcon, CloseIcon } from '../common/icons';
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
  const { filters, setFilters, userSources, collections, isSidebarCollapsed, toggleSidebar } =
    useContext(AppContext);
  const { user } = useContext(AuthContext);
  const { defaultCollection } = useDefaultCollection();
  const [searchInput, setSearchInput] = useState(filters.searchTerm);
  const debouncedSearch = useDebounce(searchInput, 300);

  // Ajout du log pour diagnostiquer le contenu des collections
  console.log('Sidebar.jsx - collections:', collections);

  // Trier les collections
  const sortedCollections = useMemo(() => {
    if (!collections) return [];

    return [...collections].sort((a, b) => {
      // La collection par défaut en premier
      if (defaultCollection) {
        if (a._id === defaultCollection._id) return -1;
        if (b._id === defaultCollection._id) return 1;
      }

      // Ensuite les collections personnelles
      if (a.userId === user?._id && b.userId !== user?._id) return -1;
      if (b.userId === user?._id && a.userId !== user?._id) return 1;

      // Enfin, trier par nom
      return a.name.localeCompare(b.name);
    });
  }, [collections, defaultCollection, user?._id]);

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

  // Mettre à jour les filtres quand la valeur debouncée change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: debouncedSearch,
    }));
  }, [debouncedSearch, setFilters]);

  // Styles pour la version mobile et desktop
  const mobileStyles = !isSidebarCollapsed
    ? 'fixed inset-0 bg-white z-50 overflow-y-auto pb-16 transform transition-transform duration-300 ease-in-out translate-x-0'
    : 'fixed inset-0 bg-white z-50 overflow-y-auto pb-16 transform transition-transform duration-300 ease-in-out -translate-x-full';

  const desktopStyles = `h-full ${
    isSidebarCollapsed ? 'w-[60px]' : 'w-[320px]'
  } md:fixed md:top-[110px] md:bottom-0 md:left-0 md:overflow-y-auto md:pb-20 md:border-r md:border-gray-200 bg-white transition-all duration-300 ease-in-out relative`;

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
          {/* Collections */}
          <Accordion title="Collections" defaultOpen={true}>
            <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
              {/* Afficher les collections */}
              {sortedCollections.map(
                (collection) => (
                  console.log(collection),
                  (
                    <FilterCollectionItem
                      key={collection._id}
                      collection={collection}
                      user={user}
                    />
                  )
                )
              )}
            </div>
          </Accordion>

          {/* Articles sauvegardés */}
          <SavedArticles />
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
              {/* Collections */}
              <Accordion title="Collections" defaultOpen={true}>
                <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
                  {/* Afficher les collections */}
                  {sortedCollections.map((collection) => (
                    <FilterCollectionItem
                      key={collection._id}
                      collection={collection}
                      user={user}
                    />
                  ))}
                </div>
              </Accordion>

              {/* Articles sauvegardés */}
              <SavedArticles />
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
