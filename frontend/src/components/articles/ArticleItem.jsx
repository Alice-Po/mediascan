import React from 'react';
import { BookmarkIcon } from '../common/icons';

/**
 * Composant pour afficher un article sauvegardé dans la sidebar
 * Ce composant est utilisé pour afficher une version compacte d'un article
 * sauvegardé, principalement dans la sidebar.
 *
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.article - Données de l'article
 * @param {string} props.article._id - ID de l'article
 * @param {string} props.article.title - Titre de l'article
 * @param {string} [props.article.link] - Lien externe de l'article
 * @param {string} [props.article.imageUrl] - URL de l'image de l'article (optionnel)
 * @param {string} [props.article.publishedAt] - Date de publication (optionnel)
 * @param {string} [props.article.sourceName] - Nom de la source de l'article (optionnel)
 * @param {Function} props.onUnsave - Fonction appelée pour désauvegarder l'article
 * @returns {JSX.Element} Composant ArticleItem
 */
const ArticleItem = ({ article, onUnsave }) => {
  // Vérifier que l'article est un objet valide
  if (!article || !article._id || !article.title) {
    console.warn('ArticleItem: article invalide ou incomplet', article);
    return null;
  }

  // Handler pour empêcher la propagation du clic lors de la désauvegarde
  const handleUnsaveClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onUnsave(article._id, e);
  };

  // Formater la date de publication
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString()
    : '';

  // Utiliser le lien externe de l'article, ou fallback sur la page détaillée interne
  const articleUrl = article.link || `/article/${article._id}`;

  // Ouvrir le lien dans un nouvel onglet si c'est un lien externe
  const isExternalLink = article.link && !article.link.startsWith('/');
  const linkProps = isExternalLink
    ? {
        href: articleUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {
        href: articleUrl,
      };

  return (
    <div className="p-2 hover:bg-gray-50 rounded-md border border-gray-100">
      <a {...linkProps} className="block">
        <div className="flex items-start gap-2">
          {/* Image de l'article si disponible */}
          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt=""
              className="w-12 h-12 object-cover rounded flex-shrink-0"
              loading="lazy"
            />
          )}

          {/* Informations textuelles */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium line-clamp-2 leading-tight mb-1">{article.title}</h4>

            {/* Source et date */}
            {(article.sourceName || formattedDate) && (
              <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500 mb-1">
                {article.sourceName && <span className="font-medium">{article.sourceName}</span>}
                {formattedDate && <span>{formattedDate}</span>}
              </div>
            )}

            {/* Bouton de désauvegarde */}
            <div className="flex justify-end">
              <button
                onClick={handleUnsaveClick}
                className="text-gray-400 hover:text-red-500"
                title="Retirer des sauvegardés"
              >
                <BookmarkIcon className="w-4 h-4" filled={true} />
              </button>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ArticleItem;
