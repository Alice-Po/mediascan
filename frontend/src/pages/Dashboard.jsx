import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import ArticleFilters from '../components/articles/ArticleFilters';
import ArticleList from '../components/articles/ArticleList';

/**
 * Page principale du Dashboard
 */
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { resetFilters, loadingArticles, articles, filters, hasMoreArticles, refreshArticles } =
    useContext(AppContext);
  const [error, setError] = useState(null);

  // Réinitialiser les filtres au montage de la page
  useEffect(() => {
    const init = async () => {
      try {
        if (user) {
          await resetFilters();
        }
      } catch (err) {
        setError("Erreur lors de l'initialisation du dashboard");
        console.error(err);
      }
    };
    init();
  }, [user]);

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

  if (loadingArticles) {
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
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar de filtres (à l'extrême gauche sur desktop) */}
        <div className="w-full lg:w-64 lg:min-h-screen lg:border-r lg:border-gray-200 lg:sticky lg:top-0">
          <div className="p-4">
            <ArticleFilters />
          </div>
        </div>

        {/* Contenu principal (feed) occupant tout l'espace central */}
        <div className="flex-1 p-3 sm:p-6 lg:max-w-none lg:px-8 xl:px-12">
          <ArticleList />
          {!loadingArticles && !hasMoreArticles && (
            <div className="flex justify-center py-4">
              <button
                onClick={refreshArticles}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
              >
                Charger de nouveaux articles
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
