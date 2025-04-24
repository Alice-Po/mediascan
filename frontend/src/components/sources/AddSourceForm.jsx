import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CATEGORIES, ORIENTATIONS } from '../../constants';
import RssHelpModal from './RssHelpModal';

const AddSourceForm = ({
  customSource,
  onSourceChange,
  onSubmit,
  onCancel,
  loading,
  formErrors,
}) => {
  const [showRssHelp, setShowRssHelp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(customSource);
  };

  return (
    <div className="mt-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* En-tête explicatif */}
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          La source que vous cherchez ne semble pas encore dans notre base de données. Ajoutez-la !
        </h3>
        <p className="text-sm text-gray-600">
          Vous pouvez l'ajouter et la rendre disponible pour tous les utilisateurs. Il suffit de
          renseigner son flux RSS et quelques informations complémentaires.
        </p>
      </div>

      {/* Bannière Premium - Détection RSS */}
      <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border-2 border-dashed border-purple-200 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center mb-2">
            <span className="bg-purple-100 px-2 py-0.5 rounded-full text-xs font-mono text-purple-800">
              Bientôt disponible
            </span>
          </div>
          <h3 className="text-lg font-semibold text-purple-900 mb-2">
            Fini la recherche manuelle des flux RSS !
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Bientôt, vous n'aurez plus qu'à entrer l'URL du site web et nous détecterons
            automatiquement le flux RSS correspondant.
          </p>
          <a
            href="/premium"
            className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 hover:text-purple-900 group"
          >
            <span>En savoir plus sur la détection intelligente de flux RSS</span>
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* RSS URL avec aide */}
          <div>
            <label htmlFor="rssUrl" className="block text-sm font-medium text-gray-700">
              URL du flux RSS
            </label>
            <div className="mt-1">
              <input
                type="url"
                id="rssUrl"
                name="rssUrl"
                value={customSource.rssUrl}
                onChange={onSourceChange}
                placeholder="https://www.example.com/feed.xml"
                className={`block w-full rounded-md ${
                  formErrors.rssUrl ? 'border-red-300' : 'border-gray-300'
                } shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50`}
              />
              <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                <p>
                  L'URL du flux RSS se trouve généralement dans le code source de la page ou est
                  indiquée par une icône RSS (🛜).
                </p>
                <button
                  type="button"
                  onClick={() => setShowRssHelp(true)}
                  className="text-blue-600 hover:text-blue-700 hover:underline focus:outline-none"
                >
                  En savoir plus
                </button>
              </div>
              {formErrors.rssUrl && (
                <p className="mt-1 text-sm text-red-600">{formErrors.rssUrl}</p>
              )}
            </div>
          </div>

          {/* Catégories avec explication */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégories principales
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Sélectionnez les thématiques principales couvertes par cette source
            </p>
            <div className="grid grid-cols-2 gap-2">
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

          {/* Orientation avec aide */}
          <div>
            <label
              htmlFor="orientation.political"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Orientation éditoriale
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Cette information aide les utilisateurs à diversifier leurs sources d'information
            </p>
            <select
              id="orientation.political"
              name="orientation.political"
              value={customSource.orientation.political}
              onChange={onSourceChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            >
              {Object.entries(ORIENTATIONS.political).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
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
              {loading ? (
                <span className="flex items-center">
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2" />
                  Vérification...
                </span>
              ) : (
                'Ajouter cette source'
              )}
            </button>
          </div>
        </div>
      </form>

      <RssHelpModal isOpen={showRssHelp} onClose={() => setShowRssHelp(false)} />
    </div>
  );
};

AddSourceForm.propTypes = {
  customSource: PropTypes.shape({
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
