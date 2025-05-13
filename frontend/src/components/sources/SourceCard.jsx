import React from 'react';
import PropTypes from 'prop-types';
import { ORIENTATIONS } from '../../constants';
import { isLightColor } from '../../utils/colorUtils';
import SourceDetailsModal from './SourceDetailsModal';

// Icône d'information
const InfoIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// Icône de collection
const CollectionIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    />
  </svg>
);

// Icône pour activer une source
const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

// Fonction pour obtenir le label traduit du type de financement
const getFundingTypeLabel = (type) => {
  const types = {
    private: 'Privé',
    public: 'Public',
    cooperative: 'Coopératif',
    association: 'Associatif',
    independent: 'Indépendant',
  };
  return types[type] || type;
};

// Fonction pour obtenir le label traduit de l'orientation politique
const getPoliticalOrientationLabel = (orientation) => {
  return ORIENTATIONS.political[orientation]?.label || orientation;
};

const SourceCard = ({ source, onAddToCollection, onEnableSource, isActive }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [faviconLoaded, setFaviconLoaded] = React.useState(true);

  // Log pour débogage
  console.log('SourceCard - source:', source._id, source.name);
  console.log('SourceCard - faviconUrl:', source.faviconUrl);

  const bgColor = ORIENTATIONS.political[source.orientation?.political]?.color || '#f3f4f6';
  const textColor = isLightColor(bgColor) ? '#000000' : '#ffffff';

  // Truncate description if needed
  const description = source.description || '';
  const words = description.split(' ');
  const shortDescription = words.length > 15 ? words.slice(0, 15).join(' ') + '...' : description;

  // Générer les initiales à partir du nom de la source
  const initials = source.name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('');

  console.log('SourceCard - initials:', initials);

  const handleCardClick = (e) => {
    // Don't open modal if clicking on a button
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer overflow-hidden flex flex-col h-full"
        onClick={handleCardClick}
      >
        {/* Header with image/logo */}
        <div className="relative h-24 bg-gray-100 overflow-hidden">
          {source.imageUrl ? (
            <img
              src={source.imageUrl}
              alt={source.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              {source.faviconUrl && faviconLoaded ? (
                <img
                  src={source.faviconUrl}
                  alt={`Logo ${source.name}`}
                  className="w-20 h-20 object-contain p-1"
                  onLoad={() => {
                    console.log('SourceCard - favicon loaded:', source.faviconUrl);
                    setFaviconLoaded(true);
                  }}
                  onError={(e) => {
                    console.log('SourceCard - favicon error:', source.faviconUrl);
                    e.target.style.display = 'none';
                    setFaviconLoaded(false);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl font-bold tracking-tight" style={{ color: textColor }}>
                    {initials || source.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Badge "Activée" si c'est le cas */}
          {isActive && (
            <div className="absolute top-1 right-1">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Activée
              </span>
            </div>
          )}
        </div>

        {/* Content - réduction du padding */}
        <div className="p-2.5 flex-grow flex flex-col">
          <h3 className="text-base font-medium text-gray-900 mb-1">{source.name}</h3>

          {/* Site web */}
          {source.website && (
            <a
              href={source.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline mb-1 inline-block"
            >
              {source.website.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          )}

          {/* Description réduite */}
          <p className="text-xs text-gray-500 mb-2 flex-grow line-clamp-2">{shortDescription}</p>

          {/* Funding details */}
          {source.funding && source.funding.details && (
            <div className="mb-2 text-xs text-gray-600">
              <span className="font-medium">Financement:</span>{' '}
              <span className="line-clamp-1">{source.funding.details}</span>
            </div>
          )}

          {/* Tags - simplification */}
          <div className="flex flex-wrap gap-1 mb-2">
            <span
              className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${bgColor}33`,
                color:
                  ORIENTATIONS.political[source.orientation?.political]?.textColor || 'inherit',
              }}
            >
              {getPoliticalOrientationLabel(source.orientation?.political)}
            </span>

            {source.funding && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {getFundingTypeLabel(source.funding.type)}
              </span>
            )}

            {source.categories?.length > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {source.categories[0]}{' '}
                {source.categories.length > 1 && `+${source.categories.length - 1}`}
              </span>
            )}
          </div>

          {/* Actions - rangées en ligne */}
          <div className="flex justify-between items-center mt-auto pt-1.5 border-t border-gray-100">
            {/* Ajouter à une collection */}
            {onAddToCollection && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCollection(source);
                }}
                className="text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded hover:bg-indigo-50"
                title="Ajouter à une collection"
              >
                <CollectionIcon className="h-4 w-4" />
              </button>
            )}

            {/* Activer la source */}
            {!isActive && onEnableSource && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEnableSource(source);
                }}
                className="text-gray-400 hover:text-green-600 transition-colors p-1 rounded hover:bg-green-50"
                title="Activer cette source"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            )}

            {/* Voir détails */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded hover:bg-indigo-50"
              title="Voir les détails"
            >
              <InfoIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de détails */}
      <SourceDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source={source}
      />
    </>
  );
};

SourceCard.propTypes = {
  source: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    faviconUrl: PropTypes.string,
    imageUrl: PropTypes.string,
    description: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.string),
    orientation: PropTypes.shape({
      political: PropTypes.string,
    }),
    funding: PropTypes.shape({
      type: PropTypes.string,
      details: PropTypes.string,
    }),
    website: PropTypes.string,
  }).isRequired,
  onAddToCollection: PropTypes.func,
  onEnableSource: PropTypes.func,
  isActive: PropTypes.bool,
};

SourceCard.defaultProps = {
  isActive: false,
};

export default SourceCard;
