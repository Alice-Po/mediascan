import React from 'react';
import PropTypes from 'prop-types';

const ArticlePreview = ({ article }) => {
  // Formater la date de publication
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date inconnue';
      }
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error);
      return 'Date inconnue';
    }
  };

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 hover:bg-gray-50 rounded-md border border-gray-100 transition-colors"
    >
      <div className="space-y-2">
        {/* Date de publication */}
        <div className="text-xs font-medium text-indigo-600">{formatDate(article.pubDate)}</div>

        {/* Titre */}
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{article.title}</h4>

        {/* Description */}
        {article.contentSnippet && (
          <p className="text-xs text-gray-600 line-clamp-2">{article.contentSnippet}</p>
        )}
      </div>
    </a>
  );
};

ArticlePreview.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    contentSnippet: PropTypes.string,
    pubDate: PropTypes.string,
  }).isRequired,
};

export default ArticlePreview;
