import React from 'react';
import PropTypes from 'prop-types';
import SourceDetails from './SourceDetails';
import Badge from '../common/Badge';
import { InfoIcon, PlusIcon } from '../common/icons';
import Modal from '../common/Modal';
import Avatar from '../common/Avatar';

/**
 * Traduit le type de financement en label lisible
 * @param {string} type - Type de financement (private, public, cooperative, etc.)
 * @returns {string} Label traduit du type de financement
 */
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

/**
 * Composant SourceCard - Affiche une carte représentant une source d'information
 *
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.source - Les données de la source
 * @param {string} props.source._id - Identifiant unique de la source
 * @param {string} props.source.name - Nom de la source
 * @param {string} [props.source.faviconUrl] - URL du favicon de la source
 * @param {string} [props.source.imageUrl] - URL de l'image de la source
 * @param {string} [props.source.description] - Description de la source
 * @param {string[]} [props.source.categories] - Catégories de la source
 * @param {Object} [props.source.orientation] - Orientation politique de la source
 * @param {Object} [props.source.funding] - Informations sur le financement
 * @param {string} [props.source.website] - Site web de la source
 * @param {Function} [props.onToggleSourceInCollection] - Callback pour ajouter/retirer la source d'une collection
 * @param {boolean} [props.isActive] - Indique si la source est dans la collection courante
 * @param {boolean} [props.enableAddSourceToCollectionAction] - Active/désactive le bouton d'ajout à la collection
 * @param {boolean} [props.loading] - Affiche un spinner sur le bouton si true
 *
 * @example
 * <SourceCard
 *   source={{
 *     _id: "123",
 *     name: "Le Monde",
 *     description: "Journal quotidien français",
 *     website: "https://lemonde.fr"
 *   }}
 *   onToggleSourceInCollection={(source, isActive) => {}}
 *   isActive={false}
 * />
 */
const SourceCard = ({
  source,
  onToggleSourceInCollection,
  isActive,
  enableAddSourceToCollectionAction = true,
  loading = false,
}) => {
  // État local pour la modale et le chargement du favicon
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [faviconLoaded, setFaviconLoaded] = React.useState(true);

  // Préparation de la description courte (15 mots max)
  const description = source.description || '';
  const words = description.split(' ');
  const shortDescription = words.length > 15 ? words.slice(0, 15).join(' ') + '...' : description;

  // Génération des initiales pour l'avatar de fallback
  const initials = source.name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('');

  /**
   * Gère le clic sur la carte
   * N'ouvre pas la modale si le clic est sur un bouton ou un lien
   */
  const handleCardClick = (e) => {
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
        {/* En-tête de la carte avec avatar et informations principales */}
        <div className="flex items-center gap-2 p-2 border-b border-gray-100 bg-gray-50">
          <Avatar
            userId={source._id}
            className="w-10 h-10"
            size={40}
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

        {/* Contenu principal de la carte */}
        <div className="p-2 flex-grow flex flex-col gap-1">
          {/* Description courte */}
          <p className="text-xs text-gray-500 mb-1 line-clamp-2">{shortDescription}</p>

          {/* Informations de financement */}
          {source.funding?.details && (
            <div className="mb-1 text-xs text-gray-600">
              <span className="font-medium">Financement:</span>{' '}
              <span className="line-clamp-1">{source.funding.details}</span>
            </div>
          )}

          {/* Tags et badges */}
          <div className="flex flex-wrap gap-1 mb-1">
            {/* Badges d'orientation */}
            {source.orientations?.length > 0 &&
              source.orientations.map((orientation, index) => (
                <Badge key={index} text={orientation} />
              ))}

            {/* Badge de type de financement */}
            {source.funding?.type && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {getFundingTypeLabel(source.funding.type)}
              </span>
            )}

            {/* Badge de catégorie principale */}
            {source.categories?.length > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {source.categories[0]}{' '}
                {source.categories.length > 1 && `+${source.categories.length - 1}`}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-auto pt-1 border-t border-gray-100 gap-2">
            {/* Bouton d'ajout/retrait de la collection */}
            {onToggleSourceInCollection && enableAddSourceToCollectionAction && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSourceInCollection(source, isActive);
                }}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow font-semibold text-sm mt-2 sm:mt-0 transition-colors
                  ${
                    isActive
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                title={isActive ? 'Retirer de la collection' : 'Ajouter à la collection'}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-1 text-gray-500" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Chargement...
                  </span>
                ) : isActive ? (
                  <span>Retirer</span>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4" />
                    <span>Ajouter</span>
                  </>
                )}
              </button>
            )}

            {/* Bouton de détails */}
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

      {/* Modale de détails */}
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

// Validation des props avec PropTypes
SourceCard.propTypes = {
  source: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    faviconUrl: PropTypes.string,
    imageUrl: PropTypes.string,
    description: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.string),
    orientations: PropTypes.arrayOf(PropTypes.string),
    funding: PropTypes.shape({
      type: PropTypes.string,
      details: PropTypes.string,
    }),
    website: PropTypes.string,
  }).isRequired,
  onToggleSourceInCollection: PropTypes.func,
  isActive: PropTypes.bool,
  enableAddSourceToCollectionAction: PropTypes.bool,
  loading: PropTypes.bool,
};

// Valeurs par défaut des props
SourceCard.defaultProps = {
  isActive: false,
  enableAddSourceToCollectionAction: true,
};

export default SourceCard;
