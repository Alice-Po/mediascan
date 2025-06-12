import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BookmarkIcon, ShareIcon, ExternalLinkIcon } from '../common/icons';
import { formatRelativeTime } from '../../utils/timeUtils';
import FaviconPlaceholder from '../common/FaviconPlaceholder';

const ArticlePreview = ({ article, onSave, onShare, onVisit }) => {
  const [faviconError, setFaviconError] = useState(false);

  return (
    <div className="flex flex-col space-y-4">
      <div className="space-y-4">
        {/* Titre */}
        <h2 className="text-xl font-bold text-gray-900">{article.title}</h2>
        {/* En-tête avec source et date */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2 flex items-center justify-center">
                {!faviconError && article.sourceFavicon ? (
                  <img
                    src={article.sourceFavicon}
                    alt=""
                    className="w-full h-full"
                    onError={() => setFaviconError(true)}
                  />
                ) : (
                  <FaviconPlaceholder siteName={article.sourceName} size={16} />
                )}
              </div>
              <span className="font-medium">{article.sourceName}</span>
            </div>
            {article.creator && (
              <>
                <span className="text-gray-400">•</span>
                <span>Par {article.creator}</span>
              </>
            )}
          </div>
          <div className="text-sm text-gray-500">{formatRelativeTime(article.publishedAt)}</div>
        </div>

        {/* Contenu complet */}
        <div className="prose prose-sm max-w-none">
          {article.content ? (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          ) : (
            <p className="text-gray-600">{article.contentSnippet}</p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t">
          <button
            onClick={onVisit}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <ExternalLinkIcon className="w-4 h-4 mr-2" />
            Voir sur le site
          </button>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={onShare}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex-1 sm:flex-initial"
            >
              <ShareIcon className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Partager</span>
            </button>
            <button
              onClick={onSave}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex-1 sm:flex-initial"
            >
              <BookmarkIcon className="w-4 h-4 sm:mr-2" filled={article.isSaved} />
              <span className="hidden sm:inline">
                {article.isSaved ? 'Sauvegardé' : 'Sauvegarder'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ArticlePreview.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    content: PropTypes.string,
    contentSnippet: PropTypes.string,
    publishedAt: PropTypes.string,
    image: PropTypes.string,
    sourceName: PropTypes.string,
    sourceFavicon: PropTypes.string,
    creator: PropTypes.string,
    isSaved: PropTypes.bool,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onVisit: PropTypes.func.isRequired,
};

export default ArticlePreview;
