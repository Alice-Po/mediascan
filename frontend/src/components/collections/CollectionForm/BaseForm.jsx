import React from 'react';
import PropTypes from 'prop-types';

/**
 * Composant de formulaire de base pour la création/modification d'une collection
 */
const BaseForm = ({ formData, onChange, onSubmit, submitLabel, error }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

      <div className="mb-3 sm:mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nom de la collection*
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          required
          placeholder="Ex: Actualités Tech, Cuisine Méditerranéenne, etc."
        />
        <p className="mt-1 text-sm text-gray-500">
          Un titre clair aide les autres utilisateurs à comprendre le contenu de votre collection.
        </p>
      </div>

      <div className="mb-3 sm:mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          placeholder="Décrivez le thème, les sujets ou les types de contenu que vous souhaitez rassembler dans cette collection..."
        ></textarea>
        <p className="mt-1 text-sm text-gray-500">
          Une description détaillée aide les autres utilisateurs à comprendre l'objet de votre
          collection.
        </p>
      </div>

      <div className="mb-3 sm:mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={formData.isPublic}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
            Collection publique
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1 ml-6">
          Les collections publiques peuvent être visibles et suivies par d'autres utilisateurs
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

BaseForm.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    isPublic: PropTypes.bool,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string.isRequired,
  error: PropTypes.string,
};

export default BaseForm;
