import React from 'react';
import PropTypes from 'prop-types';
import Badge from '../common/Badge';
import { TrashIcon, InfoIcon, CollectionIcon, PlusIcon } from '../common/icons';

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

/**
 * Récupère la première orientation d'une source
 * @param {Object} source - La source
 * @returns {string} La première orientation ou undefined
 */
const getFirstOrientation = (source) => {
  if (source.orientations && Array.isArray(source.orientations) && source.orientations.length > 0) {
    return source.orientations[0];
  }
  return undefined;
};

// Composant de base
const SourceItemBase = ({ source, children, leftAction, onAddToCollection, onClick }) => {
  // Récupérer l'orientation principale
  const primaryOrientation = getFirstOrientation(source);

  // S'assurer que la description existe et est une chaîne
  const description = source.description || '';
  const words = description.split(' ');
  const shortDescription = words.length > 20 ? words.slice(0, 20).join(' ') + '...' : description;

  const handleClick = (e) => {
    // Ne pas ouvrir la modal si on clique sur un bouton ou un lien
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) {
      return;
    }
    if (onClick) onClick(source);
  };

  return (
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
            style={{ backgroundColor: 'black', color: 'white' }}
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
            {primaryOrientation && <Badge text={primaryOrientation} />}
          </div>
        </div>

        {/* Tags et orientation en version desktop */}
        <div className="hidden sm:flex flex-shrink-0 items-center gap-2">
          {primaryOrientation && <Badge text={primaryOrientation} />}
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
            console.log('[SourceItem] Bouton info cliqué pour :', source);
            if (onClick) onClick(source);
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
  );
};

// Variante sélectionnable pour l'onboarding
export const SelectableSourceItem = ({
  source,
  isSelected,
  onToggle,
  compact = false,
  onClick,
}) => {
  // Récupérer l'orientation principale
  const primaryOrientation = getFirstOrientation(source);

  const handleClick = (e) => {
    if (e.target.type === 'checkbox') {
      return;
    }
    if (onClick) onClick(source);
  };

  return (
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
                backgroundColor: bgColor,
                color: getContrastTextColor(bgColor),
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

          <p className="text-sm text-gray-500 line-clamp-2 sm:line-clamp-1">{source.description}</p>

          {/* Orientation politique */}
          <div className="flex items-center gap-2">
            {primaryOrientation && <Badge text={primaryOrientation} />}
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
            console.log('[SelectableSourceItem] Bouton info cliqué pour :', source);
            if (onClick) onClick(source);
          }}
          className="text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-50"
          title="Voir les détails de cette source"
          aria-label="Voir les détails de cette source"
        >
          <InfoIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// Variante avec bouton de suppression pour la page Sources
export const DeletableSourceItem = ({ source, onDelete, onAddToCollection, onClick }) => (
  <SourceItemBase source={source} onAddToCollection={onAddToCollection} onClick={onClick}>
    <div className="flex space-x-2">
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
export const CollectibleDeletableSourceItem = ({
  source,
  onDelete,
  onAddToCollection,
  onClick,
}) => (
  <SourceItemBase source={source} onAddToCollection={onAddToCollection} onClick={onClick}>
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
export const SimpleSourceItem = ({ source, onClick }) => (
  <SourceItemBase source={source} onClick={onClick} />
);

// Variante avec bouton d'ajout à une collection
export const CollectibleSourceItem = ({
  source,
  onAddToCollection,
  onEnableSource,
  isActive = false,
  onClick,
}) => (
  <SourceItemBase source={source} onAddToCollection={onAddToCollection} onClick={onClick}>
    {!isActive && onEnableSource && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEnableSource(source);
        }}
        className="text-gray-400 hover:text-green-600 transition-colors p-1 rounded-full hover:bg-green-50 mr-2"
        title="Activer cette source"
        aria-label="Activer cette source"
      >
        <PlusIcon className="h-5 w-5" />
      </button>
    )}
  </SourceItemBase>
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
  onClick: PropTypes.func,
};

SelectableSourceItem.propTypes = {
  source: PropTypes.shape(sourceShape).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  compact: PropTypes.bool,
  onClick: PropTypes.func,
};

DeletableSourceItem.propTypes = {
  source: PropTypes.shape(sourceShape).isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddToCollection: PropTypes.func,
  onClick: PropTypes.func,
};

CollectibleDeletableSourceItem.propTypes = {
  source: PropTypes.shape(sourceShape).isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddToCollection: PropTypes.func.isRequired,
  onClick: PropTypes.func,
};

SimpleSourceItem.propTypes = {
  source: PropTypes.shape(sourceShape).isRequired,
  onClick: PropTypes.func,
};

CollectibleSourceItem.propTypes = {
  source: PropTypes.shape(sourceShape).isRequired,
  onAddToCollection: PropTypes.func.isRequired,
  onEnableSource: PropTypes.func,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};

export default SimpleSourceItem;
