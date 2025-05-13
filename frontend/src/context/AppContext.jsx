import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { fetchUserSources, fetchAllSources } from '../api/sourcesApi';
import { fetchArticles } from '../api/articlesApi';
import { useCollections } from '../hooks/useCollections';

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
    collection: null,
  });

  // Utilisation du hook personnalisé pour les collections
  const {
    collections,
    currentCollection,
    loading: loadingCollections,
    loadCollections: fetchCollectionsData,
    createCollection,
    updateCollection,
    deleteCollection,
    loadCollectionById,
    setCurrentCollection,
    addSourceToCollection: addSourceToCollectionApi,
    removeSourceFromCollection,
    createFilterByCollection,
  } = useCollections(user, setError);

  // Fonction améliorée pour charger les collections et mettre à jour l'état global
  const loadCollections = useCallback(async () => {
    try {
      const data = await fetchCollectionsData();
      return data;
    } catch (error) {
      console.error('AppContext: Erreur lors du rechargement des collections', error);
      return null;
    }
  }, [fetchCollectionsData]);

  // Fonction améliorée pour ajouter une source à une collection
  const addSourceToCollection = useCallback(
    async (collectionId, sourceId) => {
      try {
        const result = await addSourceToCollectionApi(collectionId, sourceId);
        // Recharger les collections pour mettre à jour les compteurs partout
        await loadCollections();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [addSourceToCollectionApi, loadCollections]
  );

  // Création de la fonction de filtrage par collection
  const filterByCollection = createFilterByCollection(setFilters);

  // Memoize les articles filtrés
  const filteredArticles = React.useMemo(() => {
    const filtered = articles.filter((article) => {
      // Filtre par collection (prioritaire sur les sources individuelles)
      if (filters.collection) {
        const collection = collections.find((c) => c._id === filters.collection);

        // Vérifie si la collection existe et si les sources sont disponibles
        if (!collection) {
          return false;
        }

        // Si filters.sources contient un seul ID, on filtre spécifiquement par cette source
        if (filters.sources.length === 1) {
          const sourceId = filters.sources[0];
          const matches = article.sourceId._id === sourceId;

          return matches;
        }

        // Sinon, on utilise toutes les sources de la collection
        const collectionSources = Array.isArray(collection.sources)
          ? collection.sources.map((s) => (typeof s === 'string' ? s : s._id))
          : [];

        const sourceInCollection = collectionSources.some((s) => s === article.sourceId._id);

        if (!sourceInCollection) {
          // console.log(`Article rejeté: source ${article.sourceId._id} pas dans la collection`, article.title);
          return false;
        }
      }
      // Si aucune source n'est sélectionnée, ne pas filtrer par source
      else if (filters.sources.length > 0 && !filters.sources.includes(article.sourceId._id)) {
        return false;
      }

      // Filtre par recherche textuelle
      if (filters.searchTerm) {
        const searchTermLower = filters.searchTerm.toLowerCase();
        const matchesSearch =
          article.title?.toLowerCase().includes(searchTermLower) ||
          article.contentSnippet?.toLowerCase().includes(searchTermLower);

        if (!matchesSearch) {
          return false;
        }
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
  }, [articles, filters, collections]);

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
      console.log('Utilisateur connecté, chargement initial des articles');
      loadAllArticles(); // Charger tous les articles une seule fois
    }
  }, [user]);

  // Recharger les articles quand les filtres changent
  // useEffect(() => {
  //   if (user && (filters.sources.length > 0 || filters.collection)) {
  //     loadArticles();
  //   }
  // }, [filters.sources, filters.collection, user]);

  // Fonction pour charger les articles
  const loadAllArticles = async () => {
    try {
      setLoadingArticles(true);
      console.log('Chargement de tous les articles pertinents...');

      // Ici, nous ne spécifions pas de sources spécifiques pour obtenir tous les articles
      // de toutes les sources de l'utilisateur
      const response = await fetchArticles({
        // Ne pas filtrer par sources spécifiques
        page: 1,
        limit: 50, // Augmenter la limite pour obtenir plus d'articles en une fois
      });

      console.log(`${response.articles.length} articles chargés`);
      setArticles(response.articles);
      setHasMoreArticles(response.hasMore);
      setArticlesPage(1); // Réinitialiser la page
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
      setError(error.message);
    } finally {
      setLoadingArticles(false);
    }
  };

  // Fonction pour charger plus d'articles
  const loadArticles = async () => {
    try {
      setLoadingArticles(true);

      const response = await fetchArticles({
        sources: filters.sources.join(','),
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

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setFilters((prev) => {
      if (
        prev.sources.length === 0 &&
        !prev.searchTerm &&
        !prev.collection &&
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
        collection: null,
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

  // Ajouter une fonction pour rafraîchir manuellement les articles
  const refreshArticles = () => {
    loadAllArticles();
  };

  // Modifier loadMoreArticles pour charger plus d'articles avec les mêmes filtres
  const loadMoreArticles = async () => {
    if (loadingArticles || !hasMoreArticles) return;

    try {
      setLoadingArticles(true);
      const nextPage = articlesPage + 1;

      const data = await fetchArticles({
        page: nextPage,
        limit: 20,
        // Ne pas filtrer par sources ici pour obtenir tous les articles supplémentaires
      });

      // Extraire les IDs des articles existants
      const existingIds = articles.map((article) => article._id);

      // Filtrer les nouveaux articles pour éviter les doublons
      const uniqueNewArticles = data.articles.filter(
        (article) => !existingIds.includes(article._id)
      );

      // N'ajouter que les articles uniques
      setArticles((prev) => [...prev, ...uniqueNewArticles]);
      setHasMoreArticles(data.hasMore);
      setArticlesPage(nextPage);

      // Log pour debug
      console.log(
        `Chargé ${data.articles.length} articles, ${uniqueNewArticles.length} uniques ajoutés`
      );
    } catch (err) {
      console.error("Erreur lors du chargement de plus d'articles:", err);
    } finally {
      setLoadingArticles(false);
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
    loadMoreArticles: loadMoreArticles,
    error,
    setArticles,
    updateArticle,
    loadUserSources,
    // Fonctionnalités de collections fournies par le hook
    collections,
    currentCollection,
    loadingCollections,
    loadCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    loadCollectionById,
    setCurrentCollection,
    addSourceToCollection,
    removeSourceFromCollection,
    filterByCollection,
    refreshArticles,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Export des constantes et fonctions nommées
export { useApp };
