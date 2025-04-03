import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { fetchUserSources, fetchAllSources } from '../api/sourcesApi';
import { fetchArticles } from '../api/articlesApi';
import { updateUserSource } from '../api/sourcesApi';

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

        setUserSources(formattedUserSources);
        setAllSources(allSourcesData.data);

        // Initialiser les filtres avec les IDs des sources actives
        const activeSourceIds = formattedUserSources
          .filter((source) => source.enabled)
          .map((source) => source._id);

        setFilters((prev) => ({
          ...prev,
          sources: activeSourceIds,
        }));
      } catch (err) {
        console.error('Error loading sources:', err);
        setError('Erreur lors du chargement des sources');
      } finally {
        setLoadingSources(false);
      }
    };

    initializeSources();

    return () => {
      mounted = false;
    };
  }, [user]);

  // Charger les articles quand les filtres changent
  useEffect(() => {
    let mounted = true;

    const loadArticles = async () => {
      if (!user || !filters.sources?.length) {
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

        setArticles(data.articles || []);
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
  }, [user, JSON.stringify(filters)]);

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
    error,
    userInterests,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Export des constantes et fonctions nommées
export { AppContext, useApp, AppProvider };
