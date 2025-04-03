import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { fetchUserSources, fetchAllSources } from '../api/sourcesApi';
import { fetchArticles } from '../api/articlesApi';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // State pour les sources
  const [userSources, setUserSources] = useState([]);
  const [allSources, setAllSources] = useState([]);
  const [loadingSources, setLoadingSources] = useState(true);

  // State pour les articles
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [articlesPage, setArticlesPage] = useState(1);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);

  // State pour les filtres
  const [filters, setFilters] = useState({
    categories: [],
    orientation: {
      political: [],
      type: [],
      structure: [],
      scope: [],
    },
    sources: [], // IDs des sources actives
  });

  const { isAuthenticated } = useContext(AuthContext);

  // Charger les sources de l'utilisateur
  useEffect(() => {
    const loadUserSources = async () => {
      if (!isAuthenticated) return;

      try {
        setLoadingSources(true);
        const sources = await fetchUserSources();
        setUserSources(sources);

        // Initialiser les filtres avec toutes les sources activées
        setFilters((prev) => ({
          ...prev,
          sources: sources.filter((s) => s.enabled).map((s) => s.id),
        }));
      } catch (err) {
        console.error('Erreur lors du chargement des sources:', err);
      } finally {
        setLoadingSources(false);
      }
    };

    loadUserSources();
  }, [isAuthenticated]);

  // Charger toutes les sources disponibles
  useEffect(() => {
    const loadAllSources = async () => {
      if (!isAuthenticated) return;

      try {
        const sources = await fetchAllSources();
        setAllSources(sources);
      } catch (err) {
        console.error('Erreur lors du chargement de toutes les sources:', err);
      }
    };

    loadAllSources();
  }, [isAuthenticated]);

  // Charger les articles en fonction des filtres
  useEffect(() => {
    const loadArticles = async () => {
      if (!isAuthenticated || filters.sources.length === 0) {
        setArticles([]);
        setLoadingArticles(false);
        return;
      }

      try {
        setLoadingArticles(true);
        const data = await fetchArticles({
          page: 1,
          limit: 20,
          sources: filters.sources,
          categories: filters.categories,
          orientation: Object.entries(filters.orientation).flatMap(([key, values]) =>
            values.map((v) => `${key}:${v}`)
          ),
        });

        setArticles(data.articles);
        setHasMoreArticles(data.hasMore);
        setArticlesPage(1);
      } catch (err) {
        console.error('Erreur lors du chargement des articles:', err);
      } finally {
        setLoadingArticles(false);
      }
    };

    if (isAuthenticated) {
      loadArticles();
    }
  }, [isAuthenticated, filters]);

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

  // Fonction pour mettre à jour les filtres
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      categories: [],
      orientation: {
        political: [],
        type: [],
        structure: [],
        scope: [],
      },
      sources: userSources.filter((s) => s.enabled).map((s) => s.id),
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
    updateFilters,
    resetFilters,
    loadMoreArticles,
    addOrEnableSource,
    disableSource,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
