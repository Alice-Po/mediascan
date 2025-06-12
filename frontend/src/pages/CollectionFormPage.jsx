import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCollections } from '../hooks/useCollections';
import CollectionForm from '../components/collections/CollectionForm';

const CollectionFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadCollectionById, createCollection, updateCollection } = useCollections();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(id ? true : false);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (id) {
        await updateCollection(id, formData);
        navigate(`/collections/${id}`);
      } else {
        const newCollection = await createCollection(formData);
        navigate(`/collections/${newCollection._id}`);
      }
    } catch (error) {
      console.error('Error saving collection:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <CollectionForm
        initialData={collection}
        onSubmit={handleSubmit}
        onCancel={() => navigate(id ? `/collections/${id}` : '/collections')}
        isSubmitting={submitting}
      />
    </div>
  );
};

export default CollectionFormPage;
