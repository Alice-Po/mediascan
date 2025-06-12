import React from 'react';
import PropTypes from 'prop-types';

/**
 * Composant de formulaire de base pour la création/modification d'une collection
 */
const BaseForm = ({ formData, onChange, onSubmit, onCancel, submitLabel, error, isSubmitting }) => {
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        ></textarea>
        <p className="mt-1 text-sm text-gray-500">
          Une description détaillée aide les autres utilisateurs à comprendre l'objet de votre
          collection.
        </p>
      </div>

      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={isSubmitting}
          />
          <span className="ml-2 text-sm text-gray-700">Rendre cette collection publique</span>
        </label>
        <p className="mt-1 text-sm text-gray-500 ml-6">
          Les collections publiques sont visibles par tous les utilisateurs et peuvent être suivies.
        </p>
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium"
            disabled={isSubmitting}
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enregistrement...' : submitLabel}
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
  onCancel: PropTypes.func,
  submitLabel: PropTypes.string.isRequired,
  error: PropTypes.string,
  isSubmitting: PropTypes.bool,
};

BaseForm.defaultProps = {
  error: null,
  isSubmitting: false,
};

export default BaseForm;
