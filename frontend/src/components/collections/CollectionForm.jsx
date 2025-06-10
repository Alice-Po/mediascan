import React, { useState, useEffect, useContext, forwardRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar, SNACKBAR_TYPES } from '../../context/SnackbarContext';
import SourcesCatalog from '../sources/SourcesCatalog';
import Modal from '../common/Modal';
import { useCollectionContext } from '../../context/CollectionContext';
import { useCollections } from '../../hooks/useCollections';
import SourcesList from '../sources/SourcesList';

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
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const {
      loading,
      error,
      currentCollection,
      createCollection,
      updateCollection,
      addSourceToCollection,
      removeSourceFromCollection,
      loadCollectionById,
    } = useCollectionContext();

    // Ajout : état pour gérer l'étape du formulaire
    const [step, setStep] = useState(1);
    // Ajout : état pour ouvrir/fermer la modale catalogue
    const [showSourcesCatalog, setShowSourcesCatalog] = useState(false);

    // État local pour le formulaire
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      imageUrl: '',
      isPublic: false,
    });

    // Charger les données de la collection si en mode édition
    useEffect(() => {
      if (currentCollection) {
        setFormData({
          name: currentCollection.name || '',
          description: currentCollection.description || '',
          imageUrl: currentCollection.imageUrl || '',
          isPublic: currentCollection.isPublic || false,
        });
      }
    }, [currentCollection]);

    // Gérer les changements dans les champs du formulaire
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };

    // Retirer une source de la sélection
    const handleRemoveSource = async (source) => {
      try {
        await removeSourceFromCollection(currentCollection._id, source._id);
        showSnackbar('Source retirée de la collection', SNACKBAR_TYPES.SUCCESS);
      } catch (err) {
        showSnackbar('Erreur lors du retrait de la source', SNACKBAR_TYPES.ERROR);
      }
    };

    // Soumettre l'étape 1 (création ou édition)
    const handleStep1Submit = async (e) => {
      e.preventDefault();
      if (!formData.name.trim()) {
        const errorMsg = 'Le nom de la collection est requis';
        if (onError) onError(errorMsg);
        return;
      }
      try {
        let savedCollection;
        if (currentCollection && currentCollection._id) {
          savedCollection = await updateCollection(currentCollection._id, formData);
          showSnackbar('Collection mise à jour avec succès', SNACKBAR_TYPES.SUCCESS);
        } else {
          savedCollection = await createCollection(formData);
          showSnackbar('Collection créée avec succès', SNACKBAR_TYPES.SUCCESS);
        }
        setStep(2);
      } catch (err) {
        const errorMsg =
          currentCollection && currentCollection._id
            ? 'Erreur lors de la mise à jour de la collection'
            : 'Erreur lors de la création de la collection';
        if (onError) onError(errorMsg);
        showSnackbar(errorMsg, SNACKBAR_TYPES.ERROR);
        console.error(err);
      }
    };

    // Navigation entre étapes
    const goToStep1 = () => setStep(1);
    const goToStep2 = () => setStep(2);

    // Handler pour ouvrir/fermer la modale catalogue
    const openSourcesCatalog = () => setShowSourcesCatalog(true);
    const closeSourcesCatalog = async () => {
      setShowSourcesCatalog(false);
      if (currentCollection?._id) {
        await loadCollectionById(currentCollection._id);
      }
    };

    // Handler pour sauvegarder les infos de la collection à l'étape 2
    const handleUpdateInfos = async (e) => {
      e.preventDefault();
      try {
        await updateCollection(currentCollection._id, formData);
        showSnackbar('Infos de la collection mises à jour', SNACKBAR_TYPES.SUCCESS);
      } catch (err) {
        showSnackbar('Erreur lors de la mise à jour des infos', SNACKBAR_TYPES.ERROR);
      }
    };

    // Handler pour la validation finale (redirige ou callback)
    const handleFinalSubmit = () => {
      let shouldRedirect = true;
      if (onSuccess) {
        const result = onSuccess(currentCollection);
        if (result === false) shouldRedirect = false;
      }
      if (shouldRedirect && currentCollection?._id) {
        navigate(`/collections/${currentCollection._id}`);
      }
    };

    if (loading) {
      return (
        <div className="p-6 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    // Rendu étape 1 : formulaire infos collection
    if (step === 1) {
      return (
        <div className={isOnboarding ? '' : 'max-w-4xl mx-auto px-4 sm:px-0'}>
          <div className={isOnboarding ? '' : 'bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6'}>
            {!isOnboarding && (
              <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                {currentCollection && currentCollection._id
                  ? 'Modifier la collection'
                  : 'Créer une nouvelle collection'}
              </h1>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>
            )}
            <form onSubmit={handleStep1Submit} className="space-y-3 sm:space-y-4">
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
                  placeholder="Ex: Actualités Tech, Cuisine Méditerranéenne, etc."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Un titre clair aide les autres utilisateurs à comprendre le contenu de votre
                  collection.
                </p>
              </div>
              <div className="mb-3 sm:mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Décrivez le thème, les sujets ou les types de contenu que vous souhaitez rassembler dans cette collection..."
                ></textarea>
                <p className="mt-1 text-sm text-gray-500">
                  Une description détaillée aide les autres utilisateurs à comprendre l'objet de
                  votre collection.
                </p>
              </div>
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
                  Les collections publiques peuvent être visibles et suivies par d'autres
                  utilisateurs
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 mt-6">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={goToStep1}
                    className="order-2 sm:order-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 w-full sm:w-auto"
                  >
                    Précédent
                  </button>
                )}
                <button
                  type="submit"
                  className="order-1 sm:order-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 w-full sm:w-auto"
                >
                  {currentCollection && currentCollection._id
                    ? 'Enregistrer et passer aux sources'
                    : 'Créer et passer aux sources'}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    // Rendu étape 2 : édition infos + gestion sources
    if (step === 2 && currentCollection && currentCollection._id) {
      return (
        <div className={isOnboarding ? '' : 'max-w-4xl mx-auto px-4 sm:px-0'}>
          <div className={isOnboarding ? '' : 'bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6'}>
            <h2 className="text-xl font-bold mb-4">Gérer la collection</h2>
            {/* Formulaire infos collection (inline) */}
            <form onSubmit={handleUpdateInfos} className="space-y-3 sm:space-y-4 mb-6">
              <div>
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
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                ></textarea>
              </div>
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
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 w-full sm:w-auto"
              >
                Sauvegarder les infos
              </button>
            </form>

            {/* Bouton pour ouvrir le catalogue de sources */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="text-lg font-medium">Sources de la collection</h3>
              <button
                type="button"
                onClick={openSourcesCatalog}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
              >
                Ajouter des sources
              </button>
            </div>

            {/* Liste des sources déjà ajoutées */}
            <SourcesList
              sources={currentCollection.sources || []}
              onSourceDelete={handleRemoveSource}
              showDeleteAction={true}
              showAddToCollectionAction={true}
            />

            {/* Modale catalogue de sources */}
            <Modal
              isOpen={showSourcesCatalog}
              onClose={closeSourcesCatalog}
              title="Catalogue de sources"
              size="2xl"
            >
              <SourcesCatalog
                collectionId={currentCollection._id}
                onClose={closeSourcesCatalog}
                isOnboarding={isOnboarding}
              />
            </Modal>

            {/* Bouton de validation final sticky (mobile-friendly) */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t p-4 pb-16 flex justify-end sm:static sm:p-0 sm:border-0">
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 text-lg font-semibold shadow-md"
              >
                Terminer
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
);

export default CollectionForm;
