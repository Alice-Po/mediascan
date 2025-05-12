import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

/**
 * Composant pour créer ou modifier une collection
 */
const CollectionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const {
    createCollection,
    updateCollection,
    loadCollectionById,
    collections,
    loadingCollections,
  } = useContext(AppContext);

  // État local pour le formulaire
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    isPublic: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les données de la collection si en mode édition
  useEffect(() => {
    const fetchCollection = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const collection = await loadCollectionById(id);
          setFormData({
            name: collection.name || '',
            description: collection.description || '',
            imageUrl: collection.imageUrl || '',
            isPublic: collection.isPublic || false,
          });
        } catch (err) {
          setError('Impossible de charger la collection');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCollection();
  }, [id, isEditMode, loadCollectionById]);

  // Gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation de base
    if (!formData.name.trim()) {
      setError('Le nom de la collection est requis');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEditMode) {
        await updateCollection(id, formData);
        navigate(`/collections/${id}`);
      } else {
        const newCollection = await createCollection(formData);
        navigate(`/collections/${newCollection._id}`);
      }
    } catch (err) {
      setError(
        isEditMode
          ? 'Erreur lors de la mise à jour de la collection'
          : 'Erreur lors de la création de la collection'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || loadingCollections) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Modifier la collection' : 'Créer une nouvelle collection'}
      </h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la collection*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

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
        </div>

        <div className="mb-6">
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
          <p className="text-xs text-gray-500 mt-1">
            Les collections publiques peuvent être visibles par d'autres utilisateurs
          </p>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isEditMode ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollectionForm;
