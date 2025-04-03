import React from 'react';

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
  if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} minutes`;
  if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} heures`;
  if (diffInSeconds < 604800) return `il y a ${Math.floor(diffInSeconds / 86400)} jours`;

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
    e.stopPropagation(); // Empêcher la navigation vers l'article
    onSave(article.id);
  };

  // Gérer le clic sur le bouton de partage
  const handleShareClick = (e) => {
    e.stopPropagation(); // Empêcher la navigation vers l'article
    onShare(article.link);
  };

  // Ouvrir l'article dans un nouvel onglet
  const openArticle = () => {
    window.open(article.link, '_blank');
  };

  return (
    <div
      className="card h-[180px] mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={openArticle}
    >
      <div className="flex h-full">
        {/* Image de l'article (si disponible) */}
        {article.image && (
          <div className="flex-shrink-0 w-1/3 h-full">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Contenu de l'article */}
        <div className={`flex flex-col p-3 ${article.image ? 'w-2/3' : 'w-full'}`}>
          {/* Titre de l'article (max 2 lignes) */}
          <h3 className="text-base font-semibold line-clamp-2 mb-1">{article.title}</h3>

          {/* Extrait de l'article (max 3 lignes) */}
          <p className="text-sm text-gray-600 line-clamp-3 mb-2">{article.contentSnippet}</p>

          {/* Métadonnées et actions */}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Favicon de la source */}
              {article.sourceFavicon && (
                <img src={article.sourceFavicon} alt={article.sourceName} className="w-4 h-4" />
              )}

              {/* Nom de la source */}
              <span className="text-xs font-medium">{article.sourceName}</span>

              {/* Date de publication - utiliser directement formatRelativeTime */}
              <span className="text-xs text-gray-500">{formatRelativeTime(article.pubDate)}</span>
            </div>

            {/* Tags (thématique, orientation) */}
            <div className="flex flex-wrap gap-1">
              {article.categories &&
                article.categories.map((category, index) => (
                  <span key={index} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                    {category}
                  </span>
                ))}

              {article.orientation && article.orientation.political && (
                <span className="text-xs px-2 py-0.5 bg-primary-light bg-opacity-20 rounded-full">
                  {article.orientation.political}
                </span>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex space-x-2">
              <button
                onClick={handleSaveClick}
                className={`p-1 rounded-full transition-colors ${
                  article.isSaved
                    ? 'text-primary bg-primary-light bg-opacity-10'
                    : 'text-gray-500 hover:text-primary hover:bg-primary-light hover:bg-opacity-10'
                }`}
              >
                <BookmarkIcon filled={article.isSaved} />
              </button>

              <button
                onClick={handleShareClick}
                className="p-1 rounded-full text-gray-500 hover:text-primary hover:bg-primary-light hover:bg-opacity-10 transition-colors"
              >
                <ShareIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
