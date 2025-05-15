import React, { useState, useEffect, useContext, useImperativeHandle, forwardRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import SourceCatalog from '../sources/SourceCatalog';
import Modal from '../common/Modal';
import {
  createCollection,
  updateCollection,
  fetchCollectionById,
  addSourceToCollection,
} from '../../api/collectionsApi';

/**
 * Composant pour créer ou modifier une collection
 *
 * @param {Object} props - Les propriétés du composant
 * @param {boolean} props.isOnboarding - Indique si le formulaire est utilisé dans le processus d'onboarding
 * @param {Function} props.onSuccess - Callback appelé après une création/mise à jour réussie
 * @param {Function} props.onError - Callback appelé en cas d'erreur
 * @param {Function} props.setFormRef - Fonction pour exposer l'API du formulaire au parent
 * @param {boolean} props.hideNavigation - Masque les boutons de navigation
 */
const CollectionForm = forwardRef(
  ({ isOnboarding = false, onSuccess, onError, setFormRef, hideNavigation = false }, ref) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const {
      collections,
      loadingCollections,
      sources: userSources,
    } = useContext(AppContext) || { collections: [], loadingCollections: false, sources: [] };

    // État local pour le formulaire
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      imageUrl: '',
      isPublic: false,
    });

    const [selectedSources, setSelectedSources] = useState([]);
    const [showSourceCatalogModal, setShowSourceCatalogModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Exposer des méthodes pour le parent via useImperativeHandle et ref
    useImperativeHandle(ref, () => ({
      applySuggestion: (suggestion) => {
        setFormData((prev) => ({
          ...prev,
          name: suggestion.name || '',
          description: suggestion.description || '',
        }));
      },
      getFormData: () => formData,
      resetForm: () => {
        setFormData({
          name: '',
          description: '',
          imageUrl: '',
          isPublic: false,
        });
        setSelectedSources([]);
      },
    }));

    // Passer la référence au parent si nécessaire
    useEffect(() => {
      if (setFormRef && typeof setFormRef === 'function') {
        setFormRef({
          applySuggestion: (suggestion) => {
            setFormData((prev) => ({
              ...prev,
              name: suggestion.name || '',
              description: suggestion.description || '',
            }));
          },
        });
      }
    }, [setFormRef]);

    // Charger les données de la collection si en mode édition
    useEffect(() => {
      const fetchCollection = async () => {
        if (isEditMode) {
          try {
            setLoading(true);
            const collection = await fetchCollectionById(id);
            setFormData({
              name: collection.name || '',
              description: collection.description || '',
              imageUrl: collection.imageUrl || '',
              isPublic: collection.isPublic || false,
            });

            // Stocker les sources de la collection pour la sélection
            if (collection.sources && Array.isArray(collection.sources)) {
              setSelectedSources(collection.sources);
            }
          } catch (err) {
            setError('Impossible de charger la collection');
            console.error(err);
            if (onError) onError('Impossible de charger la collection');
          } finally {
            setLoading(false);
          }
        }
      };

      fetchCollection();
    }, [id, isEditMode]);

    // Gérer les changements dans les champs du formulaire
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };

    // Ajouter une source à la collection (pendant l'édition)
    const handleAddSource = async (source) => {
      // Vérifier si la source n'est pas déjà dans la sélection
      if (!selectedSources.some((s) => s._id === source._id)) {
        setSelectedSources((prev) => [...prev, source]);
      }
    };

    // Retirer une source de la sélection
    const handleRemoveSource = (sourceId) => {
      setSelectedSources((prev) => prev.filter((source) => source._id !== sourceId));
    };

    // Soumettre le formulaire
    const handleSubmit = async (e) => {
      e.preventDefault();

      // Validation de base
      if (!formData.name.trim()) {
        const errorMsg = 'Le nom de la collection est requis';
        setError(errorMsg);
        if (onError) onError(errorMsg);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Données à envoyer
        const collectionData = {
          ...formData,
          // Les sources seront gérées séparément après la création/mise à jour
        };

        // Créer ou mettre à jour la collection
        let savedCollection;

        if (isEditMode) {
          savedCollection = await updateCollection(id, collectionData);

          // En mode édition, mettre à jour les sources si nécessaire
          if (selectedSources.length > 0) {
            // Cette partie varie selon votre API - voici une approche possible:
            // Vous pourriez avoir besoin de synchroniser les sources sélectionnées
            // avec le backend d'une manière spécifique à votre application

            // Exemple: pour chaque source non présente dans la collection originale
            for (const source of selectedSources) {
              if (
                !savedCollection.sources ||
                !savedCollection.sources.some((s) => s._id === source._id)
              ) {
                await addSourceToCollection(savedCollection._id, source._id);
              }
            }

            // Note: il faudrait aussi gérer la suppression des sources désélectionnées
            // si votre API le permet
          }

          if (onSuccess) {
            onSuccess(savedCollection);
          } else {
            navigate(`/collections/${id}`);
          }
        } else {
          savedCollection = await createCollection(collectionData);

          // En mode création, ajouter les sources sélectionnées
          if (selectedSources.length > 0) {
            for (const source of selectedSources) {
              await addSourceToCollection(savedCollection._id, source._id);
            }
          }

          if (onSuccess) {
            onSuccess(savedCollection);
          } else {
            navigate(`/collections/${savedCollection._id}`);
          }
        }
      } catch (err) {
        const errorMsg = isEditMode
          ? 'Erreur lors de la mise à jour de la collection'
          : 'Erreur lors de la création de la collection';

        setError(errorMsg);
        if (onError) onError(errorMsg);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Ouvrir la modale du catalogue de sources
    const openSourceCatalog = () => {
      setShowSourceCatalogModal(true);
    };

    // Fermer la modale du catalogue de sources
    const closeSourceCatalog = () => {
      setShowSourceCatalogModal(false);
    };

    if (loading || loadingCollections) {
      return (
        <div className="p-6 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div className={isOnboarding ? '' : 'max-w-4xl mx-auto px-4 sm:px-0'}>
        <div className={isOnboarding ? '' : 'bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6'}>
          {!isOnboarding && (
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              {isEditMode ? 'Modifier la collection' : 'Créer une nouvelle collection'}
            </h1>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="mb-3 sm:mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la collection*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
            </div>

            <div className="mb-3 sm:mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              ></textarea>
            </div>
            {/* 
            <div className="mb-4">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                URL de l'image
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Aperçu"
                    className="w-16 h-16 object-cover rounded-md"
                    onError={(e) => {
                      e.target.src = '';
                    }}
                  />
                </div>
              )}
            </div> */}

            <div className="mb-3 sm:mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                  Collection publique
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Les collections publiques peuvent être visibles par d'autres utilisateurs
              </p>
            </div>

            {/* Section des sources sélectionnées */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <h2 className="text-lg font-medium text-gray-900">Sources sélectionnées</h2>
                <button
                  type="button"
                  onClick={openSourceCatalog}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 text-sm w-full sm:w-auto"
                >
                  Parcourir le catalogue de sources
                </button>
              </div>

              {selectedSources.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded-md text-center text-gray-500">
                  Aucune source n'a été sélectionnée. Parcourez le catalogue pour ajouter des
                  sources.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-2">
                  {selectedSources.map((source) => (
                    <div
                      key={source._id}
                      className="flex items-center p-3 border border-gray-200 rounded-md"
                    >
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center overflow-hidden mr-3 flex-shrink-0"
                        style={{
                          backgroundImage: source.faviconUrl ? `url(${source.faviconUrl})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: !source.faviconUrl ? '#f3f4f6' : undefined,
                        }}
                      >
                        {!source.faviconUrl && (
                          <span className="text-gray-500 text-xs">
                            {source.name.substring(0, 1).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {source.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">{source.url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSource(source._id)}
                        className="ml-2 p-1 text-gray-400 hover:text-red-500"
                        title="Retirer de la sélection"
                        aria-label={`Retirer ${source.name} de la sélection`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Boutons de navigation */}
            {!hideNavigation && (
              <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="order-2 sm:order-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 w-full sm:w-auto"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="order-1 sm:order-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 w-full sm:w-auto"
                >
                  {isEditMode ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            )}

            {hideNavigation && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 w-full sm:w-auto"
                >
                  {isEditMode ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Modale pour le catalogue de sources */}
        <Modal
          isOpen={showSourceCatalogModal}
          onClose={closeSourceCatalog}
          title="Catalogue de sources"
          size="2xl"
        >
          <div className="p-2">
            <SourceCatalog
              onAddToCollection={handleAddSource}
              collectionSources={selectedSources}
              userCollections={collections}
            />
          </div>
        </Modal>
      </div>
    );
  }
);

export default CollectionForm;
