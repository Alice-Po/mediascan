import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import RssHelpModal from './RssHelpModal';
import PremiumBanner from '../premium/PremiumBanner';
import SourceItem from './SourceItem';
import { useSnackbar, SNACKBAR_TYPES } from '../../context/SnackbarContext';
import TagInputForm from '../common/TagInputForm';
import ArticlePreview from '../articles/ArticlePreview';
import { checkSourceExists, checkRssFluxIsValid } from '../../api/sourcesApi';
import { useDebounce } from '../../hooks/useDebounce';
import { useDefaultCollection } from '../../context/DefaultCollectionContext';

const AddSourceForm = ({
  onSubmit,
  onCancel,
  loading,
  formErrors,
  handleSelectSource = () => {},
  collections = [],
  hideCollectionSection = false,
}) => {
  const { showSnackbar } = useSnackbar();
  const { defaultCollection } = useDefaultCollection();
  const [showRssHelp, setShowRssHelp] = useState(false);

  // Déclarer d'abord l'état customSource
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
    collectionId: hideCollectionSection ? defaultCollection?._id || '' : '',
  });

  // Ensuite utiliser customSource dans useDebounce
  const debouncedRssUrl = useDebounce(customSource.rssUrl, 500);

  // Puis déclarer les autres états
  const [validationState, setValidationState] = useState({
    step: 'idle', // 'idle' | 'checking-existence' | 'exists' | 'checking-rss' | 'valid' | 'invalid'
    message: '',
    details: '',
  });
  const [existingSource, setExistingSource] = useState(null);
  const [previewArticles, setPreviewArticles] = useState([]);

  // Si hideCollectionSection est actif, forcer collectionId à la valeur par défaut
  useEffect(() => {
    if (hideCollectionSection) {
      if (!defaultCollection?._id) {
        showSnackbar(
          "Aucune collection par défaut trouvée. Veuillez créer une collection d'abord.",
          SNACKBAR_TYPES.ERROR
        );
        return;
      }
      setCustomSource((prev) => ({
        ...prev,
        collectionId: defaultCollection._id,
      }));
    }
  }, [hideCollectionSection, defaultCollection]);

  // Vérification de l'existence de la source en base (avec debounce)
  useEffect(() => {
    if (!debouncedRssUrl) {
      setValidationState({ step: 'idle', message: '', details: '' });
      setExistingSource(null);
      setPreviewArticles([]);
      return;
    }

    const checkSource = async () => {
      try {
        setValidationState({
          step: 'checking-existence',
          message: "Vérification de l'existence...",
        });
        const data = await checkSourceExists(debouncedRssUrl);

        if (data.exists) {
          setExistingSource(data.source || true);
          setValidationState({
            step: 'exists',
            message: 'Cette source existe déjà dans notre base de données !',
            details: data.source?.name ? `(${data.source.name})` : '',
          });
          setPreviewArticles([]);
          return;
        }

        // Si la source n'existe pas, on passe à la vérification du flux RSS
        setExistingSource(null);
        setValidationState({ step: 'checking-rss', message: 'Vérification du flux RSS...' });

        const rssCheck = await checkRssFluxIsValid(debouncedRssUrl);

        if (rssCheck.valid) {
          // Pré-remplir les champs avec les données du flux
          setCustomSource((prev) => ({
            ...prev,
            name: rssCheck.data.title || prev.name,
            description: rssCheck.data.description || prev.description,
            url: rssCheck.data.link || prev.url,
          }));

          setValidationState({
            step: 'valid',
            message: 'Flux RSS valide !',
          });

          // Transformer les articles pour s'assurer que nous avons la date de publication
          const transformedArticles = rssCheck.data.items.map((item) => ({
            ...item,
            pubDate: item.pubDate || item.isoDate || item.date || new Date().toISOString(),
          }));
          setPreviewArticles(transformedArticles);
        } else {
          setValidationState({
            step: 'invalid',
            message: 'Flux RSS invalide ou inaccessible',
            details: rssCheck.error || 'Une erreur est survenue lors de la vérification du flux.',
          });
          setPreviewArticles([]);
        }
      } catch (error) {
        setValidationState({
          step: 'invalid',
          message: 'Erreur lors de la vérification',
          details: error.message || 'Une erreur inattendue est survenue.',
        });
        setPreviewArticles([]);
      }
    };

    checkSource();
  }, [debouncedRssUrl]);

  const handleCustomSourceChange = (e) => {
    const { name, value } = e.target;

    if (name === 'rssUrl') {
      // Réinitialiser les états de validation lors d'un changement d'URL
      setValidationState({ step: 'idle', message: '', details: '' });
      setExistingSource(null);
      setPreviewArticles([]);
    }

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCustomSource((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setCustomSource((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier que nous avons un collectionId valide
    if (!customSource.collectionId) {
      showSnackbar('Veuillez sélectionner une collection pour cette source.', SNACKBAR_TYPES.ERROR);
      return;
    }

    // Nettoyer le champ funding.type si vide
    const cleanedSource = {
      ...customSource,
      funding: {
        ...customSource.funding,
        type: customSource.funding?.type ? customSource.funding.type : undefined,
      },
      collectionId: hideCollectionSection ? defaultCollection?._id : customSource.collectionId,
    };
    if (!cleanedSource.funding.type) delete cleanedSource.funding.type;
    if (!cleanedSource.funding.details) delete cleanedSource.funding.details;
    if (Object.keys(cleanedSource.funding).length === 0) delete cleanedSource.funding;

    try {
      await onSubmit(cleanedSource);
      showSnackbar(
        `La source "${customSource.name}" a été ajoutée avec succès !`,
        SNACKBAR_TYPES.SUCCESS
      );

      // Réinitialiser le formulaire
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
        collectionId: hideCollectionSection ? defaultCollection?._id || '' : '',
      });
      setValidationState({ step: 'idle', message: '', details: '' });
      setExistingSource(null);
      setPreviewArticles([]);
    } catch (error) {
      showSnackbar(
        `Erreur lors de l'ajout de la source: ${error.message || 'Veuillez réessayer'}`,
        SNACKBAR_TYPES.ERROR
      );
    }
  };

  // Fonction pour réinitialiser l'URL du flux
  const resetRssUrl = () => {
    setCustomSource((prev) => ({ ...prev, rssUrl: '' }));
    setValidationState({ step: 'idle', message: '', details: '' });
    setExistingSource(null);
    setPreviewArticles([]);
  };

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
                  <h3 className="font-medium text-gray-900">Ajouter une source</h3>
                </div>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <div>
                <label htmlFor="rssUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Entrez l'URL du flux de la source <span className="text-red-500">*</span>
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
                    disabled={
                      validationState.step === 'checking-existence' ||
                      validationState.step === 'checking-rss'
                    }
                  />
                  {/* Indicateur de validation RSS */}
                  <div className="absolute inset-y-0 right-0 pr-3 items-center hidden sm:flex">
                    {(validationState.step === 'checking-existence' ||
                      validationState.step === 'checking-rss') && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                    )}
                    {validationState.step === 'valid' && (
                      <svg
                        className="h-5 w-5 text-green-500 animate-bounce"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {validationState.step === 'invalid' && (
                      <svg
                        className="h-5 w-5 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Bouton de réinitialisation de l'URL du flux */}
                {customSource.rssUrl && (
                  <button
                    type="button"
                    onClick={resetRssUrl}
                    className="mt-2 text-xs text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Essayer une autre URL de flux
                  </button>
                )}

                {/* Message source existante */}
                {validationState.step === 'exists' && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      {validationState.message}
                      {validationState.details && (
                        <span>
                          {' '}
                          (<strong>{validationState.details}</strong>)
                        </span>
                      )}
                      <br />
                      <span className="text-xs text-yellow-700">
                        Vous pouvez la retrouver dans votre catalogue ou vos collections.
                      </span>
                    </span>
                  </div>
                )}

                {/* Messages de validation RSS */}
                {validationState.step !== 'idle' && validationState.step !== 'exists' && (
                  <div
                    className={`mt-1.5 ${
                      validationState.step === 'valid'
                        ? 'text-green-600'
                        : validationState.step === 'invalid'
                        ? 'text-red-600'
                        : 'text-blue-600'
                    }`}
                  >
                    <p className="text-sm font-medium">{validationState.message}</p>
                    {validationState.details && (
                      <p className="text-sm mt-1">{validationState.details}</p>
                    )}
                  </div>
                )}

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

                {/* Aperçu des articles */}
                {validationState.step === 'valid' && previewArticles.length > 0 && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Derniers articles</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {previewArticles.map((article, index) => (
                        <ArticlePreview key={index} article={article} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Section d'aide pour trouver l'URL du flux - visible si l'input est vide ou si le flux est invalide */}
                {(validationState.step === 'idle' || validationState.step === 'invalid') && (
                  <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 hidden sm:block">
                        <div className="bg-blue-100 rounded-full p-2">
                          <svg
                            className="h-5 w-5 text-blue-600"
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
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-blue-900 mb-3">
                          {validationState.step === 'idle'
                            ? "Comment trouver l'URL d'un flux ?"
                            : "Besoin d'aide pour trouver l'URL du flux ?"}
                        </h4>
                        <div className="space-y-4">
                          {/* Premier chemin : Pas d'inspiration */}
                          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                            <h5 className="text-sm font-medium text-indigo-900 mb-2">
                              Pas d'inspiration ?
                            </h5>
                            <p className="text-sm text-indigo-700 mb-3">
                              Explorez un annuaire de flux RSS pour découvrir des sources
                              intéressantes. Gardez en tête que cet annuaire est non exhausif,
                              chaque site web qui existe a potentiellement un flux.
                            </p>
                            <a
                              href="http://atlasflux.saynete.net/index.htm"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <svg
                                className="h-4 w-4 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                />
                              </svg>
                              Explorer l'Atlas des Flux
                            </a>
                          </div>

                          {/* Deuxième chemin : Comment récupérer l'URL */}
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <h5 className="text-sm font-medium text-blue-900 mb-2">
                              J'ai une source en tête, comment récupérer son URL ?
                            </h5>
                            <p className="text-sm text-blue-700 mb-3">
                              Découvrez comment trouver facilement l'URL du flux RSS de votre
                              source.
                            </p>
                            <button
                              type="button"
                              onClick={() => setShowRssHelp(true)}
                              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <svg
                                className="h-4 w-4 mr-2"
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
                              Voir le guide complet
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reste du formulaire - visible uniquement si le flux RSS est valide */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              validationState.step === 'valid'
                ? 'opacity-100 max-h-[2000px]'
                : 'opacity-0 max-h-0 overflow-hidden'
            }`}
          >
            {/* Section 2: Informations de la source */}
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
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Informations de la source</h3>
                  </div>
                </div>
              </div>
              <div className="p-3 sm:p-4 space-y-4">
                {/* Nom de la source */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la source <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={customSource.name}
                    onChange={handleCustomSourceChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="Nom de la source"
                  />
                </div>

                {/* Lien du site web */}
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                    Lien du site web <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    value={customSource.url}
                    onChange={handleCustomSourceChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="https://www.example.com"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={customSource.description}
                    onChange={handleCustomSourceChange}
                    rows="3"
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="Description de la source"
                  />
                </div>
              </div>
            </div>

            {/* Section Collections */}
            {!hideCollectionSection && (
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
                      <h3 className="font-medium text-gray-900">
                        Collection <span className="text-red-500">*</span>
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <div>
                    <label
                      htmlFor="collectionId"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Ajouter à une collection <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Cette source doit être ajoutée à une collection
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
                        required
                        className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white"
                      >
                        <option value="">Sélectionner une collection</option>
                        {collections.map((collection) => (
                          <option key={collection._id} value={collection._id}>
                            {collection.name}
                            {collection.isDefault ? ' (Collection par défaut)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {formErrors.collectionId && (
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
                        {formErrors.collectionId}
                      </p>
                    )}

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
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 px-3 sm:px-4 py-3 border-b border-gray-200 flex items-center">
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Orientation</h3>
              </div>

              <TagInputForm
                tags={customSource.orientation}
                setTags={setCustomSource}
                error={formErrors.orientation}
              />
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
                      <p className="text-xs text-gray-500 mb-2">
                        Indiquer le mode de financement permet de mieux comprendre l'indépendance,
                        les éventuels biais ou la mission de la source. Cette information aide à la
                        transparence et à la confiance pour tous les utilisateurs.
                      </p>
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
              disabled={loading || validationState.step !== 'valid' || !customSource.collectionId}
              className={`px-4 sm:px-6 py-2 rounded-md shadow-sm text-white ${
                loading || validationState.step !== 'valid' || !customSource.collectionId
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Vérification...
                </span>
              ) : validationState.step !== 'valid' ? (
                'Flux RSS requis'
              ) : !customSource.collectionId ? (
                'Collection requise'
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
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  formErrors: PropTypes.object.isRequired,
  handleSelectSource: PropTypes.func,
  collections: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  hideCollectionSection: PropTypes.bool,
};

AddSourceForm.defaultProps = {
  collections: [],
  handleSelectSource: () => {},
  hideCollectionSection: false,
};

export default AddSourceForm;
