import React, { useContext, useEffect, useRef, useCallback, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import ArticleCard from './ArticleCard';
import { useSavedArticles } from '../../context/SavedArticlesContext';
import { useDebounce } from '../../hooks/useDebounce';

/**
 * Composant d'affichage de la liste des articles avec scroll infini
 */
const ArticleList = () => {
  const { articles, loadingArticles, hasMoreArticles, loadMoreArticles, updateArticle } =
    useContext(AppContext);
  const { saveArticle, unsaveArticle } = useSavedArticles();

  // Référence pour l'observateur d'intersection
  const observer = useRef();

  // État pour gérer les erreurs de chargement
  const [loadError, setLoadError] = useState(null);

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
      // Ne pas observer si en cours de chargement ou s'il n'y a plus d'articles
      if (loadingArticles) return;

      // Nettoyer l'observateur précédent
      if (observer.current) observer.current.disconnect();

      // Créer un nouvel observateur
      observer.current = new IntersectionObserver(
        (entries) => {
          // Si l'élément devient visible et qu'il y a plus d'articles à charger
          if (entries[0].isIntersecting && hasMoreArticles) {
            // Appeler la fonction de chargement d'articles supplémentaires
            try {
              loadMoreArticles();
            } catch (error) {
              setLoadError("Impossible de charger plus d'articles. Veuillez réessayer.");
              console.error('Erreur lors du chargement des articles:', error);
            }
          }
        },
        {
          root: null, // Viewport utilisé comme conteneur d'observation
          rootMargin: '100px', // Déclencher un peu avant d'atteindre la fin
          threshold: 0.1, // Déclencher quand 10% de l'élément est visible
        }
      );

      // Observer le nouvel élément
      if (node) observer.current.observe(node);
    },
    [loadingArticles, hasMoreArticles, loadMoreArticles]
  );

  // Nettoyer l'observateur au démontage du composant
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

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

  // Affichage du message d'erreur
  const renderError = () => {
    return (
      <div className="flex justify-center py-4">
        <div className="text-red-500">{loadError}</div>
      </div>
    );
  };

  // Affichage du message de fin de liste
  const renderEndOfList = () => {
    if (!hasMoreArticles && articles.length > 0) {
      return (
        <div className="text-center py-6 text-gray-500">Vous avez atteint la fin de la liste</div>
      );
    }
    return null;
  };

  return (
    <div className="article-list -mx-3 sm:mx-0">
      {/* Liste des articles */}
      {articles.length > 0
        ? articles.map((article, index) => (
            <div
              ref={index === articles.length - 1 ? lastArticleRef : null}
              key={article._id}
              className="mb-3 last:mb-0"
            >
              <ArticleCard article={article} onSave={handleSave} onShare={handleShare} />
            </div>
          ))
        : !loadingArticles && renderNoArticles()}

      {/* Affichage des états */}
      {loadError && renderError()}
      {loadingArticles && renderLoading()}
      {!loadingArticles && renderEndOfList()}
    </div>
  );
};

export default ArticleList;
