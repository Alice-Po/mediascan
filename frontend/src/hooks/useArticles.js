import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchArticles as defaultFetchArticles } from '../api/articlesApi';

// État initial des filtres
const initialFilters = {
  searchTerm: '',
  sources: [],
  collection: null,
};

/**
 * Hook généraliste pour la gestion des articles (filtrage, chargement, scroll infini, erreurs)
 * @param {Object} params
 *   - fetchArticlesFn: fonction pour charger les articles (par défaut: fetchArticles)
 *   - collections: liste des collections pour le filtrage
 *   - options: { initialFilters, pageSize }
 */
export const useArticles = ({
  fetchArticlesFn = defaultFetchArticles,
  collections = [],
  options = {},
} = {}) => {
  // Filtres (avec persistance)
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem('articleFilters');
    return savedFilters ? JSON.parse(savedFilters) : options.initialFilters || initialFilters;
  });

  useEffect(() => {
    localStorage.setItem('articleFilters', JSON.stringify(filters));
  }, [filters]);

  // Articles, pagination, loading, erreur, hasMore
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = options.pageSize || 20;

  // Charger les articles (initial ou refresh)
  const loadArticles = useCallback(
    async (reset = false) => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page: 1,
          limit: pageSize,
          ...(filters.sources.length > 0 && { sources: filters.sources.join(',') }),
          ...(filters.collection && { collection: filters.collection }),
          ...(filters.searchTerm && { searchTerm: filters.searchTerm }),
        };
        console.log("[useArticles] Paramètres envoyés à l'API:", params);
        const response = await fetchArticlesFn(params);
        console.log("[useArticles] Réponse de l'API:", response);
        setArticles(response.articles);
        setHasMore(response.hasMore);
        setPage(1);
      } catch (err) {
        console.error('[useArticles] Erreur lors du chargement des articles:', err);
        setError(err.message || 'Erreur lors du chargement des articles');
      } finally {
        setLoading(false);
      }
    },
    [fetchArticlesFn, filters, pageSize]
  );

  // Scroll infini : charger plus d'articles
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const params = {
        page: nextPage,
        limit: pageSize,
        ...(filters.sources.length > 0 && { sources: filters.sources.join(',') }),
        ...(filters.collection && { collection: filters.collection }),
        ...(filters.searchTerm && { searchTerm: filters.searchTerm }),
      };
      const response = await fetchArticlesFn(params);
      const existingIds = articles.map((a) => a._id);
      const uniqueNewArticles = response.articles.filter((a) => !existingIds.includes(a._id));
      setArticles((prev) => [...prev, ...uniqueNewArticles]);
      setHasMore(response.hasMore);
      setPage(nextPage);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement de plus d'articles");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, filters, pageSize, fetchArticlesFn, articles]);

  // Filtrage local (en plus du backend, pour la recherche locale ou logique avancée)
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      // Filtre par collection
      if (filters.collection) {
        const collection = collections.find((c) => c._id === filters.collection);
        if (!collection) return false;
        // Filtre par source spécifique
        if (filters.sources.length === 1) {
          return article.sourceId._id === filters.sources[0];
        }
        // Filtre par toutes les sources de la collection
        const collectionSources = Array.isArray(collection.sources)
          ? collection.sources.map((s) => (typeof s === 'string' ? s : s._id))
          : [];
        return collectionSources.includes(article.sourceId._id);
      }
      // Filtre par sources sélectionnées
      if (filters.sources.length > 0) {
        return filters.sources.includes(article.sourceId._id);
      }
      // Filtre par recherche
      if (filters.searchTerm) {
        const searchTermLower = filters.searchTerm.toLowerCase();
        return (
          article.title?.toLowerCase().includes(searchTermLower) ||
          article.contentSnippet?.toLowerCase().includes(searchTermLower)
        );
      }
      return true;
    });
  }, [articles, filters, collections]);

  // Reset des filtres
  const resetFilters = useCallback(() => {
    setFilters(options.initialFilters || initialFilters);
  }, [options.initialFilters]);

  // Mise à jour d'un article dans la liste locale
  const updateArticle = useCallback((articleId, updates) => {
    setArticles((prev) => prev.map((a) => (a._id === articleId ? { ...a, ...updates } : a)));
  }, []);

  // Refresh (recharger tous les articles)
  const refresh = useCallback(() => {
    loadArticles(true);
  }, [loadArticles]);

  // Recharger les articles au montage ou quand les filtres changent
  useEffect(() => {
    loadArticles(true);
    // eslint-disable-next-line
  }, [filters]);

  return {
    articles: filteredArticles,
    filters,
    setFilters,
    resetFilters,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    updateArticle,
    setArticles, // pour usage avancé
  };
};
