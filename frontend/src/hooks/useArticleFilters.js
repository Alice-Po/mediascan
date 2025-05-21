import { useState, useEffect, useMemo, useCallback } from 'react';

// État initial des filtres
const initialFilters = {
  searchTerm: '',
  sources: [],
  collection: null,
};

/**
 * Hook personnalisé pour gérer le filtrage des articles
 * @param {Array} articles - Liste des articles à filtrer
 * @param {Array} collections - Liste des collections disponibles
 * @returns {Object} État et fonctions pour gérer les filtres
 */
export const useArticleFilters = (articles, collections) => {
  // État des filtres avec persistance dans localStorage
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem('articleFilters');
    return savedFilters ? JSON.parse(savedFilters) : initialFilters;
  });

  // Sauvegarder les filtres dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('articleFilters', JSON.stringify(filters));
  }, [filters]);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  // Filtrer les articles en fonction des critères
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

  // Fonction pour filtrer par collection
  const filterByCollection = useCallback(
    (collectionId) => {
      setFilters((prev) => {
        const collection = collections.find((c) => c._id === collectionId);
        if (!collection) return prev;

        const collectionSources = Array.isArray(collection.sources)
          ? collection.sources.map((s) => (typeof s === 'string' ? s : s._id))
          : [];

        return {
          ...prev,
          collection: collectionId,
          sources: collectionSources,
        };
      });
    },
    [collections]
  );

  // Fonction pour filtrer par source
  const filterBySource = useCallback((sourceId) => {
    setFilters((prev) => ({
      ...prev,
      sources: [sourceId],
    }));
  }, []);

  // Fonction pour filtrer par terme de recherche
  const filterBySearch = useCallback((searchTerm) => {
    setFilters((prev) => ({
      ...prev,
      searchTerm,
    }));
  }, []);

  return {
    filters,
    setFilters,
    resetFilters,
    filteredArticles,
    filterByCollection,
    filterBySource,
    filterBySearch,
  };
};
