import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCollections } from '../hooks/useCollections';
import SourceItem from '../components/sources/SourceItem';
import CollectionDetails from '../components/collections/CollectionDetails';

const CollectionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    loadCollectionById,
    removeSourceFromCollection,
    deleteCollection,
    addSourceToCollection,
  } = useCollections();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true);
        const data = await loadCollectionById(id);
        setCollection(data);
      } catch (error) {
        console.error('Error fetching collection:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCollection();
    }
  }, [id, loadCollectionById]);

  const handleRemoveSource = async (sourceId) => {
    try {
      await removeSourceFromCollection(id, sourceId);
      setCollection((prev) => ({
        ...prev,
        sources: prev.sources.filter((s) => s._id !== sourceId),
      }));
    } catch (error) {
      console.error('Error removing source:', error);
    }
  };

  const handleAddSource = async (sourceId) => {
    try {
      await addSourceToCollection(id, sourceId);
      // Recharger la collection pour avoir la liste à jour des sources
      const updatedCollection = await loadCollectionById(id);
      setCollection(updatedCollection);
    } catch (error) {
      console.error('Error adding source:', error);
    }
  };

  const handleDeleteCollection = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette collection ?')) {
      try {
        await deleteCollection(id);
        navigate('/collections');
      } catch (error) {
        console.error('Error deleting collection:', error);
      }
    }
  };

  const handleEditCollection = () => {
    navigate(`/collections/edit/${id}`);
  };

  const handleBrowseArticles = () => {
    navigate(`/app?collection=${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="py-6 text-center">
        <h2 className="text-xl font-medium text-gray-900">Collection non trouvée</h2>
        <p className="mt-2 text-gray-600">Cette collection n'existe pas ou a été supprimée.</p>
        <button
          onClick={() => navigate('/collections')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Retour aux collections
        </button>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <CollectionDetails
          collection={collection}
          onEdit={handleEditCollection}
          onDelete={handleDeleteCollection}
          onRemoveSource={handleRemoveSource}
          onAddSource={handleAddSource}
          onBrowseArticles={handleBrowseArticles}
        />
      </div>
    </div>
  );
};

export default CollectionDetailsPage;
