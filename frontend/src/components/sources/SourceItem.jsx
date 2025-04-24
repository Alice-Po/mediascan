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

  return (
    <div className="flex items-center p-2 border border-gray-200 rounded-md hover:bg-gray-50">
      {leftAction}
      <div className="flex items-center flex-grow">
        {/* Info source */}
        {source.faviconUrl && <img src={source.faviconUrl} alt="" className="w-5 h-5 mr-2" />}
        <div>
          <div className="font-medium text-gray-900">{source.name}</div>
          <div className="text-xs text-gray-500">
            {source.categories?.slice(0, 3).join(', ')}
            {source.categories?.length > 3 && '...'}
          </div>
        </div>
        <div className="ml-auto mr-2">
          <span
            className="px-2 py-1 text-xs rounded-full"
            style={{
              backgroundColor: bgColor,
              color: textColor,
            }}
          >
            {ORIENTATIONS.political[source.orientation.political]?.label ||
              source.orientation.political}
          </span>
        </div>
      </div>
      {children}
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
