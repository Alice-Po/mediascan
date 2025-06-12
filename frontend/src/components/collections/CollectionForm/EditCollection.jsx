import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar, SNACKBAR_TYPES } from '../../../context/SnackbarContext';
import { useCollectionContext } from '../../../context/CollectionContext';
import BaseForm from './BaseForm';
import Modal from '../../common/Modal';
import SourcesCatalog from '../../sources/SourcesCatalog';
import SourcesList from '../../sources/SourcesList';

/**
 * Composant pour la modification d'une collection existante
 */
const EditCollection = ({ collectionId, onSuccess, onError }) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { currentCollection, updateCollection, removeSourceFromCollection, loadCollectionById } =
    useCollectionContext();

  // États
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
  });
  const [error, setError] = useState(null);
  const [showSourcesCatalog, setShowSourcesCatalog] = useState(false);

  // Charger les données de la collection
  useEffect(() => {
    const loadCollection = async () => {
      try {
        await loadCollectionById(collectionId);
      } catch (err) {
        setError('Erreur lors du chargement de la collection');
        if (onError) onError('Erreur lors du chargement de la collection');
      }
    };

    loadCollection();
  }, [collectionId, loadCollectionById]);

  // Mettre à jour le formulaire quand la collection est chargée
  useEffect(() => {
    if (currentCollection) {
      setFormData({
        name: currentCollection.name || '',
        description: currentCollection.description || '',
        isPublic: currentCollection.isPublic || false,
      });
    }
  }, [currentCollection]);

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Le nom de la collection est requis');
      if (onError) onError('Le nom de la collection est requis');
      return;
    }

    try {
      await updateCollection(collectionId, formData);
      showSnackbar('Collection mise à jour avec succès', SNACKBAR_TYPES.SUCCESS);

      if (onSuccess) {
        const result = onSuccess(currentCollection);
        if (result !== false) {
          navigate(`/collections/${collectionId}`);
        }
      }
    } catch (err) {
      const errorMsg = 'Erreur lors de la mise à jour de la collection';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      showSnackbar(errorMsg, SNACKBAR_TYPES.ERROR);
      console.error(err);
    }
  };

  const handleRemoveSource = async (source) => {
    try {
      await removeSourceFromCollection(collectionId, source._id);
      showSnackbar('Source retirée de la collection', SNACKBAR_TYPES.SUCCESS);
    } catch (err) {
      showSnackbar('Erreur lors du retrait de la source', SNACKBAR_TYPES.ERROR);
    }
  };

  if (!currentCollection) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Modifier la collection</h1>

        <BaseForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel="Enregistrer les modifications"
          error={error}
        />

        <div className="mt-8 pt-6 border-t">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-lg font-medium">Sources de la collection</h2>
            <button
              type="button"
              onClick={() => setShowSourcesCatalog(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
            >
              Ajouter des sources
            </button>
          </div>

          <SourcesList
            sources={currentCollection.sources || []}
            onSourceDelete={handleRemoveSource}
            showDeleteAction={true}
            showAddToCollectionAction={true}
          />

          <Modal
            isOpen={showSourcesCatalog}
            onClose={() => setShowSourcesCatalog(false)}
            title="Catalogue de sources"
            size="2xl"
          >
            <SourcesCatalog
              collectionId={collectionId}
              onClose={() => setShowSourcesCatalog(false)}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default EditCollection;
