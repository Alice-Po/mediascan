import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { fetchSavedArticles, saveArticle, unsaveArticle } from '../api/articlesApi';
import { AuthContext } from './AuthContext';

// Création du contexte
export const SavedArticlesContext = createContext(null);

// Hook personnalisé pour utiliser le contexte
export const useSavedArticles = () => {
  const context = useContext(SavedArticlesContext);
  if (!context) {
    throw new Error("useSavedArticles doit être utilisé à l'intérieur d'un SavedArticlesProvider");
  }
  return context;
};

export const SavedArticlesProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les articles sauvegardés
  const loadSavedArticles = useCallback(async () => {
    if (!user) {
      setSavedArticles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetchSavedArticles();

      // S'assurer que nous utilisons le bon chemin pour accéder aux articles
      const articles = response.articles || [];
      setSavedArticles(articles);
    } catch (err) {
      console.error('Error loading saved articles:', err);
      setError('Erreur lors du chargement des articles sauvegardés');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Charger les articles sauvegardés au montage et quand l'utilisateur change
  useEffect(() => {
    loadSavedArticles();
  }, [loadSavedArticles]);

  // Fonction pour sauvegarder un article
  const handleSaveArticle = useCallback(
    async (articleId) => {
      try {
        await saveArticle(articleId);
        // Recharger les articles sauvegardés pour mettre à jour la liste
        loadSavedArticles();
        return true;
      } catch (err) {
        console.error('Error saving article:', err);
        setError("Erreur lors de la sauvegarde de l'article");
        return false;
      }
    },
    [loadSavedArticles]
  );

  // Fonction pour désauvegarder un article
  const handleUnsaveArticle = useCallback(async (articleId) => {
    try {
      await unsaveArticle(articleId);
      // Mettre à jour la liste des articles sauvegardés sans recharger
      setSavedArticles((prevArticles) =>
        prevArticles.filter((article) => article._id !== articleId)
      );
      return true;
    } catch (err) {
      console.error('Error unsaving article:', err);
      setError("Erreur lors de la désauvegarde de l'article");
      return false;
    }
  }, []);

  // Vérifier si un article est sauvegardé
  const isArticleSaved = useCallback(
    (articleId) => {
      return savedArticles.some((article) => article._id === articleId);
    },
    [savedArticles]
  );

  // Valeur du contexte
  const value = {
    savedArticles,
    loading,
    error,
    loadSavedArticles,
    saveArticle: handleSaveArticle,
    unsaveArticle: handleUnsaveArticle,
    isArticleSaved,
  };

  return <SavedArticlesContext.Provider value={value}>{children}</SavedArticlesContext.Provider>;
};
