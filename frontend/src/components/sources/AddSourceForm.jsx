import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CATEGORIES, ORIENTATIONS } from '../../constants';
import RssHelpModal from './RssHelpModal';
import PremiumBanner from '../premium/PremiumBanner';
import { SimpleSourceItem } from '../../components/sources/SourceItem';

const AddSourceForm = ({
  customSource,
  onSourceChange,
  onSubmit,
  onCancel,
  loading,
  formErrors,
  suggestions,
  handleSelectSource,
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
      <PremiumBanner
        className="mb-6"
        variant="coming"
        title="Fini la recherche manuelle des flux RSS !"
        description="Bientôt, vous n'aurez plus qu'à entrer l'URL du site web et nous détecterons automatiquement le flux RSS correspondant."
        linkText="En savoir plus sur la détection intelligente de flux RSS"
      />

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
                required
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

          {/* Description éditoriale */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description de la source
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Une brève description de la ligne éditoriale pour aider les utilisateurs à comprendre
              l'approche de cette source
            </p>
            <textarea
              id="description"
              name="description"
              value={customSource.description}
              onChange={onSourceChange}
              rows="3"
              placeholder="Ex: Journal indépendant spécialisé dans le journalisme d'investigation..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
            )}
          </div>

          {/* Type de financement */}
          <div>
            <label htmlFor="funding" className="block text-sm font-medium text-gray-700 mb-2">
              Type de financement
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Cette information aide à comprendre le degré d'indépendance éditoriale de la source
            </p>

            <div className="space-y-3">
              <select
                id="funding.type"
                name="funding.type"
                value={customSource.funding?.type}
                onChange={onSourceChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              >
                <option value="">Sélectionner un type de financement</option>
                <option value="independent">Média indépendant</option>
                <option value="public">Service public</option>
                <option value="private">Groupe privé / Industriel</option>
                <option value="cooperative">Coopérative de journalistes</option>
                <option value="association">Association / ONG</option>
                <option value="other">Autre</option>
              </select>

              <div className="mt-3">
                <label htmlFor="funding.details" className="block text-xs text-gray-600 mb-1">
                  Précisions (optionnel)
                </label>
                <input
                  type="text"
                  id="funding.details"
                  name="funding.details"
                  value={customSource.funding?.details || ''}
                  onChange={onSourceChange}
                  placeholder="Ex: Appartient au groupe Bouygues, Financé par ses lecteurs..."
                  className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                />
              </div>
            </div>
            {formErrors.funding && (
              <p className="mt-1 text-sm text-red-600">{formErrors.funding}</p>
            )}
          </div>

          {/* Catégories avec explication
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
          </div> */}

          {/* Orientation avec aide */}
          <div>
            <label
              htmlFor="orientation.political"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Orientation politique
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

      <PremiumBanner
        className="mt-8"
        title="Vous trouvez cette gestion de sources un peu légère ?"
        description="Nous réfléchissons à une approche intelligente de modération communautaire pour enrichir et valider collectivement les descriptions des sources. Si vous avez des idées ou de l'expertise en la matière, nous serions ravis d'en discuter !"
        linkText="Contribuer à la réflexion"
      />

      <RssHelpModal isOpen={showRssHelp} onClose={() => setShowRssHelp(false)} />

      {/* Suggestions */}
      <div className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg">
        {suggestions.map((source) => (
          <div
            key={source._id}
            onClick={() => handleSelectSource(source)}
            className="cursor-pointer"
          >
            <SimpleSourceItem source={source} />
          </div>
        ))}
      </div>
    </div>
  );
};

AddSourceForm.propTypes = {
  customSource: PropTypes.shape({
    rssUrl: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    funding: PropTypes.shape({
      type: PropTypes.oneOf([
        '',
        'independent',
        'public',
        'private',
        'cooperative',
        'association',
        'other',
      ]).isRequired,
      details: PropTypes.string,
    }).isRequired,
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
  suggestions: PropTypes.array.isRequired,
  handleSelectSource: PropTypes.func.isRequired,
};

export default AddSourceForm;
