import React from 'react';
import Badge from '../common/Badge';

const SourceDetailsModal = ({ isOpen, onClose, source }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Favicon/Logo */}
              <div className="flex-shrink-0">
                {source.faviconUrl ? (
                  <img
                    src={source.faviconUrl}
                    alt={`Logo ${source.name}`}
                    className="w-12 h-12 rounded object-contain bg-gray-50"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`w-12 h-12 rounded flex items-center justify-center text-lg font-semibold bg-gray-100 text-gray-600 ${
                    source.faviconUrl ? 'hidden' : ''
                  }`}
                >
                  {source.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900">{source.name}</h3>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <span className="sr-only">Fermer</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="px-8 py-6 space-y-6">
          {/* Orientation  */}
          {source.orientation && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Orientation </h3>
              {source.orientation.map((orientation) => (
                <Badge text={orientation} />
              ))}
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-sm text-gray-900">{source.description}</p>
          </div>

          {/* Financement */}
          {source.funding && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Financement</h3>
              <div className="mt-1">
                <span className="text-sm font-medium text-gray-900">
                  {source.funding.type === 'private'
                    ? 'Privé'
                    : source.funding.type === 'public'
                    ? 'Public'
                    : source.funding.type === 'cooperative'
                    ? 'Coopératif'
                    : source.funding.type === 'association'
                    ? 'Associatif'
                    : source.funding.type === 'independent'
                    ? 'Indépendant'
                    : source.funding.type}
                </span>
                <p className="text-sm text-gray-600">{source.funding.details}</p>
              </div>
            </div>
          )}

          {/* URLs */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">URLs</h3>
            <div className="mt-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">Site web : </span>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {source.url}
                </a>
              </p>
              <p className="text-sm">
                <span className="font-medium">Flux RSS : </span>
                <a
                  href={source.rssUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {source.rssUrl}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceDetailsModal;
