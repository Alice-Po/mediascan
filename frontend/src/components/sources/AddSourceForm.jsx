import React from 'react';
import PropTypes from 'prop-types';
import { CATEGORIES, ORIENTATIONS } from '../../constants';

const AddSourceForm = ({
  customSource,
  onSourceChange,
  onSubmit,
  onCancel,
  loading,
  formErrors,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(customSource);
  };

  return (
    <div className="mt-4 bg-white p-6 rounded-lg shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Nom */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom de la source
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={customSource.name}
              onChange={onSourceChange}
              className={`mt-1 block w-full rounded-md ${
                formErrors.name ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50`}
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
          </div>

          {/* URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
              URL du site
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={customSource.url}
              onChange={onSourceChange}
              className={`mt-1 block w-full rounded-md ${
                formErrors.url ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50`}
            />
            {formErrors.url && <p className="mt-1 text-sm text-red-600">{formErrors.url}</p>}
          </div>

          {/* RSS URL */}
          <div>
            <label htmlFor="rssUrl" className="block text-sm font-medium text-gray-700">
              URL du flux RSS
            </label>
            <input
              type="url"
              id="rssUrl"
              name="rssUrl"
              value={customSource.rssUrl}
              onChange={onSourceChange}
              className={`mt-1 block w-full rounded-md ${
                formErrors.rssUrl ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50`}
            />
            {formErrors.rssUrl && <p className="mt-1 text-sm text-red-600">{formErrors.rssUrl}</p>}
          </div>

          {/* Catégories */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Catégories</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {CATEGORIES.map((category) => (
                <label key={category} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="categories"
                    value={category}
                    checked={customSource.categories.includes(category)}
                    onChange={onSourceChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Orientation politique */}
          <div>
            <label
              htmlFor="orientation.political"
              className="block text-sm font-medium text-gray-700"
            >
              Orientation politique
            </label>
            <select
              id="orientation.political"
              name="orientation.political"
              value={customSource.orientation.political}
              onChange={onSourceChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            >
              {Object.keys(ORIENTATIONS.political).map((option) => (
                <option key={option} value={option}>
                  {ORIENTATIONS.political[option].label}
                </option>
              ))}
            </select>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md ${
                loading ? 'bg-gray-300 text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading && (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2" />
              )}
              Ajouter
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

AddSourceForm.propTypes = {
  customSource: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    rssUrl: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    orientation: PropTypes.shape({
      political: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onSourceChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  formErrors: PropTypes.object.isRequired,
};

export default AddSourceForm;
