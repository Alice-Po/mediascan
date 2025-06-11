import React, { useEffect, useRef, useCallback, useContext } from 'react';
import ArticleCard from './ArticleCard';
import { useSavedArticles } from '../../context/SavedArticlesContext';
import { AppContext } from '../../context/AppContext';
import { useArticles } from '../../hooks/useArticles';
import { fetchArticles } from '../../api/articlesApi';
import { AuthContext } from '../../context/AuthContext';
import { useDefaultCollection } from '../../context/DefaultCollectionContext';
import EmptyState from './EmptyState';
import NoCollectionChosen from './NoCollectionChosen';
import { useSnackbar, SNACKBAR_TYPES } from '../../context/SnackbarContext';

/**
 * Composant d'affichage de la liste des articles avec scroll infini
 * @param {Object} props
 * @param {Object} props.filters - Filtres à appliquer au feed (optionnel, fourni par le parent)
 * @param {number} props.pageSize - Nombre d'articles par page (optionnel, défaut: 20)
 */
const ArticleList = ({ filters, pageSize = 20 }) => {
  const { allCollections } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const { saveArticle, unsaveArticle } = useSavedArticles();
  const { showSnackbar } = useSnackbar();
  const { defaultCollection } = useDefaultCollection();

  // Vérifier si des filtres existent dans le localStorage
  const savedFilters = localStorage.getItem('articleFilters');
  const hasStoredFilters = !!savedFilters;

  // Déterminer la collection active
  const activeCollectionId = filters?.collection || defaultCollection?._id;
  const activeCollection = allCollections?.find((c) => c._id === activeCollectionId);

  // Utiliser le hook généraliste pour les articles
  const { articles, loading, error, hasMore, loadMore, updateArticle } = useArticles({
    fetchArticlesFn: fetchArticles,
    collections: allCollections,
    options: {
      pageSize,
      initialFilters: filters,
    },
  });

  // Référence pour l'observateur d'intersection
  const observer = useRef();
  const loadingRef = useRef(loading);

  // Mettre à jour la ref de loading quand loading change
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  // Callback pour l'observateur d'intersection (infinite scroll)
  const lastArticleRef = useCallback(
    (node) => {
      if (loadingRef.current || !node) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
            loadMore().catch(console.error);
          }
        },
        {
          root: null,
          rootMargin: '100px',
          threshold: 0.1,
        }
      );

      observer.current.observe(node);
    },
    [hasMore, loadMore]
  );

  // Nettoyer l'observer
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

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

      updateArticle(articleId, { isSaved: !article.isSaved });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'article:", error);
    }
  };

  // Si nous sommes sur /app sans paramètres d'URL et sans filtres stockés
  const isOnDashboardWithoutParams = window.location.pathname === '/app' && !window.location.search;

  if (loading && articles.length === 0) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isOnDashboardWithoutParams && !hasStoredFilters && !activeCollectionId) {
    return <NoCollectionChosen />;
  }

  if (activeCollectionId && !loading && articles.length === 0) {
    return (
      <EmptyState
        collectionName={activeCollection?.name}
        collectionId={activeCollection?._id}
        isDefaultCollection={activeCollection?._id === defaultCollection?._id}
      />
    );
  }

  return (
    <div className="article-list -mx-3 sm:mx-0">
      {articles.map((article, index) => (
        <div
          ref={index === articles.length - 1 ? lastArticleRef : null}
          key={article._id}
          className="mb-3 last:mb-0"
        >
          <ArticleCard article={article} onSave={handleSave} onShare={handleShare} />
        </div>
      ))}

      {error && (
        <div className="flex justify-center py-4">
          <div className="text-red-500">{error}</div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {!loading && !hasMore && articles.length > 0 && (
        <div className="text-center py-6 text-gray-500">Vous avez atteint la fin de la liste</div>
      )}
    </div>
  );
};

export default ArticleList;
