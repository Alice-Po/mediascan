import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar, SNACKBAR_TYPES } from '../../../context/SnackbarContext';
import { useCollectionContext } from '../../../context/CollectionContext';
import BaseForm from './BaseForm';
import Modal from '../../common/Modal';
import SourcesCatalog from '../../sources/SourcesCatalog';
import SourcesList from '../../sources/SourcesList';

/**
 * Composant pour la création d'une collection (processus en 2 étapes)
 */
const CreateCollection = ({ isOnboarding = false, onSuccess, onError }) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { createCollection, removeSourceFromCollection, loadCollectionById } =
    useCollectionContext();

  // États
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
  });
  const [error, setError] = useState(null);
  const [createdCollection, setCreatedCollection] = useState(null);
  const [showSourcesCatalog, setShowSourcesCatalog] = useState(false);

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Le nom de la collection est requis');
      if (onError) onError('Le nom de la collection est requis');
      return;
    }

    try {
      const newCollection = await createCollection(formData);
      setCreatedCollection(newCollection);
      setStep(2);
      setShowSourcesCatalog(true);
    } catch (err) {
      const errorMsg = 'Erreur lors de la création de la collection';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      showSnackbar(errorMsg, SNACKBAR_TYPES.ERROR);
      console.error(err);
    }
  };

  const handleRemoveSource = async (source) => {
    try {
      await removeSourceFromCollection(createdCollection._id, source._id);
      // Recharger la collection pour mettre à jour la liste des sources
      const updatedCollection = await loadCollectionById(createdCollection._id);
      setCreatedCollection(updatedCollection);
      showSnackbar('Source retirée de la collection', SNACKBAR_TYPES.SUCCESS);
    } catch (err) {
      showSnackbar('Erreur lors du retrait de la source', SNACKBAR_TYPES.ERROR);
    }
  };

  const handleFinish = () => {
    showSnackbar(
      `Collection "${createdCollection.name}" créée avec succès !`,
      SNACKBAR_TYPES.SUCCESS
    );
    if (onSuccess) {
      const result = onSuccess(createdCollection);
      if (result !== false) {
        navigate(`/collections/${createdCollection._id}`);
      }
    } else {
      navigate(`/collections/${createdCollection._id}`);
    }
  };

  // Rendu étape 1 : Création de la collection
  if (step === 1) {
    return (
      <div className={isOnboarding ? '' : 'max-w-4xl mx-auto px-4 sm:px-0'}>
        <div className={isOnboarding ? '' : 'bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6'}>
          {!isOnboarding && (
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Créer une nouvelle collection
            </h1>
          )}
          <BaseForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleStep1Submit}
            submitLabel="Créer et passer aux sources"
            error={error}
          />
        </div>
      </div>
    );
  }

  // Rendu étape 2 : Ajout des sources
  return (
    <div className={isOnboarding ? '' : 'max-w-4xl mx-auto px-4 sm:px-0'}>
      <div className={isOnboarding ? '' : 'bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6'}>
        <div className="border-b pb-4 mb-6">
          <h2 className="text-xl font-bold mb-2">{createdCollection?.name}</h2>
          {createdCollection?.description && (
            <p className="text-gray-600 mb-2">{createdCollection.description}</p>
          )}
          <div className="flex items-center text-sm text-gray-500">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full ${
                createdCollection?.isPublic
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {createdCollection?.isPublic ? 'Collection publique' : 'Collection privée'}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Ajouter des sources à la collection</h3>

        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <button
            type="button"
            onClick={() => setShowSourcesCatalog(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
          >
            Ajouter des sources
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Sources de la collection :</h3>
          <SourcesList
            sources={createdCollection?.sources || []}
            onSourceDelete={handleRemoveSource}
            showDeleteAction={true}
            showAddToCollectionAction={false}
          />
        </div>

        <Modal
          isOpen={showSourcesCatalog}
          onClose={async () => {
            setShowSourcesCatalog(false);
            // Recharger la collection pour obtenir la liste mise à jour des sources
            try {
              const updatedCollection = await loadCollectionById(createdCollection._id);
              setCreatedCollection(updatedCollection);
            } catch (err) {
              console.error('Erreur lors du rechargement de la collection:', err);
            }
          }}
          title="Catalogue de sources"
          size="2xl"
        >
          <SourcesCatalog
            collectionId={createdCollection?._id}
            onClose={async () => {
              setShowSourcesCatalog(false);
              // Recharger la collection pour obtenir la liste mise à jour des sources
              try {
                const updatedCollection = await loadCollectionById(createdCollection._id);
                setCreatedCollection(updatedCollection);
              } catch (err) {
                console.error('Erreur lors du rechargement de la collection:', err);
              }
            }}
            isOnboarding={isOnboarding}
          />
        </Modal>

        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t p-4 pb-16 flex justify-end sm:static sm:p-0 sm:border-0">
          <button
            type="button"
            onClick={handleFinish}
            className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 text-lg font-semibold shadow-md"
          >
            Terminer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCollection;
