import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { fetchUserSources, fetchAllSources } from '../api/sourcesApi';
import { fetchArticles } from '../api/articlesApi';

// Création du contexte et du hook dans des constantes nommées
const AppContext = createContext(null);

// Hook personnalisé dans une fonction nommée
function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp doit être utilisé à l'intérieur d'un AppProvider");
  }
  return context;
}

// Provider dans une fonction nommée
function AppProvider({ children }) {
  const { isAuthenticated } = useContext(AuthContext);

  // State pour les sources
  const [userSources, setUserSources] = useState([]);
  const [allSources, setAllSources] = useState([]);
  const [loadingSources, setLoadingSources] = useState(true);

  // State pour les articles
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [articlesPage, setArticlesPage] = useState(1);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);

  // State pour les filtres avec une structure complète
  const [filters, setFilters] = useState({
    categories: [],
    sources: [],
    orientation: {
      political: [],
      type: [],
      structure: [],
      scope: [],
    },
    searchTerm: '',
  });

  // Charger les sources initiales
  useEffect(() => {
    let mounted = true;

    const initializeSources = async () => {
      if (!isAuthenticated) return;

      try {
        setLoadingSources(true);
        const [userSourcesData, allSourcesData] = await Promise.all([
          fetchUserSources(),
          fetchAllSources(),
        ]);

        if (!mounted) return;

        setUserSources(userSourcesData);
        setAllSources(allSourcesData);

        // Initialiser les filtres une seule fois avec les sources actives
        if (filters.sources.length === 0) {
          const activeSources = userSourcesData.filter((s) => s.enabled).map((s) => s.id);

          setFilters((prev) => ({
            ...prev,
            sources: activeSources,
          }));
        }
      } catch (err) {
        console.error('Erreur lors du chargement des sources:', err);
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
  }, [isAuthenticated]); // Dépendance uniquement à isAuthenticated

  // Charger les articles quand les filtres changent
  useEffect(() => {
    let mounted = true;

    const loadArticles = async () => {
      if (!isAuthenticated || !filters.sources?.length) {
        setArticles([]);
        setLoadingArticles(false);
        return;
      }

      try {
        setLoadingArticles(true);
        const data = await fetchArticles({
          page: 1,
          limit: 20,
          ...filters,
        });

        if (!mounted) return;

        setArticles(data.articles);
        setHasMoreArticles(data.hasMore);
        setArticlesPage(1);
      } catch (err) {
        console.error('Erreur lors du chargement des articles:', err);
      } finally {
        if (mounted) {
          setLoadingArticles(false);
        }
      }
    };

    loadArticles();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, JSON.stringify(filters)]);

  // Fonction pour charger plus d'articles
  const loadMoreArticles = async () => {
    if (loadingArticles || !hasMoreArticles) return;

    try {
      setLoadingArticles(true);
      const nextPage = articlesPage + 1;

      const data = await fetchArticles({
        page: nextPage,
        limit: 20,
        sources: filters.sources,
        categories: filters.categories,
        orientation: Object.entries(filters.orientation).flatMap(([key, values]) =>
          values.map((v) => `${key}:${v}`)
        ),
      });

      setArticles((prev) => [...prev, ...data.articles]);
      setHasMoreArticles(data.hasMore);
      setArticlesPage(nextPage);
    } catch (err) {
      console.error("Erreur lors du chargement de plus d'articles:", err);
    } finally {
      setLoadingArticles(false);
    }
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setFilters((prev) => {
      if (
        prev.categories.length === 0 &&
        prev.sources.length === 0 &&
        !prev.searchTerm &&
        (!prev.orientation || Object.values(prev.orientation).every((arr) => arr.length === 0))
      ) {
        return prev;
      }
      return {
        categories: [],
        sources: [],
        orientation: {
          political: [],
          type: [],
          structure: [],
          scope: [],
        },
        searchTerm: '',
      };
    });
  };

  // Fonction pour ajouter/activer une source
  const addOrEnableSource = (sourceId) => {
    setUserSources((prev) =>
      prev.map((source) => (source.id === sourceId ? { ...source, enabled: true } : source))
    );

    setFilters((prev) => ({
      ...prev,
      sources: [...prev.sources, sourceId],
    }));
  };

  // Fonction pour désactiver une source
  const disableSource = (sourceId) => {
    setUserSources((prev) =>
      prev.map((source) => (source.id === sourceId ? { ...source, enabled: false } : source))
    );

    setFilters((prev) => ({
      ...prev,
      sources: prev.sources.filter((id) => id !== sourceId),
    }));
  };

  // Valeur du contexte
  const value = {
    userSources,
    allSources,
    loadingSources,
    articles,
    loadingArticles,
    hasMoreArticles,
    filters,
    setFilters,
    resetFilters,
    loadMoreArticles,
    addOrEnableSource,
    disableSource,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Export des constantes et fonctions nommées
export { AppContext, useApp, AppProvider };
