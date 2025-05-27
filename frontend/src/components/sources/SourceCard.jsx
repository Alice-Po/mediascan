import React from 'react';
import PropTypes from 'prop-types';
import SourceDetails from './SourceDetails';
import Badge from '../common/Badge';
import { InfoIcon, PlusIcon } from '../common/icons';
import Modal from '../common/Modal';
import Avatar from '../common/Avatar';

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

const SourceCard = ({
  source,
  onAddToCollection,
  isActive,
  enableAddSourceToCollectionAction = true,
}) => {
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
        {/* Header compact avec Avatar */}
        <div className="flex items-center gap-2 p-2 border-b border-gray-100 bg-gray-50">
          <Avatar
            userId={source._id}
            className="w-10 h-10"
            size={40}
            // Pour un fallback sur favicon ou imageUrl, on peut adapter Avatar ou ajouter une prop custom
            src={source.imageUrl || source.faviconUrl}
            alt={source.name}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-gray-900 truncate mb-0.5">{source.name}</h3>
            {source.website && (
              <a
                href={source.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                {source.website.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            )}
          </div>
        </div>

        {/* Content compact */}
        <div className="p-2 flex-grow flex flex-col gap-1">
          {/* Description réduite */}
          <p className="text-xs text-gray-500 mb-1 line-clamp-2">{shortDescription}</p>

          {/* Funding details */}
          {source.funding && source.funding.details && (
            <div className="mb-1 text-xs text-gray-600">
              <span className="font-medium">Financement:</span>{' '}
              <span className="line-clamp-1">{source.funding.details}</span>
            </div>
          )}

          {/* Tags - simplification */}
          <div className="flex flex-wrap gap-1 mb-1">
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

          {/* Actions - compact */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-auto pt-1 border-t border-gray-100 gap-2">
            {/* Ajouter à une collection */}
            {onAddToCollection && !isActive && enableAddSourceToCollectionAction && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCollection(source);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold text-sm mt-2 sm:mt-0"
                title="Ajouter à une collection"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Ajouter</span>
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
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={source.name}
        size="md"
      >
        <SourceDetails source={source} />
      </Modal>
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
  enableAddSourceToCollectionAction: PropTypes.bool,
};

SourceCard.defaultProps = {
  isActive: false,
  enableAddSourceToCollectionAction: true,
};

export default SourceCard;
