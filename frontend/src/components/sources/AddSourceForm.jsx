import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import RssHelpModal from './RssHelpModal';
import PremiumBanner from '../premium/PremiumBanner';
import { SimpleSourceItem } from './SourceItem';
import { useSnackbar, SNACKBAR_TYPES } from '../../context/SnackbarContext';
import TagInputForm from '../common/TagInputForm';
import ArticlePreview from '../articles/ArticlePreview';

const AddSourceForm = ({
  onSubmit,
  onCancel,
  loading,
  formErrors,
  suggestions = [],
  handleSelectSource = () => {},
  collections = [],
  hideCollectionSection = false,
  defaultCollectionId = '',
}) => {
  const { showSnackbar } = useSnackbar();
  const [showRssHelp, setShowRssHelp] = useState(false);
  const [rssValidationState, setRssValidationState] = useState({
    status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
    message: '',
    details: '',
  });

  // Trouver la collection par défaut
  const defaultCollection =
    collections.find((collection) => collection.isDefault) || collections[0];

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
    collectionId: hideCollectionSection
      ? defaultCollectionId || defaultCollection?._id || ''
      : defaultCollection?._id || '',
  });
  const [previewArticles, setPreviewArticles] = useState([]);

  // Si hideCollectionSection est actif, forcer collectionId à la valeur par défaut à chaque changement d'URL RSS
  useEffect(() => {
    if (hideCollectionSection) {
      setCustomSource((prev) => ({
        ...prev,
        collectionId: defaultCollectionId || defaultCollection?._id || '',
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideCollectionSection, defaultCollectionId]);

  // Fonction pour vérifier le flux RSS
  const checkRssFeed = async (url) => {
    try {
      setRssValidationState({ status: 'loading', message: 'Vérification du flux RSS...' });
      console.log('Vérification du flux RSS:', url);
      const response = await fetch('/api/sources/check-rss', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rssUrl: url }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Vérifier si le message d'erreur contient "Status code 403"
        if (data.error && data.error.includes('Status code 403')) {
          throw new Error('FORBIDDEN');
        }
        throw new Error(data.error || 'Erreur lors de la vérification du flux RSS');
      }

      console.log('Contenu du flux RSS:', data);

      // Pré-remplir les champs avec les données du flux
      if (data) {
        setCustomSource((prev) => ({
          ...prev,
          name: data.title || prev.name,
          description: data.description || prev.description,
          url: data.link || prev.url,
        }));
        setRssValidationState({
          status: 'success',
          message: 'Flux RSS valide !',
        });
        // Transformer les articles pour s'assurer que nous avons la date de publication
        const transformedArticles = data.items.map((item) => ({
          ...item,
          pubDate: item.pubDate || item.isoDate || item.date || new Date().toISOString(),
        }));
        setPreviewArticles(transformedArticles);
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la vérification du flux RSS:', error);
      if (error.message === 'FORBIDDEN') {
        setRssValidationState({
          status: 'error',
          message: '😕 Oups ! Ce flux RSS semble verrouillé',
          details:
            "Le site que vous essayez d'ajouter ne nous autorise pas à récupérer son contenu (erreur 403).",
        });
      } else {
        setRssValidationState({
          status: 'error',
          message: 'Flux RSS invalide ou inaccessible',
          details: error.message || 'Une erreur est survenue lors de la vérification du flux.',
        });
      }
      setPreviewArticles([]);
      return null;
    }
  };

  // Debounce pour éviter trop d'appels API
  const [debouncedRssUrl, setDebouncedRssUrl] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedRssUrl) {
        checkRssFeed(debouncedRssUrl);
      }
    }, 1000); // Attendre 1 seconde après la dernière modification

    return () => clearTimeout(timer);
  }, [debouncedRssUrl]);

  const handleCustomSourceChange = (e) => {
    const { name, value, type } = e.target;
    console.log('Input change event:', {
      name,
      value,
      type,
      element: e.target,
      validity: e.target.validity,
    });

    if (name === 'rssUrl') {
      setDebouncedRssUrl(value);
    }

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

    // Nettoyer le champ funding.type si vide
    const cleanedSource = {
      ...customSource,
      funding: {
        ...customSource.funding,
        type: customSource.funding?.type ? customSource.funding.type : undefined,
      },
      collectionId: hideCollectionSection
        ? defaultCollectionId || defaultCollection?._id || ''
        : customSource.collectionId,
    };
    if (!cleanedSource.funding.type) delete cleanedSource.funding.type;
    if (!cleanedSource.funding.details) delete cleanedSource.funding.details;
    if (Object.keys(cleanedSource.funding).length === 0) delete cleanedSource.funding;

    try {
      await onSubmit(cleanedSource);

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
        collectionId: hideCollectionSection
          ? defaultCollectionId || defaultCollection?._id || ''
          : defaultCollection?._id || '',
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
                  />
                  {/* Indicateur de validation RSS (masqué sur mobile) */}
                  <div className="absolute inset-y-0 right-0 pr-3 items-center hidden sm:flex">
                    {rssValidationState.status === 'loading' && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                    )}
                    {rssValidationState.status === 'success' && (
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
                    {rssValidationState.status === 'error' && (
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
                    onClick={() => {
                      setCustomSource((prev) => ({ ...prev, rssUrl: '' }));
                      setRssValidationState({ status: 'idle', message: '', details: '' });
                      setPreviewArticles([]);
                    }}
                    className="mt-2 text-xs text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Essayer une autre URL de flux
                  </button>
                )}
                {/* Message de validation */}
                {rssValidationState.status !== 'idle' && (
                  <div
                    className={`mt-1.5 ${
                      rssValidationState.status === 'success'
                        ? 'text-green-600'
                        : rssValidationState.status === 'error'
                        ? 'text-red-600'
                        : 'text-blue-600'
                    }`}
                  >
                    <p className="text-sm font-medium">{rssValidationState.message}</p>
                    {rssValidationState.details && (
                      <p className="text-sm mt-1">{rssValidationState.details}</p>
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
                {rssValidationState.status === 'success' && previewArticles.length > 0 && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Derniers articles</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {previewArticles.map((article, index) => (
                        <ArticlePreview key={index} article={article} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Section d'aide pour trouver l'URL du flux */}
                {rssValidationState.status !== 'success' && (
                  <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-start space-x-3">
                      {' '}
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
                          Comment trouver l'URL d'un flux ?
                        </h4>
                        <div className="space-y-4">
                          <p className="text-sm text-gray-700">
                            Rendez-vous sur le site web auquel vous souhaitez vous abonner.
                          </p>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-sm font-medium text-gray-900 mb-2">
                              Cherchez ces icônes :
                            </p>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm font-medium">
                                  RSS
                                </span>
                                <span className="text-sm text-gray-600">ou</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <svg
                                  className="h-5 w-5 text-gray-600"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 13.1v-3z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                            <p className="text-sm text-blue-700">
                              <span className="font-medium">Astuce :</span> Le plus simple est
                              d'utiliser des extensions de votre navigateur pour récupérer
                              facilement l'URL du flux.
                            </p>
                          </div>
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
                            J'ai besoin de plus d'aide
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out ${
              rssValidationState.status === 'success'
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
              <div className="p-3 sm:p-4">
                <label
                  htmlFor="orientation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tags (0/3)
                </label>
                <TagInputForm
                  tags={customSource.orientation}
                  setTags={setCustomSource}
                  error={formErrors.orientation}
                />
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
              disabled={
                loading || rssValidationState.status !== 'success' || !customSource.collectionId
              }
              className={`px-4 sm:px-6 py-2 rounded-md shadow-sm text-white ${
                loading || rssValidationState.status !== 'success' || !customSource.collectionId
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Vérification...
                </span>
              ) : rssValidationState.status !== 'success' ? (
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

      {/* <div className="bg-gray-50 p-3 sm:p-4 border-t border-gray-200">
        <PremiumBanner
          title="Vous trouvez cette gestion de sources un peu légère ?"
          description="Nous réfléchissons à une approche intelligente de modération communautaire pour enrichir et valider collectivement les descriptions des sources."
          linkText="Contribuer à la réflexion"
        />
      </div> */}

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
  hideCollectionSection: PropTypes.bool,
  defaultCollectionId: PropTypes.string,
};

AddSourceForm.defaultProps = {
  collections: [],
  suggestions: [],
  handleSelectSource: () => {},
  hideCollectionSection: false,
  defaultCollectionId: '',
};

export default AddSourceForm;
