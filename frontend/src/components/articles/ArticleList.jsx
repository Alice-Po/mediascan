import React, { useEffect, useRef, useCallback, useContext } from 'react';
import ArticleCard from './ArticleCard';
import { useSavedArticles } from '../../context/SavedArticlesContext';
import { AppContext } from '../../context/AppContext';
import { useArticles } from '../../hooks/useArticles';
import { fetchArticles } from '../../api/articlesApi';
import { AuthContext } from '../../context/AuthContext';
import EmptyState from './EmptyState';
import { useSnackbar, SNACKBAR_TYPES } from '../../context/SnackbarContext';

/**
 * Composant d'affichage de la liste des articles avec scroll infini
 * @param {Object} props
 * @param {Object} props.filters - Filtres à appliquer au feed (optionnel, fourni par le parent)
 * @param {number} props.pageSize - Nombre d'articles par page (optionnel, défaut: 20)
 */
const ArticleList = ({ filters, pageSize = 20 }) => {
  // Récupérer les collections pertinentes pour le filtrage
  const { allCollections } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const { saveArticle, unsaveArticle } = useSavedArticles();
  const { showSnackbar } = useSnackbar();

  // Utiliser le hook généraliste pour les articles, en injectant les filtres du parent
  const {
    articles,
    loading,
    error,
    hasMore,
    loadMore,
    updateArticle,
    setFilters: setHookFilters,
  } = useArticles({
    fetchArticlesFn: fetchArticles,
    collections: allCollections,
    options: { pageSize, initialFilters: filters },
  });

  // Synchroniser les filtres du parent avec le hook si la prop change
  useEffect(() => {
    setHookFilters(filters);
  }, [filters, setHookFilters]);

  // Référence pour l'observateur d'intersection
  const observer = useRef();

  // Fonction pour gérer le partage d'un article
  const handleShare = (url) => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Article intéressant',
          url: url,
        })
        .catch(console.error);
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => alert('Lien copié dans le presse-papier'))
        .catch(console.error);
    }
  };

  // Fonction pour gérer la sauvegarde/désauvegarde d'un article
  const handleSave = async (articleId) => {
    try {
      const article = articles.find((a) => a._id === articleId);
      if (!article) return;

      if (article.isSaved) {
        await unsaveArticle(articleId);
        showSnackbar('Article retiré des favoris', SNACKBAR_TYPES.SUCCESS);
      } else {
        await saveArticle(articleId);
        showSnackbar('Article sauvegardé avec succès', SNACKBAR_TYPES.SUCCESS);
      }

      // Mettre à jour l'état de l'article dans le hook
      updateArticle(articleId, { isSaved: !article.isSaved });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'article:", error);
    }
  };

  // Callback pour l'observateur d'intersection (infinite scroll)
  const lastArticleRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            try {
              loadMore();
            } catch (error) {
              // L'erreur est déjà gérée dans le hook
            }
          }
        },
        {
          root: null,
          rootMargin: '100px',
          threshold: 0.1,
        }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  // Affichage du message d'erreur
  const renderError = () => {
    return (
      <div className="flex justify-center py-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  };

  // Affichage du message de fin de liste
  const renderEndOfList = () => {
    if (!hasMore && articles.length > 0) {
      return (
        <div className="text-center py-6 text-gray-500">Vous avez atteint la fin de la liste</div>
      );
    }
    return null;
  };

  return (
    <div className="article-list -mx-3 sm:mx-0">
      {/* Liste des articles ou état vide */}
      {articles.length > 0 ? (
        articles.map((article, index) => (
          <div
            ref={index === articles.length - 1 ? lastArticleRef : null}
            key={article._id}
            className="mb-3 last:mb-0"
          >
            <ArticleCard article={article} onSave={handleSave} onShare={handleShare} />
          </div>
        ))
      ) : !loading ? (
        <EmptyState />
      ) : null}

      {/* Affichage des états */}
      {error && renderError()}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      {!loading && renderEndOfList()}
    </div>
  );
};

export default ArticleList;
