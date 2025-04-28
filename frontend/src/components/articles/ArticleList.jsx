import React, { useContext, useEffect, useRef, useCallback } from 'react';
import { AppContext } from '../../context/AppContext';
import ArticleCard from './ArticleCard';
import { saveArticle, unsaveArticle } from '../../api/articlesApi';

/**
 * Composant d'affichage de la liste des articles
 */
const ArticleList = () => {
  const { articles, loadingArticles, hasMoreArticles, loadMoreArticles, updateArticle } =
    useContext(AppContext);

  // Référence pour l'élément observé pour l'infinite scroll
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
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      navigator.clipboard
        .writeText(url)
        .then(() => alert('Lien copié dans le presse-papier'))
        .catch(console.error);
    }
  };

  // Fonction pour gérer la sauvegarde/désauvegarde d'un article
  const handleSave = async (articleId) => {
    try {
      console.log('Trying to save article:', articleId);
      const article = articles.find((a) => a._id === articleId);
      if (!article) return;

      if (article.isSaved) {
        await unsaveArticle(articleId);
      } else {
        await saveArticle(articleId);
      }

      // Mettre à jour l'état de l'article dans le contexte
      updateArticle(articleId, { isSaved: !article.isSaved });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'article:", error);
    }
  };

  // Callback pour l'observateur d'intersection (infinite scroll)
  const lastArticleRef = useCallback(
    (node) => {
      if (loadingArticles) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreArticles) {
          loadMoreArticles();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingArticles, hasMoreArticles, loadMoreArticles]
  );

  // Fonction pour afficher un message si aucun article
  const renderNoArticles = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500 text-lg mb-4">Aucun article ne correspond à vos critères.</p>
        <p className="text-gray-400">
          Essayez de modifier vos filtres ou d'ajouter d'autres sources.
        </p>
      </div>
    );
  };

  // Fonction pour afficher l'indicateur de chargement
  const renderLoading = () => {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  };

  return (
    <div className="article-list -mx-3 sm:mx-0">
      {/* Liste des articles */}
      {articles.length > 0
        ? articles.map((article, index) => {
            if (articles.length === index + 1) {
              return (
                <div ref={lastArticleRef} key={article._id} className="mb-3 last:mb-0">
                  <ArticleCard article={article} onSave={handleSave} onShare={handleShare} />
                </div>
              );
            } else {
              return (
                <div key={article._id} className="mb-3 last:mb-0">
                  <ArticleCard article={article} onSave={handleSave} onShare={handleShare} />
                </div>
              );
            }
          })
        : !loadingArticles
        ? renderNoArticles()
        : null}

      {/* Indicateur de chargement */}
      {loadingArticles && renderLoading()}
    </div>
  );
};

export default ArticleList;
