import React, { useState } from 'react';
import Badge from '../common/Badge';
import ArticleList from '../articles/ArticleList';
import { InfoIcon } from '../common/icons';
import Modal from '../common/Modal';

const SourceDetailsModal = ({ source }) => {
  const [showModeratorInfo, setShowModeratorInfo] = useState(false);

  if (!source) return null;

  // Créer les filtres pour ArticleList basés sur la source
  const filters = {
    sources: source._id ? [source._id] : [],
  };

  return (
    <div className="w-full">
      {/* En-tête avec helper */}
      <div className="flex items-center gap-4 mb-6">
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
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-900">{source.name}</h3>
            <button
              onClick={() => setShowModeratorInfo(true)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="Qui décrit les sources ?"
            >
              <InfoIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal d'information sur la modération */}
      <Modal
        isOpen={showModeratorInfo}
        onClose={() => setShowModeratorInfo(false)}
        title="Qui décrit les sources ?"
        size="md"
      >
        <div className="space-y-4 text-gray-600">
          <p>
            Actuellement, les descriptions et informations des sources sont renseignées par les
            contributeurs qui ajoutent les sources à la plateforme.
          </p>
          <p>
            À terme, nous souhaitons mettre en place un système de modération communautaire
            permettant à tous les utilisateurs de contribuer à l'amélioration des descriptions, à la
            vérification des informations et à la qualification des sources.
          </p>
          <p>
            Cette approche collaborative permettra d'assurer une plus grande transparence et une
            meilleure qualité des informations sur les sources.
          </p>
        </div>
      </Modal>

      {/* Orientations */}
      {source.orientations && source.orientations.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Orientation</h3>
          <div className="flex flex-wrap gap-2">
            {source.orientations.map((orientation, index) => (
              <Badge key={`${orientation}-${index}`} text={orientation} />
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500">Description</h3>
        <p className="mt-1 text-sm text-gray-900">{source.description}</p>
      </div>

      {/* Financement */}
      {source.funding && (
        <div className="mb-4">
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
                : source.funding.type === 'non-profit'
                ? 'Association'
                : source.funding.type}
            </span>
            <p className="text-sm text-gray-600">{source.funding.details}</p>
          </div>
        </div>
      )}

      {/* URLs */}
      <div className="mb-6">
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

      {/* Articles de la source */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-4">Articles récents</h3>
        <div className="mt-2">
          <ArticleList filters={filters} pageSize={10} />
        </div>
      </div>
    </div>
  );
};

export default SourceDetailsModal;
