import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { fetchSourcesFromUserCollections } from '../api/sourcesApi';
import { fetchArticles } from '../api/articlesApi';
import { useCollections } from '../hooks/useCollections';
import { useArticleFilters } from '../hooks/useArticleFilters';

// Création du contexte
export const AppContext = createContext(null);

// Hook personnalisé
function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp doit être utilisé à l'intérieur d'un AppProvider");
  }
  return context;
}

// Provider
export const AppProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  // States
  const [userSources, setUserSources] = useState([]);
  const [loadingSources, setLoadingSources] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [articlesPage, setArticlesPage] = useState(1);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true'
  );

  // Utilisation du hook collections
  const collectionsHookResult = useCollections(user);
  const {
    ownedCollections,
    loading: collectionsLoading,
    error: collectionsError,
    createCollection,
    updateCollection,
    deleteCollection,
    addSourceToCollection,
    removeSourceFromCollection,
    followCollection,
    unfollowCollection,
    checkIfFollowing,
  } = collectionsHookResult;

  // Utilisation du hook de filtrage
  const {
    filters,
    setFilters,
    resetFilters,
    filteredArticles,
    filterByCollection,
    filterBySource,
    filterBySearch,
  } = useArticleFilters(articles, ownedCollections);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  }, [isSidebarCollapsed]);

  // Charger les sources
  useEffect(() => {
    let mounted = true;

    const initializeSources = async () => {
      if (!user) {
        setLoadingSources(false);
        return;
      }

      try {
        setLoadingSources(true);
        const [userSourcesData, allSourcesData] = await Promise.all([
          fetchSourcesFromUserCollections(),
          fetchAllSources(),
        ]);

        if (mounted) {
          setUserSources(userSourcesData);

          // Initialiser les filtres avec les sources actives
          const activeSourceIds = userSourcesData
            .filter((source) => source.enabled)
            .map((source) => source._id);

          setFilters((prev) => ({
            ...prev,
            sources: prev.sources.length === 0 ? activeSourceIds : prev.sources,
          }));
        }
      } catch (err) {
        console.error('Error loading sources:', err);
        setError('Erreur lors du chargement des sources');
      } finally {
        if (mounted) {
          setLoadingSources(false);
        }
      }
    };

    initializeSources();
    return () => {
      mounted = false;
    };
  }, [user, setFilters]);

  // Charger les articles
  useEffect(() => {
    if (user) {
      loadAllArticles();
    }
  }, [user]);

  // Fonctions de chargement
  const loadAllArticles = async () => {
    try {
      setLoadingArticles(true);
      const response = await fetchArticles({
        page: 1,
        limit: 50,
      });

      setArticles(response.articles);
      setHasMoreArticles(response.hasMore);
      setArticlesPage(1);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
      setError(error.message);
    } finally {
      setLoadingArticles(false);
    }
  };

  const loadMoreArticles = async () => {
    if (loadingArticles || !hasMoreArticles) return;

    try {
      setLoadingArticles(true);
      const nextPage = articlesPage + 1;

      const params = {
        page: nextPage,
        limit: 20,
        ...(filters.sources.length > 0 && { sources: filters.sources.join(',') }),
        ...(filters.collection && { collection: filters.collection }),
        ...(filters.searchTerm && { searchTerm: filters.searchTerm }),
      };

      const data = await fetchArticles(params);
      const existingIds = articles.map((article) => article._id);
      const uniqueNewArticles = data.articles.filter(
        (article) => !existingIds.includes(article._id)
      );

      setArticles((prev) => [...prev, ...uniqueNewArticles]);
      setHasMoreArticles(data.hasMore);
      setArticlesPage(nextPage);
    } catch (err) {
      console.error("Erreur lors du chargement de plus d'articles:", err);
      throw err;
    } finally {
      setLoadingArticles(false);
    }
  };

  // Fonctions utilitaires
  const updateArticle = useCallback((articleId, updates) => {
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article._id === articleId ? { ...article, ...updates } : article
      )
    );
  }, []);

  const refreshArticles = useCallback(() => {
    loadAllArticles();
  }, []);

  // Valeur du contexte
  const value = {
    userSources,
    loadingSources,
    articles: filteredArticles,
    loadingArticles,
    hasMoreArticles,
    filters,
    setFilters,
    resetFilters,
    loadMoreArticles,
    error,
    setArticles,
    updateArticle,
    collections: ownedCollections,
    loadingCollections: collectionsLoading,
    collectionsError,
    createCollection,
    updateCollection,
    deleteCollection,
    addSourceToCollection,
    removeSourceFromCollection,
    followCollection,
    unfollowCollection,
    checkIfFollowing,
    refreshArticles,
    isSidebarCollapsed,
    toggleSidebar,
    filterByCollection,
    filterBySource,
    filterBySearch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { useApp };
