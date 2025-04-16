import React from 'react';
import PropTypes from 'prop-types';
import { ORIENTATIONS } from '../../constants';
import { isLightColor } from '../../utils/colorUtils';

const SourceItem = ({ source, onDisable }) => {
  return (
    <li className="p-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {source.faviconUrl && <img src={source.faviconUrl} alt="" className="w-6 h-6" />}
          <div>
            <h3 className="font-medium text-gray-900">{source.name}</h3>
            <p className="text-sm text-gray-500">
              {source.categories.slice(0, 3).join(', ')}
              {source.categories.length > 3 && '...'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span
            className="px-2 py-1 text-xs rounded-full"
            style={{
              backgroundColor:
                ORIENTATIONS.political[source.orientation.political]?.color || '#f3f4f6',
              color: isLightColor(
                ORIENTATIONS.political[source.orientation.political]?.color || '#f3f4f6'
              )
                ? '#000000'
                : '#ffffff',
            }}
          >
            {ORIENTATIONS.political[source.orientation.political]?.label ||
              source.orientation.political}
          </span>
          <button
            onClick={() => onDisable(source._id)}
            className="text-sm text-gray-400 hover:text-red-600 transition-colors"
            title="Retirer cette source"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
};

SourceItem.propTypes = {
  source: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    faviconUrl: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    orientation: PropTypes.shape({
      political: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onDisable: PropTypes.func.isRequired,
};

export default SourceItem;
