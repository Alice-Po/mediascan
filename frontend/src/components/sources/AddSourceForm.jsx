import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import RssHelpModal from './RssHelpModal';
import PremiumBanner from '../premium/PremiumBanner';
import { SimpleSourceItem } from './SourceItem';
import { useSnackbar, SNACKBAR_TYPES } from '../../context/SnackbarContext';
import TagInputForm from '../common/TagInputForm';
const AddSourceForm = ({
  onSubmit,
  onCancel,
  loading,
  formErrors,
  suggestions = [],
  handleSelectSource = () => {},
  collections = [],
}) => {
  const { showSnackbar } = useSnackbar();
  const [showRssHelp, setShowRssHelp] = useState(false);
  const [customSource, setCustomSource] = useState({
    name: '',
    url: '',
    rssUrl: '',
    description: '',
    funding: {
      type: '',
      details: '',
    },
    orientation: [],
    collectionId: '',
  });

  // Log initial collections for debugging
  useEffect(() => {
    console.log('Initial collections:', collections);
  }, []);

  const handleCustomSourceChange = (e) => {
    const { name, value, type } = e.target;
    console.log('Input change event:', {
      name,
      value,
      type,
      element: e.target,
      validity: e.target.validity,
    });

    if (name.includes('.')) {
      // Gestion des champs imbriqués
      const [parent, child] = name.split('.');
      setCustomSource((prev) => {
        const newState = {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        };
        console.log('Updated nested state:', newState);
        return newState;
      });
    } else {
      // Champs simples
      setCustomSource((prev) => {
        const newState = { ...prev, [name]: value };
        console.log('Updated simple state:', newState);
        return newState;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission:', {
      formData: customSource,
      formValidity: e.target.checkValidity(),
      formElements: e.target.elements,
    });

    try {
      await onSubmit(customSource);

      // Afficher une notification de succès
      showSnackbar(
        `La source "${customSource.name}" a été ajoutée avec succès !`,
        SNACKBAR_TYPES.SUCCESS
      );

      // Réinitialiser le formulaire si nécessaire
      setCustomSource({
        name: '',
        url: '',
        rssUrl: '',
        description: '',
        funding: {
          type: '',
          details: '',
        },
        orientation: [],
        collectionId: '',
      });
    } catch (error) {
      // Afficher une notification d'erreur en cas d'échec
      showSnackbar(
        `Erreur lors de l'ajout de la source: ${error.message || 'Veuillez réessayer'}`,
        SNACKBAR_TYPES.ERROR
      );
      console.error('Error submitting source:', error);
    }
  };

  // Log à chaque changement d'état
  useEffect(() => {
    console.log('customSource state updated:', customSource);
  }, [customSource]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <form onSubmit={handleSubmit} noValidate className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Section 1: URL du flux RSS */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-blue-50 px-3 sm:px-4 py-3 border-b border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-2 mr-2 sm:mr-3">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Adresse du flux RSS</h3>
                </div>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <div>
                <label htmlFor="rssUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  URL du flux RSS <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="url"
                    required
                    id="rssUrl"
                    name="rssUrl"
                    value={customSource.rssUrl}
                    onChange={handleCustomSourceChange}
                    placeholder="https://www.example.com/feed.xml"
                    className={`block w-full pl-10 pr-3 py-2 rounded-md border ${
                      formErrors.rssUrl
                        ? 'border-red-300 ring-red-200'
                        : 'border-gray-300 focus:ring-blue-200'
                    } shadow-sm focus:border-blue-500 focus:ring focus:ring-opacity-50`}
                  />
                </div>
                <div className="mt-1.5 flex items-start text-xs">
                  <svg
                    className="h-4 w-4 text-blue-500 mt-0.5 mr-1.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-500">
                    L'URL du flux RSS se trouve généralement dans le code source de la page ou est
                    indiquée par une icône RSS.
                    <button
                      type="button"
                      onClick={() => setShowRssHelp(true)}
                      className="ml-1 text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      En savoir plus
                    </button>
                  </span>
                </div>
                {formErrors.rssUrl && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center">
                    <svg
                      className="h-4 w-4 text-red-500 mr-1.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    {formErrors.rssUrl}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Description */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-blue-50 px-3 sm:px-4 py-3 border-b border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-2 mr-2 sm:mr-3">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Description éditoriale</h3>
                </div>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description de la source <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Aidez les utilisateurs à comprendre l'approche éditoriale de cette source
                </p>
                <textarea
                  id="description"
                  name="description"
                  value={customSource.description}
                  onChange={handleCustomSourceChange}
                  rows="3"
                  placeholder="Ex: Journal indépendant spécialisé dans le journalisme d'investigation..."
                  className={`block w-full rounded-md border ${
                    formErrors.description
                      ? 'border-red-300 ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200'
                  } shadow-sm focus:border-blue-500 focus:ring focus:ring-opacity-50`}
                />
                {formErrors.description && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center">
                    <svg
                      className="h-4 w-4 text-red-500 mr-1.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    {formErrors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Collections */}
          {collections.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-indigo-50 px-3 sm:px-4 py-3 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="bg-indigo-100 rounded-full p-2 mr-2 sm:mr-3">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Collection</h3>
                  </div>
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <div>
                  <label
                    htmlFor="collectionId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Ajouter à une collection
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Ajoutez directement cette source à l'une de vos collections existantes
                  </p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <select
                      id="collectionId"
                      name="collectionId"
                      value={customSource.collectionId}
                      onChange={handleCustomSourceChange}
                      className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white"
                    >
                      <option value="">Ne pas ajouter à une collection</option>
                      {collections.map((collection) => (
                        <option key={collection._id} value={collection._id}>
                          {collection.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {customSource.collectionId && (
                    <div className="mt-3 bg-indigo-50 p-2 sm:p-3 rounded-md">
                      <p className="text-xs text-indigo-700 flex items-center">
                        <svg
                          className="h-4 w-4 text-indigo-500 mr-1.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        La source sera immédiatement ajoutée à cette collection dès sa création
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Section 4: Orientation */}
          <div className="space-y-4 mt-4 md:mt-0">
            <div>
              <label htmlFor="orientation" className="block text-sm font-medium text-gray-700 mb-1">
                Orientation
              </label>
              <TagInputForm
                tags={customSource.orientation}
                setTags={setCustomSource}
                error={formErrors.orientation}
              />
            </div>
          </div>
        </div>

        {/* Section 5: Paramètres */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-blue-50 px-3 sm:px-4 py-3 border-b border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-2 mr-2 sm:mr-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Paramètres additionnels</h3>
              </div>
            </div>
          </div>
          <div className="p-3 sm:p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="funding.type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Type de financement
                  </label>
                  <select
                    id="funding.type"
                    name="funding.type"
                    value={customSource.funding?.type}
                    onChange={handleCustomSourceChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white"
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="independent">Média indépendant</option>
                    <option value="public">Service public</option>
                    <option value="private">Groupe privé / Industriel</option>
                    <option value="cooperative">Coopérative de journalistes</option>
                    <option value="association">Association / ONG</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="funding.details"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Précisions (optionnel)
                  </label>
                  <input
                    type="text"
                    id="funding.details"
                    name="funding.details"
                    value={customSource.funding?.details || ''}
                    onChange={handleCustomSourceChange}
                    placeholder="Ex: Appartient au groupe Bouygues..."
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
              </div>

              {formErrors.funding && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg
                    className="h-4 w-4 text-red-500 mr-1.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  {formErrors.funding}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 sm:mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 sm:px-6 py-2 rounded-md shadow-sm text-white ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Vérification...
              </span>
            ) : (
              'Ajouter cette source'
            )}
          </button>
        </div>
      </form>

      <div className="bg-gray-50 p-3 sm:p-4 border-t border-gray-200">
        <PremiumBanner
          title="Vous trouvez cette gestion de sources un peu légère ?"
          description="Nous réfléchissons à une approche intelligente de modération communautaire pour enrichir et valider collectivement les descriptions des sources."
          linkText="Contribuer à la réflexion"
        />
      </div>

      <RssHelpModal isOpen={showRssHelp} onClose={() => setShowRssHelp(false)} />

      {/* Suggestions */}
      {Array.isArray(suggestions) && suggestions.length > 0 && (
        <div className="absolute z-10 left-0 right-0 bg-white rounded-md shadow-md border border-gray-200 overflow-hidden max-h-64 overflow-y-auto">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <h4 className="font-medium text-blue-800">Sources existantes</h4>
            <p className="text-xs text-blue-600">
              Nous avons trouvé des sources correspondantes. Cliquez pour les ajouter directement.
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {suggestions.map((source) => (
              <div
                key={source._id}
                onClick={() => handleSelectSource(source)}
                className="cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <SimpleSourceItem source={source} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

AddSourceForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  formErrors: PropTypes.object.isRequired,
  suggestions: PropTypes.array,
  handleSelectSource: PropTypes.func,
  collections: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
};

AddSourceForm.defaultProps = {
  collections: [],
  suggestions: [],
  handleSelectSource: () => {},
};

export default AddSourceForm;
