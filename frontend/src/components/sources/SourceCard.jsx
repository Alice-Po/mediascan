import React from 'react';
import PropTypes from 'prop-types';
import SourceDetailsModal from './SourceDetailsModal';
import Badge from '../common/Badge';
import { InfoIcon, PlusIcon } from '../common/icons';

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

const SourceCard = ({ source, onAddToCollection, isActive }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [faviconLoaded, setFaviconLoaded] = React.useState(true);

  // Truncate description if needed
  const description = source.description || '';
  const words = description.split(' ');
  const shortDescription = words.length > 15 ? words.slice(0, 15).join(' ') + '...' : description;

  // Générer les initiales à partir du nom de la source
  const initials = source.name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('');

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
              style={{ backgroundColor: 'black' }}
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
                  <span className="text-3xl font-bold tracking-tight" style={{ color: 'white' }}>
                    {initials || source.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Badge "Dans la collection" si c'est le cas */}
          {isActive && (
            <div className="absolute top-1 right-1">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Dans la collection
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
            {source.orientations &&
              source.orientations.length > 0 &&
              source.orientations.map((orientation, index) => (
                <Badge key={index} text={orientation} />
              ))}

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
            {onAddToCollection && !isActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCollection(source);
                }}
                className="text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded hover:bg-indigo-50"
                title="Ajouter à une collection"
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
  isActive: PropTypes.bool,
};

SourceCard.defaultProps = {
  isActive: false,
};

export default SourceCard;
