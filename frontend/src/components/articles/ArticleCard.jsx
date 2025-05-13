import React, { useState } from 'react';
import { trackEvent } from '../../api/analyticsApi';
import SourceDetailsModal from '../sources/SourceDetailsModal';
import { fetchSourceById } from '../../api/sourcesApi';
import Badge from '../common/Badge';
import { BookmarkIcon, ShareIcon } from '../common/icons';

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
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [sourceDetails, setSourceDetails] = useState(null);

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

  const handleSourceClick = async (e) => {
    e.stopPropagation(); // Empêcher l'ouverture de l'article
    try {
      const source = await fetchSourceById(article.sourceId._id);
      setSourceDetails(source);
      setIsSourceModalOpen(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la source:', error);
    }
  };

  return (
    <>
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
                  <button
                    onClick={handleSourceClick}
                    className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
                  >
                    {article.sourceFavicon && (
                      <img
                        src={article.sourceFavicon}
                        alt={article.sourceName}
                        className="w-4 h-4"
                      />
                    )}
                    <span className="text-xs font-medium">{article.sourceName}</span>
                  </button>
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

      {/* Modal de la source */}
      <SourceDetailsModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        source={
          sourceDetails || {
            name: article.sourceName,
            faviconUrl: article.sourceFavicon,
            _id: article.sourceId._id,
          }
        }
      />
    </>
  );
};

export default ArticleCard;
