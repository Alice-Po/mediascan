import React, { useState } from 'react';
import { trackEvent } from '../../api/analyticsApi';
import SourceDetails from '../sources/SourceDetails';
import ArticlePreview from './ArticlePreview';
import { fetchSourceById } from '../../api/sourcesApi';
import { BookmarkIcon, ShareIcon } from '../common/icons';
import { useSnackbar, SNACKBAR_TYPES } from '../../context/SnackbarContext';
import { formatRelativeTime } from '../../utils/timeUtils';
import Modal from '../common/Modal';
/**
 * Composant d'affichage d'un article
 * @param {Object} article - Données de l'article
 * @param {Function} onSave - Fonction pour sauvegarder/désauvegarder l'article
 * @param {Function} onShare - Fonction pour partager l'article
 */
const ArticleCard = ({ article, onSave, onShare }) => {
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [sourceDetails, setSourceDetails] = useState(null);
  const { showSnackbar } = useSnackbar();

  // Gérer le clic sur le bouton de sauvegarde
  const handleSaveClick = (e) => {
    e.stopPropagation(); // Empêcher la navigation vers l'article
    if (onSave && article && article._id) {
      onSave(article._id);
    }
  };

  // Gérer le clic sur le bouton de partage
  const handleShareClick = async (e) => {
    e.stopPropagation(); // Empêcher la navigation vers l'article

    const shareText = `Regarde ce que j'ai trouvé sur Médiascan !\n\n📰 ${article.title}\n\n${article.contentSnippet}\n\nDécouvrez cet article et bien d'autres sur MediaScan, votre agrégateur social d'actualités.\n\n${article.link}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: shareText,
          url: article.link,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        showSnackbar('Article et message copiés dans le presse-papier !', SNACKBAR_TYPES.SUCCESS);
      }
    } catch (error) {
      console.error('Error sharing article:', error);
      showSnackbar("Erreur lors du partage de l'article", SNACKBAR_TYPES.ERROR);
    }
  };

  const handleArticleClick = (e) => {
    e.preventDefault();
    setIsPreviewModalOpen(true);
  };

  const handleVisitSite = async () => {
    try {
      // S'assurer que l'orientation est un objet
      let orientation = article.orientation;

      if (typeof orientation === 'string') {
        try {
          const cleanStr = orientation
            .replace(/\n/g, '')
            .replace(/\\n/g, '')
            .replace(/'/g, '"')
            .trim();
          orientation = JSON.parse(cleanStr);
        } catch (parseError) {
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

      // Ouvrir l'article dans un nouvel onglet
      window.open(article.link, '_blank');
      setIsPreviewModalOpen(false);
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

  if (!article || !article.title) {
    console.warn('[ArticleCard] Article invalide:', article);
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mb-4">
        <div
          onClick={handleArticleClick}
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

            {/* Source, auteur et date - Regroupés en ligne */}
            <div className="flex items-center gap-2 mb-2 flex-wrap text-xs text-gray-600">
              {article.creator && (
                <>
                  <span>Par {article.creator}</span>
                  <span className="text-gray-400">•</span>
                </>
              )}
              <button
                onClick={handleSourceClick}
                className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
              >
                {article.sourceFavicon && (
                  <img src={article.sourceFavicon} alt={article.sourceName} className="w-4 h-4" />
                )}
                <span className="font-medium">{article.sourceName}</span>
              </button>
              <span className="text-gray-400">•</span>
              <span>{formatRelativeTime(article.publishedAt)}</span>
            </div>

            {/* Extrait de l'article */}
            <p className="text-sm text-gray-600 line-clamp-3 mb-2">{article.contentSnippet}</p>

            {/* Métadonnées et actions */}
            <div className="mt-auto flex items-center justify-between">
              {/* Tags et orientation politique */}
              <div className="flex flex-wrap gap-1">
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

      {/* Modal de la source */}
      <Modal
        isOpen={isSourceModalOpen}
        onClose={() => {
          setIsSourceModalOpen(false);
          setSourceDetails(null);
        }}
        title={sourceDetails && sourceDetails.name}
        size="md"
      >
        <SourceDetails source={sourceDetails} />
      </Modal>

      {/* Modal de prévisualisation de l'article */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Article"
        size="xl"
      >
        <ArticlePreview
          article={article}
          onSave={handleSaveClick}
          onShare={handleShareClick}
          onVisit={handleVisitSite}
        />
      </Modal>
    </>
  );
};

export default ArticleCard;
