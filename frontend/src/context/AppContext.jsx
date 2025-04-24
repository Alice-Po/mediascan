import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { fetchUserSources, fetchAllSources } from '../api/sourcesApi';
import { fetchArticles } from '../api/articlesApi';

// Création du contexte et du hook dans des constantes nommées
export const AppContext = createContext(null);

// Hook personnalisé dans une fonction nommée
function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp doit être utilisé à l'intérieur d'un AppProvider");
  }
  return context;
}

// Provider dans une fonction nommée
export const AppProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  // State pour les sources
  const [userSources, setUserSources] = useState([]);
  const [allSources, setAllSources] = useState([]);
  const [loadingSources, setLoadingSources] = useState(true);
  const [error, setError] = useState(null);

  // State pour les articles avec un tableau vide par défaut
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [articlesPage, setArticlesPage] = useState(1);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);

  // State pour les filtres
  const [filters, setFilters] = useState({
    searchTerm: '',
    sources: [],
    orientation: {
      political: [],
    },
  });

  // Memoize les articles filtrés
  const filteredArticles = React.useMemo(() => {
    const filtered = articles.filter((article) => {
      // Si aucune source n'est sélectionnée, ne pas filtrer par source
      if (filters.sources.length > 0 && !filters.sources.includes(article.sourceId._id)) {
        return false;
      }

      // Filtre par recherche textuelle
      if (filters.searchTerm) {
        const searchTermLower = filters.searchTerm.toLowerCase();
        const matchesSearch =
          article.title?.toLowerCase().includes(searchTermLower) ||
          article.contentSnippet?.toLowerCase().includes(searchTermLower);

        if (!matchesSearch) return false;
      }

      // Filtre par orientation
      if (
        filters.orientation.political?.length > 0 &&
        !filters.orientation.political.includes(article.orientation?.political)
      ) {
        return false;
      }
      return true;
    });

    return filtered;
  }, [articles, filters]);

  // Sauvegarder les filtres dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('articleFilters', JSON.stringify(filters));
  }, [filters]);

  // Ajout du state pour les thématiques
  const [userInterests, setUserInterests] = useState([]);

  // Charger les sources initiales
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
          fetchUserSources(),
          fetchAllSources(),
        ]);

        const formattedUserSources = Array.isArray(userSourcesData)
          ? userSourcesData.map((source) => ({ ...source, enabled: true }))
          : [];

        if (mounted) {
          setUserSources(formattedUserSources);
          setAllSources(allSourcesData.data);

          // Initialiser les filtres avec TOUTES les sources actives
          const activeSourceIds = formattedUserSources
            .filter((source) => source.enabled)
            .map((source) => source._id);

          // Mettre à jour les filtres en préservant les autres filtres existants
          setFilters((prev) => ({
            ...prev,
            sources: prev.sources.length === 0 ? activeSourceIds : prev.sources, // Ne pas écraser si déjà défini
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
  }, [user]);

  // Charger les articles une seule fois au montage ou quand l'utilisateur change
  useEffect(() => {
    if (user) {
      console.log('AppContext - Chargement initial des articles', {
        user: user._id,
        filters,
      });
      loadArticles();
    }
  }, [user]);

  // Fonction pour charger les articles
  const loadArticles = async () => {
    try {
      setLoadingArticles(true);

      const response = await fetchArticles({
        sources: filters.sources.map((s) => s._id).join(','),
        page: articlesPage,
      });

      setArticles(response.articles);
      setHasMoreArticles(response.hasMore);
    } catch (error) {
      console.error('AppContext - Erreur loadArticles:', error);
      setError(error.message);
    } finally {
      setLoadingArticles(false);
    }
  };

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
        prev.sources.length === 0 &&
        !prev.searchTerm &&
        (!prev.orientation || Object.values(prev.orientation).every((arr) => arr.length === 0))
      ) {
        return prev;
      }
      return {
        sources: [],
        orientation: {
          political: [],
        },
        searchTerm: '',
      };
    });
  };

  // Fonction pour mettre à jour l'état d'un article
  const updateArticle = useCallback((articleId, updates) => {
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article._id === articleId ? { ...article, ...updates } : article
      )
    );
  }, []);

  // Vérifier les logs des sources actives
  const loadUserSources = async () => {
    try {
      setLoadingSources(true);
      const sources = await fetchUserSources();
      console.log('Sources actives chargées:', sources);
      setUserSources(sources);
    } catch (error) {
      console.error('Erreur chargement sources:', error);
      setError(error.message);
    } finally {
      setLoadingSources(false);
    }
  };

  // Valeur du contexte
  const value = {
    userSources,
    allSources,
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
    loadUserSources,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Export des constantes et fonctions nommées
export { useApp };
