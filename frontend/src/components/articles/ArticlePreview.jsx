import React from 'react';
import PropTypes from 'prop-types';
import { BookmarkIcon, ShareIcon, ExternalLinkIcon } from '../common/icons';
import { formatRelativeTime } from '../../utils/timeUtils';

const ArticlePreview = ({ article, onSave, onShare, onVisit }) => {
  return (
    <div className="flex flex-col space-y-4">
      {/* Image de l'article si disponible */}
      {article.image && (
        <div className="w-full relative h-64">
          <img
            src={article.image}
            alt={article.title}
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
      )}

      <div className="space-y-4">
        {/* En-tête avec source et date */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="flex items-center">
            {article.sourceFavicon && (
              <img src={article.sourceFavicon} alt={article.sourceName} className="w-4 h-4 mr-2" />
            )}
            <span className="font-medium">{article.sourceName}</span>
          </div>
          <span className="text-gray-400">•</span>
          <span>{formatRelativeTime(article.publishedAt)}</span>
          {article.creator && (
            <>
              <span className="text-gray-400">•</span>
              <span>Par {article.creator}</span>
            </>
          )}
        </div>

        {/* Titre */}
        <h2 className="text-xl font-bold text-gray-900">{article.title}</h2>

        {/* Contenu complet */}
        <div className="prose prose-sm max-w-none">
          {article.content ? (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          ) : (
            <p className="text-gray-600">{article.contentSnippet}</p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            onClick={onVisit}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ExternalLinkIcon className="w-4 h-4 mr-2" />
            Voir sur le site
          </button>
          <button
            onClick={onShare}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <ShareIcon className="w-4 h-4 mr-2" />
            Partager
          </button>
          <button
            onClick={onSave}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <BookmarkIcon className="w-4 h-4 mr-2" filled={article.isSaved} />
            {article.isSaved ? 'Sauvegardé' : 'Sauvegarder'}
          </button>
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
