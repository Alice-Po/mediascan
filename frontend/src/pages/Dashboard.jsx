import React, { useContext, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import Sidebar from '../components/sidebar/Sidebar';
import ArticleList from '../components/articles/ArticleList';

/**
 * Page principale du Dashboard
 */
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const {
    resetFilters,
    loadingArticles,
    articles,
    filters,
    hasMoreArticles,
    refreshArticles,
    isSidebarCollapsed,
    filterByCollection,
    setFilters,
  } = useContext(AppContext);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  // Référence pour suivre le paramètre collection déjà appliqué
  const appliedCollectionRef = useRef(null);

  // Récupérer les paramètres d'URL et appliquer les filtres correspondants
  useEffect(() => {
    if (user) {
      const collectionId = searchParams.get('collection');
      const sourceId = searchParams.get('source');

      // Seulement appliquer le filtre si le collectionId est présent et
      // différent de celui déjà appliqué pour éviter les boucles infinies
      if (collectionId && appliedCollectionRef.current !== collectionId) {
        console.log("Paramètre collection détecté dans l'URL:", collectionId);

        // Mettre à jour la référence avant d'appliquer le filtre
        appliedCollectionRef.current = collectionId;

        // Appliquer le filtre de collection
        filterByCollection(collectionId);

        // Si un sourceId est spécifié, filtrer par cette source spécifique
        if (sourceId) {
          console.log("Paramètre source détecté dans l'URL:", sourceId);
          // Attendre un peu que le filtre par collection soit appliqué avant d'appliquer le filtre par source
          setTimeout(() => {
            setFilters((prev) => ({
              ...prev,
              sources: [sourceId],
            }));
          }, 100);
        }
      } else if (!collectionId && appliedCollectionRef.current) {
        // Réinitialiser si pas de collection dans l'URL mais une précédemment appliquée
        appliedCollectionRef.current = null;
        resetFilters();
      }
    }
  }, [user, searchParams, filterByCollection, resetFilters, setFilters]);

  // Configurer le pull-to-refresh
  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;
    const minSwipeDistance = 100;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      touchEndY = e.changedTouches[0].clientY;
      if (window.scrollY === 0 && touchEndY - touchStartY > minSwipeDistance) {
        window.location.reload();
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []); // Pas de dépendances car ces événements ne changent pas

  const filterArticles = (articles) => {
    return articles.filter((article) => {
      // Filtre par recherche textuelle
      if (filters.searchTerm) {
        const searchTermLower = filters.searchTerm.toLowerCase();
        const matchesSearch =
          article.title?.toLowerCase().includes(searchTermLower) ||
          article.contentSnippet?.toLowerCase().includes(searchTermLower);

        if (!matchesSearch) return false;
      }

      // Autres filtres existants...
      if (filters.sources.length > 0 && !filters.sources.includes(article.sourceId)) {
        return false;
      }

      if (
        filters.orientation.political?.length > 0 &&
        !filters.orientation.political.includes(article.orientation?.political)
      ) {
        return false;
      }

      return true;
    });
  };

  if (loadingArticles && articles.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Layout responsive avec sidebar à l'extrême gauche sur desktop */}
      <div className="flex flex-col md:flex-row max-w-screen-2xl mx-auto">
        {/* Sidebar de filtres (à l'extrême gauche sur desktop) */}
        <div className="w-full md:w-auto md:min-h-screen">
          <div className="p-4 md:p-0">
            <Sidebar />
          </div>
        </div>

        {/* Contenu principal (feed) avec largeur maximale pour améliorer la lisibilité sur grands écrans */}
        <div
          className={`flex-1 p-3 sm:p-6 ${
            isSidebarCollapsed ? 'md:ml-[60px]' : 'md:ml-[320px]'
          } md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] mx-auto transition-all duration-300 ease-in-out`}
        >
          <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
            <ArticleList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
