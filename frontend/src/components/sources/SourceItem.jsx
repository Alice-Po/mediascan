import React from 'react';
import PropTypes from 'prop-types';
import { ORIENTATIONS } from '../../constants';
import { isLightColor } from '../../utils/colorUtils';

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

// Composant de base
const SourceItemBase = ({ source, children, leftAction }) => {
  const bgColor = ORIENTATIONS.political[source.orientation.political]?.color || '#f3f4f6';
  const textColor = isLightColor(bgColor) ? '#000000' : '#ffffff';

  // S'assurer que la description existe et est une chaîne
  const description = source.description || '';
  const words = description.split(' ');
  const shortDescription = words.length > 20 ? words.slice(0, 20).join(' ') + '...' : description;

  // Helper pour afficher le type de financement
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

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg shadow-sm">
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
          <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">{source.name}</h3>
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
                color: ORIENTATIONS.political[source.orientation.political]?.textColor || 'inherit',
              }}
            >
              {source.orientation.political}
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
            {source.orientation.political}
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

      {/* Actions à droite */}
      {children && (
        <div className="flex justify-end items-center gap-2 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0">
          {children}
        </div>
      )}
    </div>
  );
};

// Variante sélectionnable pour l'onboarding
export const SelectableSourceItem = ({ source, isSelected, onToggle }) => (
  <SourceItemBase
    source={source}
    leftAction={
      <div className="flex-shrink-0 mr-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
        />
      </div>
    }
  />
);

// Variante avec bouton de suppression pour la page Sources
export const DeletableSourceItem = ({ source, onDelete }) => (
  <SourceItemBase source={source}>
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
};

SelectableSourceItem.propTypes = {
  source: PropTypes.shape(sourceShape).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

DeletableSourceItem.propTypes = {
  source: PropTypes.shape(sourceShape).isRequired,
  onDelete: PropTypes.func.isRequired,
};

SimpleSourceItem.propTypes = {
  source: PropTypes.shape(sourceShape).isRequired,
};

export default SimpleSourceItem;
