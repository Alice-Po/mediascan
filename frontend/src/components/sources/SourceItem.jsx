import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ORIENTATIONS } from '../../constants';
import { isLightColor } from '../../utils/colorUtils';
import SourceDetailsModal from './SourceDetailsModal';

// Icône de poubelle personnalisée
const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

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

// Ajouter l'icône de collection
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

// Déplacer la fonction au niveau du module
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

// Composant de base
const SourceItemBase = ({ source, children, leftAction, onAddToCollection }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log('source', source);
  const bgColor = ORIENTATIONS.political[source.orientation?.political]?.color || '#f3f4f6';
  const textColor = isLightColor(bgColor) ? '#000000' : '#ffffff';

  // S'assurer que la description existe et est une chaîne
  const description = source.description || '';
  const words = description.split(' ');
  const shortDescription = words.length > 20 ? words.slice(0, 20).join(' ') + '...' : description;

  const handleClick = (e) => {
    // Ne pas ouvrir la modal si on clique sur un bouton ou un lien
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) {
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleClick}
      >
        {/* Action à gauche (checkbox, etc.) */}
        {leftAction && <div className="flex-shrink-0">{leftAction}</div>}

        {/* Logo et infos */}
        <div className="flex flex-1 min-w-0 gap-3 sm:gap-4">
          {/* Logo */}
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
              className={`w-12 h-12 rounded flex items-center justify-center text-lg font-semibold ${
                source.faviconUrl ? 'hidden' : ''
              }`}
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              {source.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Informations */}
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
              {source.name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 sm:line-clamp-1">{shortDescription}</p>

            {/* Financement */}
            {source.funding && (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">
                  {getFundingTypeLabel(source.funding.type)}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-500 truncate" title={source.funding.details}>
                  {source.funding.details}
                </span>
              </div>
            )}

            {/* Tags et orientation en version mobile */}
            <div className="flex flex-wrap gap-2 sm:hidden mt-2">
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${bgColor}33`, // Ajoute une transparence
                  color:
                    ORIENTATIONS.political[source.orientation.political]?.textColor || 'inherit',
                }}
              >
                {getPoliticalOrientationLabel(source.orientation.political)}
              </span>
              {source.categories?.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Tags et orientation en version desktop */}
          <div className="hidden sm:flex flex-shrink-0 items-center gap-2">
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${bgColor}33`,
                color: ORIENTATIONS.political[source.orientation.political]?.textColor || 'inherit',
              }}
            >
              {getPoliticalOrientationLabel(source.orientation.political)}
            </span>
            {source.categories?.map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-shrink-0 gap-2">
          {/* Bouton "Ajouter à une collection" */}
          {onAddToCollection && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCollection(source);
              }}
              className="text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-50"
              title="Ajouter à une collection"
              aria-label="Ajouter à une collection"
            >
              <CollectionIcon className="h-5 w-5" />
            </button>
          )}

          {/* Bouton d'information */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-50"
            title="Voir les détails de cette source"
            aria-label="Voir les détails de cette source"
          >
            <InfoIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Actions à droite */}
        {children && (
          <div className="flex justify-end items-center gap-2 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0">
            {children}
          </div>
        )}
      </div>

      <SourceDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source={source}
      />
    </>
  );
};

// Variante sélectionnable pour l'onboarding
export const SelectableSourceItem = ({ source, isSelected, onToggle, compact = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const bgColor = ORIENTATIONS.political[source.orientation.political]?.color || '#f3f4f6';

  const handleClick = (e) => {
    if (e.target.type === 'checkbox') {
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`
          flex flex-col sm:flex-row items-start sm:items-center 
          ${compact ? 'p-2' : 'p-3 sm:p-4'} 
          bg-white rounded-lg shadow-sm 
          hover:bg-gray-50 transition-colors cursor-pointer
          ${isSelected ? 'border-2 border-blue-500' : 'border border-gray-200'}
        `}
      >
        <div className="flex items-start w-full gap-3">
          {/* Logo */}
          <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} flex-shrink-0`}>
            {source.faviconUrl ? (
              <img
                src={source.faviconUrl}
                alt={`Logo ${source.name}`}
                className="w-full h-full object-contain rounded"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : (
              <div
                className="w-full h-full rounded flex items-center justify-center text-sm font-medium"
                style={{
                  backgroundColor: `${bgColor}33`,
                  color:
                    ORIENTATIONS.political[source.orientation.political]?.textColor || 'inherit',
                }}
              >
                {source.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-medium text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
                {source.name}
              </h3>

              {/* Checkbox en version mobile */}
              <div className="sm:hidden flex-shrink-0">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(source._id)}
                  className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <p className="text-sm text-gray-500 line-clamp-2 sm:line-clamp-1">
              {source.description}
            </p>

            {/* Orientation politique */}
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${bgColor}33`,
                  color:
                    ORIENTATIONS.political[source.orientation.political]?.textColor || 'inherit',
                }}
              >
                {getPoliticalOrientationLabel(source.orientation.political)}
              </span>
              <span className="text-xs font-medium text-gray-500">
                {getFundingTypeLabel(source.funding?.type)}
              </span>
            </div>
          </div>
        </div>

        {/* Checkbox en version desktop */}
        <div className="hidden sm:block ml-4 flex-shrink-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggle(source._id)}
            className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Bouton d'information */}
        <div className="flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-50"
            title="Voir les détails de cette source"
            aria-label="Voir les détails de cette source"
          >
            <InfoIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <SourceDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source={source}
      />
    </>
  );
};

// Variante avec bouton de suppression pour la page Sources
export const DeletableSourceItem = ({ source, onDelete, onAddToCollection }) => (
  <SourceItemBase source={source} onAddToCollection={onAddToCollection}>
    <div className="flex space-x-2">
      {/* Bouton pour ajouter à une collection
      {onAddToCollection && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCollection(source);
          }}
          className="text-gray-400 hover:text-indigo-600 transition-colors"
          title="Ajouter à une collection"
        >
          <CollectionIcon className="h-5 w-5" />
        </button>
      )} */}

      {/* Bouton pour supprimer */}
      <button
        onClick={onDelete}
        className="text-gray-400 hover:text-red-600 transition-colors"
        title="Retirer cette source"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  </SourceItemBase>
);

// Variante avec bouton de suppression et ajout à une collection pour la page Sources
export const CollectibleDeletableSourceItem = ({ source, onDelete, onAddToCollection }) => (
  <SourceItemBase source={source} onAddToCollection={onAddToCollection}>
    <div className="flex-shrink-0">
      <button
        onClick={onDelete}
        className="text-gray-400 hover:text-red-600 transition-colors"
        title="Retirer cette source"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  </SourceItemBase>
);

// Variante simple pour l'autocomplétion
export const SimpleSourceItem = ({ source }) => <SourceItemBase source={source} />;

// Variante avec bouton d'ajout à une collection
export const CollectibleSourceItem = ({ source, onAddToCollection }) => (
  <SourceItemBase source={source} onAddToCollection={onAddToCollection} />
);

// PropTypes
const sourceShape = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  faviconUrl: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  orientation: PropTypes.shape({
    political: PropTypes.string.isRequired,
  }).isRequired,
};

SourceItemBase.propTypes = {
  source: PropTypes.shape(sourceShape).isRequired,
  children: PropTypes.node,
  leftAction: PropTypes.node,
  onAddToCollection: PropTypes.func,
};

SelectableSourceItem.propTypes = {
  source: PropTypes.shape(sourceShape).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  compact: PropTypes.bool,
};

DeletableSourceItem.propTypes = {
  source: PropTypes.shape(sourceShape).isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddToCollection: PropTypes.func,
};

CollectibleDeletableSourceItem.propTypes = {
  source: PropTypes.shape(sourceShape).isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddToCollection: PropTypes.func.isRequired,
};

SimpleSourceItem.propTypes = {
  source: PropTypes.shape(sourceShape).isRequired,
};

CollectibleSourceItem.propTypes = {
  source: PropTypes.shape(sourceShape).isRequired,
  onAddToCollection: PropTypes.func.isRequired,
};

export default SimpleSourceItem;
