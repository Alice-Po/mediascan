import React, { useState, useEffect } from 'react';
import { fetchSavedArticles, unsaveArticle } from '../api/articlesApi';
import ArticleCard from '../components/articles/ArticleCard';

/**
 * Page des articles sauvegardés
 */
const Saved = () => {
  // State pour les articles sauvegardés
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les articles sauvegardés
  useEffect(() => {
    const loadSavedArticles = async () => {
      try {
        setLoading(true);
        const articles = await fetchSavedArticles();
        setSavedArticles(articles);
      } catch (err) {
        console.error('Erreur lors du chargement des articles sauvegardés:', err);
        setError('Impossible de charger vos articles sauvegardés.');
      } finally {
        setLoading(false);
      }
    };

    loadSavedArticles();
  }, []);

  // Gérer la désauvegarde d'un article
  const handleUnsave = async (articleId) => {
    try {
      await unsaveArticle(articleId);
      // Mettre à jour la liste des articles sauvegardés
      setSavedArticles(savedArticles.filter((article) => article.id !== articleId));
    } catch (err) {
      console.error("Erreur lors de la désauvegarde de l'article:", err);
      setError('Impossible de désauvegarder cet article.');
    }
  };

  // Gérer le partage d'un article
  const handleShare = (url) => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Article intéressant',
          url: url,
        })
        .catch(console.error);
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      navigator.clipboard
        .writeText(url)
        .then(() => alert('Lien copié dans le presse-papier'))
        .catch(console.error);
    }
  };

  // Afficher un message de chargement
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Afficher un message d'erreur
  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>;
  }

  return (
    <div className="saved-articles">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h2 className="text-lg font-medium text-gray-800 mb-2">Articles sauvegardés</h2>
        <p className="text-gray-600 text-sm">
          Retrouvez ici tous les articles que vous avez sauvegardés pour une lecture ultérieure.
        </p>
      </div>

      {/* Liste des articles sauvegardés */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        {savedArticles.length === 0 ? (
          <div className="text-center py-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <p className="text-gray-500 mb-2">Vous n'avez pas encore d'articles sauvegardés.</p>
            <p className="text-gray-400 text-sm">
              Cliquez sur l'icône de marque-page sur un article pour le sauvegarder ici.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={{ ...article, isSaved: true }}
                onSave={handleUnsave}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;
