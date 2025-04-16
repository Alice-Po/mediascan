import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { fetchUserSources, fetchAllSources } from '../api/sourcesApi';
import { fetchArticles } from '../api/articlesApi';
import { updateUserSource } from '../api/sourcesApi';

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
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem('articleFilters');
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          searchTerm: '',
          categories: [],
          orientation: {},
          sources: [],
        };
  });

  // Memoize les articles filtrés
  const filteredArticles = React.useMemo(() => {
    const filtered = articles.filter((article) => {
      // Si aucune source n'est sélectionnée, ne pas filtrer par source
      if (filters.sources.length > 0 && !filters.sources.includes(article.sourceId._id)) {
        return false;
      }

      // Filtre par catégorie
      if (
        filters.categories.length > 0 &&
        !article.categories?.some((cat) => filters.categories.includes(cat))
      ) {
        return false;
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
      loadArticles();
    }
  }, [user]);

  // Fonction pour charger les articles
  const loadArticles = async () => {
    try {
      setLoadingArticles(true);
      const response = await fetchArticles();
      setArticles(response.articles);
      setHasMoreArticles(response.hasMore);
    } catch (error) {
      console.error('Error loading articles:', error);
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
        },
        searchTerm: '',
      };
    });
  };

  // Fonction pour ajouter/activer une source
  const addOrEnableSource = async (sourceId) => {
    try {
      // Appeler l'API pour activer la source
      await updateUserSource(sourceId, { enabled: true });

      // Trouver la source dans allSources
      const sourceToAdd = allSources.find((source) => source._id === sourceId);

      if (!sourceToAdd) {
        return;
      }

      // Ajouter la source aux sources actives de l'utilisateur
      setUserSources((prev) => {
        // Vérifier si la source existe déjà
        const exists = prev.some((source) => source._id === sourceId);
        if (exists) {
          // Mettre à jour enabled à true si la source existe
          return prev.map((source) =>
            source._id === sourceId ? { ...source, enabled: true } : source
          );
        }
        // Ajouter la nouvelle source si elle n'existe pas
        return [...prev, { ...sourceToAdd, enabled: true }];
      });

      // Mettre à jour les filtres pour inclure la nouvelle source
      setFilters((prev) => ({
        ...prev,
        sources: [...prev.sources, sourceId],
      }));
    } catch (error) {
      console.error('Error adding/enabling source:', error);
      throw error;
    }
  };

  // Fonction pour désactiver une source
  const disableSource = async (sourceId) => {
    try {
      // Appeler l'API pour désactiver la source
      await updateUserSource(sourceId, { enabled: false });

      // Mettre à jour userSources
      setUserSources((prev) =>
        prev.map((source) => (source._id === sourceId ? { ...source, enabled: false } : source))
      );

      // Mettre à jour les filtres
      setFilters((prev) => ({
        ...prev,
        sources: prev.sources.filter((id) => id !== sourceId),
      }));
    } catch (error) {
      console.error('Error disabling source:', error);
      setError('Erreur lors de la désactivation de la source');
    }
  };

  // Mettre à jour les thématiques quand l'utilisateur change
  useEffect(() => {
    if (user?.interests) {
      setUserInterests(user.interests);
    } else {
      setUserInterests([]);
    }
  }, [user]);

  // Fonction pour mettre à jour l'état d'un article
  const updateArticle = useCallback((articleId, updates) => {
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article._id === articleId ? { ...article, ...updates } : article
      )
    );
  }, []);

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
    addOrEnableSource,
    disableSource,
    error,
    userInterests,
    setArticles,
    updateArticle,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Export des constantes et fonctions nommées
export { useApp };
