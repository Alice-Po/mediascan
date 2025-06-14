import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSavedArticles } from '../../context/SavedArticlesContext';
import ArticleItem from '../articles/ArticleItem';
import { useSnackbar, SNACKBAR_TYPES } from '../../context/SnackbarContext';

/**
 * Composant pour afficher les articles sauvegardés dans la sidebar
 */
const SavedArticles = () => {
  const { savedArticles, loading, error, unsaveArticle } = useSavedArticles();
  const [expanded, setExpanded] = useState(true);
  const { showSnackbar } = useSnackbar();

  // Gérer la désauvegarde d'un article
  const handleUnsave = async (articleId, e) => {
    e.stopPropagation();
    await unsaveArticle(articleId);
    showSnackbar('Article retiré des favoris', SNACKBAR_TYPES.SUCCESS);
  };

  // Fonction pour basculer l'affichage
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="border-b border-gray-200 py-3">
      <button
        className="w-full flex justify-between items-center text-left"
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
          <span className="font-medium text-sm text-gray-700">Articles sauvegardés</span>
          <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
            {savedArticles.length}
          </span>
        </div>
        <span className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      <div
        className={`pt-2 transition-all duration-200 ease-in-out ${expanded ? 'block' : 'hidden'}`}
      >
        {loading ? (
          <div className="flex justify-center py-3">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-xs text-red-600 p-2">{error}</div>
        ) : savedArticles.length === 0 ? (
          <div className="text-xs text-gray-500 p-2">Aucun article sauvegardé pour le moment.</div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {savedArticles.map((article) => (
              <ArticleItem key={article._id} article={article} onUnsave={handleUnsave} />
            ))}
          </div>
        )}

        {/* <div className="mt-2 border-t border-gray-100 pt-2">
          <Link to="/saved" className="text-xs text-blue-600 hover:text-blue-800 block text-center">
            Voir tous les articles sauvegardés
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default SavedArticles;
