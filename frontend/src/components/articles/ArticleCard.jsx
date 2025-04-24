import React from 'react';
import { trackEvent } from '../../api/analyticsApi';
import { getOrientationColor, getOrientationLabel } from '../../constants';
import { isLightColor } from '../../utils/colorUtils';

// Icônes pour les actions
const BookmarkIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill={filled ? 'currentColor' : 'none'}
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
);

const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
    />
  </svg>
);

// Remplacer l'import de date-fns par une fonction utilitaire native
const formatRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  if (diffInSeconds < 60) return "à l'instant";

  const minutes = Math.floor(diffInSeconds / 60);
  if (diffInSeconds < 3600) {
    return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  const hours = Math.floor(diffInSeconds / 3600);
  if (diffInSeconds < 86400) {
    return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  }

  const days = Math.floor(diffInSeconds / 86400);
  if (diffInSeconds < 604800) {
    return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  }

  return new Date(date).toLocaleDateString('fr-FR');
};

/**
 * Composant d'affichage d'un article
 * @param {Object} article - Données de l'article
 * @param {Function} onSave - Fonction pour sauvegarder/désauvegarder l'article
 * @param {Function} onShare - Fonction pour partager l'article
 */
const ArticleCard = ({ article, onSave, onShare }) => {
  // Gérer le clic sur le bouton de sauvegarde
  const handleSaveClick = (e) => {
    console.log('Save button clicked', e); // Ajouter ce log
    e.stopPropagation(); // Empêcher la navigation vers l'article
    if (onSave && article && article._id) {
      onSave(article._id);
    }
  };

  // Gérer le clic sur le bouton de partage
  const handleShareClick = (e) => {
    e.stopPropagation(); // Empêcher la navigation vers l'article
    onShare(article.link);
  };

  const handleClick = async (e) => {
    try {
      // S'assurer que l'orientation est un objet
      let orientation = article.orientation;

      if (typeof orientation === 'string') {
        try {
          // Nettoyer la chaîne avant de la parser
          const cleanStr = orientation
            .replace(/\n/g, '')
            .replace(/\\n/g, '')
            .replace(/'/g, '"')
            .trim();
          orientation = JSON.parse(cleanStr);
        } catch (parseError) {
          console.warn("Erreur de parsing de l'orientation:", parseError);
          orientation = {
            political: 'non-spécifié',
          };
        }
      }

      await trackEvent({
        eventType: 'read',
        metadata: {
          articleId: article._id,
          sourceId: article.sourceId,
          orientation: orientation,
          category: article.categories?.[0],
          timestamp: new Date(),
        },
      });

      console.log('Article click tracked:', {
        articleId: article._id,
        orientation: orientation,
      });

      // Ouvrir l'article dans un nouvel onglet
      window.open(article.link, '_blank');
    } catch (error) {
      console.error('Error tracking article click:', error);
    }
  };

  // Helper pour obtenir l'orientation politique
  const getPoliticalOrientation = () => {
    if (!article.orientation || typeof article.orientation === 'string') {
      return null;
    }

    const political = article.orientation.political?.toLowerCase();
    if (!political) return null;

    return {
      color: getOrientationColor(political),
      label: getOrientationLabel(political),
    };
  };

  const politicalOrientation = getPoliticalOrientation();

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mb-4">
      <div
        onClick={handleClick}
        className="flex flex-col sm:flex-row cursor-pointer overflow-hidden"
      >
        {/* Image de l'article */}
        {article.image && (
          <div className="w-full sm:w-1/3 relative h-48 sm:h-auto">
            <img
              src={article.image}
              alt={article.title}
              className="object-cover w-full h-full"
              style={{ minHeight: '200px' }}
            />
          </div>
        )}

        {/* Contenu de l'article */}
        <div className={`flex flex-col p-3 ${article.image ? 'sm:w-2/3' : 'w-full'}`}>
          {/* En-tête avec auteur et langue */}
          <h3 className="text-base font-semibold line-clamp-2 mb-1">{article.title}</h3>
          <div className="flex items-center justify-between mb-2">
            {article.creator && (
              <span className="text-xs text-gray-600">Par {article.creator}</span>
            )}
          </div>

          {/* Extrait de l'article */}
          <p className="text-sm text-gray-600 line-clamp-3 mb-2">{article.contentSnippet}</p>

          {/* Métadonnées et actions */}
          <div className="mt-auto">
            {/* Tags et orientation politique */}
            <div className="flex flex-wrap gap-1 mb-2">
              {/* Orientation politique avec couleur */}
              {politicalOrientation && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1`}
                  style={{
                    backgroundColor: politicalOrientation.color,
                    color: isLightColor(politicalOrientation.color) ? '#000000' : '#ffffff',
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: isLightColor(politicalOrientation.color)
                        ? '#000000'
                        : '#ffffff',
                      opacity: 0.75,
                    }}
                  />
                  {politicalOrientation.label}
                </span>
              )}
            </div>

            {/* Source et date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {article.sourceFavicon && (
                  <img src={article.sourceFavicon} alt={article.sourceName} className="w-4 h-4" />
                )}
                <span className="text-xs font-medium">{article.sourceName}</span>
                <span className="text-xs text-gray-500">
                  {formatRelativeTime(article.publishedAt)}
                </span>
              </div>

              {/* Boutons d'action */}
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveClick}
                  className="p-1 hover:bg-gray-100 rounded-full"
                  aria-label={article.isSaved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <BookmarkIcon filled={article.isSaved} />
                </button>
                <button
                  onClick={handleShareClick}
                  className="p-1 hover:bg-gray-100 rounded-full"
                  aria-label="Partager l'article"
                >
                  <ShareIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
