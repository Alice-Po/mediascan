import React from 'react';
import ArticleCard from '../components/articles/ArticleCard';
import { useSavedArticles } from '../context/SavedArticlesContext';

/**
 * Page des articles sauvegardés
 */
const Saved = () => {
  const { savedArticles, loading, error, unsaveArticle } = useSavedArticles();

  // Gérer la désauvegarde d'un article
  const handleUnsave = async (articleId) => {
    await unsaveArticle(articleId);
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

  if (!savedArticles.length) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Aucun article sauvegardé</h2>
        <p className="text-gray-600">Les articles que vous sauvegardez apparaîtront ici.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Articles sauvegardés</h1>
      <div className="space-y-4">
        {savedArticles.map((article) => (
          <ArticleCard
            key={article._id}
            article={{ ...article, isSaved: true }} // S'assurer que isSaved est true
            onSave={handleUnsave}
            onShare={handleShare}
          />
        ))}
      </div>
    </div>
  );
};

export default Saved;
