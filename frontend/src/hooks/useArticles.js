import { useState, useEffect, useCallback } from 'react';
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
  // Articles, pagination, loading, erreur, hasMore
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = options.pageSize || 20;

  // Filtres (avec persistance)
  const [internalFilters, setInternalFilters] = useState(() => {
    // Si des filtres initiaux sont fournis, les utiliser
    if (options.initialFilters) {
      return options.initialFilters;
    }
    // Sinon, essayer de charger depuis le localStorage
    const savedFilters = localStorage.getItem('articleFilters');
    return savedFilters ? JSON.parse(savedFilters) : initialFilters;
  });

  // Utiliser les filtres des props s'ils existent, sinon utiliser les filtres internes
  const filters = options.initialFilters || internalFilters;

  // Sauvegarder les filtres dans le localStorage uniquement si ce sont les filtres internes
  useEffect(() => {
    if (!options.initialFilters) {
      localStorage.setItem('articleFilters', JSON.stringify(internalFilters));
    }
  }, [internalFilters, options.initialFilters]);

  // Charger les articles (initial ou refresh)
  const loadArticles = useCallback(
    async (reset = false) => {
      // Ne pas charger si pas de collection et qu'on n'est pas en mode reset
      if (!filters.collection && !reset) {
        return;
      }

      // Si reset, réinitialiser la page et les articles
      if (reset) {
        setPage(1);
        setArticles([]);
      }

      setLoading(true);
      setError(null);

      try {
        const params = {
          page: reset ? 1 : page,
          limit: pageSize,
          ...(filters.sources?.length > 0 && { sources: filters.sources.join(',') }),
          ...(filters.collection && { collection: filters.collection }),
          ...(filters.searchTerm && { searchTerm: filters.searchTerm }),
        };

        const response = await fetchArticlesFn(params);

        if (reset) {
          setArticles(response.articles || []);
        } else {
          const existingIds = articles.map((a) => a._id);
          const newArticles = (response.articles || []).filter((a) => !existingIds.includes(a._id));
          setArticles((prev) => [...prev, ...newArticles]);
        }

        setHasMore(response.hasMore);
        if (!reset) {
          setPage((prev) => prev + 1);
        }
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des articles');
      } finally {
        setLoading(false);
      }
    },
    [fetchArticlesFn, filters, pageSize, page, articles]
  );

  // Recharger les articles quand les filtres changent
  useEffect(() => {
    const shouldReset = true;
    loadArticles(shouldReset);
  }, [
    filters.collection,
    filters.searchTerm,
    // Ajouter sources ici car nous voulons recharger quand les sources changent dans CollectionDetails/SourceDetails
    filters.sources?.join(','),
  ]);

  // Mise à jour d'un article dans la liste locale
  const updateArticle = useCallback((articleId, updates) => {
    setArticles((prev) => prev.map((a) => (a._id === articleId ? { ...a, ...updates } : a)));
  }, []);

  // Reset des filtres (uniquement pour les filtres internes)
  const resetFilters = useCallback(() => {
    if (!options.initialFilters) {
      setInternalFilters(initialFilters);
    }
    setPage(1);
    setArticles([]);
    setHasMore(true);
  }, [options.initialFilters]);

  return {
    articles,
    filters: options.initialFilters || internalFilters,
    setFilters: options.initialFilters ? undefined : setInternalFilters,
    resetFilters: options.initialFilters ? undefined : resetFilters,
    loading,
    error,
    hasMore,
    loadMore: () => loadArticles(false),
    updateArticle,
  };
};
