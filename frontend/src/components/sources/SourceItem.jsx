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

/**
 * Composant générique pour afficher une source avec actions conditionnelles
 * @param {Object} props
 * @param {Object} props.source - Objet source à afficher
 * @param {Function} [props.onInfo] - Callback pour afficher les détails (toujours visible)
 * @param {Function} [props.onDelete] - Callback pour supprimer la source
 * @param {Function} [props.onAddToCollection] - Callback pour ajouter à une collection
 * @param {Function} [props.onEnable] - Callback pour activer la source
 */
const SourceItem = ({ source, onInfo, onDelete, onAddToCollection, onEnable }) => {
  // Récupérer l'orientation principale
  const primaryOrientation = getFirstOrientation(source);

  // S'assurer que la description existe et est une chaîne
  const description = source.description || '';
  const words = description.split(' ');
  const shortDescription = words.length > 20 ? words.slice(0, 20).join(' ') + '...' : description;

  const handleInfoClick = (e) => {
    e.stopPropagation();
    if (onInfo) onInfo(source);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(source);
  };

  const handleAddToCollectionClick = (e) => {
    e.stopPropagation();
    if (onAddToCollection) onAddToCollection(source);
  };

  const handleEnableClick = (e) => {
    e.stopPropagation();
    if (onEnable) onEnable(source);
  };

  return (
    <div
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleInfoClick}
    >
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
        {/* Bouton d'information (toujours visible) */}
        <button
          onClick={handleInfoClick}
          className="text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-50"
          title="Voir les détails de cette source"
          aria-label="Voir les détails de cette source"
        >
          <InfoIcon className="h-5 w-5" />
        </button>
        {/* Bouton "Ajouter à une collection" */}
        {onAddToCollection && (
          <button
            onClick={handleAddToCollectionClick}
            className="text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-50"
            title="Ajouter à une collection"
            aria-label="Ajouter à une collection"
          >
            <CollectionIcon className="h-5 w-5" />
          </button>
        )}
        {/* Bouton d'activation */}
        {onEnable && (
          <button
            onClick={handleEnableClick}
            className="text-gray-400 hover:text-green-600 transition-colors p-1 rounded-full hover:bg-green-50"
            title="Activer cette source"
            aria-label="Activer cette source"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        )}
        {/* Bouton de suppression */}
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
            title="Retirer cette source"
            aria-label="Retirer cette source"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

SourceItem.propTypes = {
  source: PropTypes.object.isRequired,
  onInfo: PropTypes.func, // Toujours visible
  onDelete: PropTypes.func,
  onAddToCollection: PropTypes.func,
  onEnable: PropTypes.func,
};

export default SourceItem;
