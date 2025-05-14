import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { fetchCollections, addSourceToCollection } from '../../../../api/collectionsApi';
import SourceCatalog from '../../../../components/sources/SourceCatalog';

const AddSourcesToCollection = ({ onValidationChange }) => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [addedSources, setAddedSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier si l'étape est valide (au moins 3 sources ajoutées)
  const isStepValid = addedSources.length >= 3;

  useEffect(() => {
    // Informer le composant parent du changement de validation
    if (onValidationChange) {
      onValidationChange(isStepValid);
    }
  }, [isStepValid, onValidationChange]);

  // Charger les collections de l'utilisateur au montage du composant
  useEffect(() => {
    const loadUserCollections = async () => {
      try {
        setLoading(true);
        const fetchedCollections = await fetchCollections();
        setCollections(fetchedCollections);

        // Si des collections existent, sélectionner la première par défaut
        if (fetchedCollections && fetchedCollections.length > 0) {
          const recentCollection = fetchedCollections[fetchedCollections.length - 1];
          setSelectedCollection(recentCollection);

          // Initialiser les sources déjà présentes dans la collection
          if (recentCollection.sources && Array.isArray(recentCollection.sources)) {
            const sourceIds = recentCollection.sources.map((source) =>
              typeof source === 'string' ? source : source._id
            );
            setAddedSources(sourceIds);
          }
        }
      } catch (err) {
        console.error('Erreur lors du chargement des collections:', err);
        setError('Impossible de charger vos collections');
      } finally {
        setLoading(false);
      }
    };

    loadUserCollections();
  }, []);

  // Gérer l'ajout d'une source à la collection sélectionnée
  const handleAddToCollection = async (source) => {
    if (!selectedCollection) {
      setError("Veuillez d'abord sélectionner une collection");
      return;
    }

    try {
      await addSourceToCollection(selectedCollection._id, source._id);

      // Mettre à jour la liste des sources ajoutées
      setAddedSources((prev) => {
        if (!prev.includes(source._id)) {
          return [...prev, source._id];
        }
        return prev;
      });

      // Mettre à jour la collection sélectionnée
      const updatedCollections = collections.map((collection) => {
        if (collection._id === selectedCollection._id) {
          const updatedSources = collection.sources ? [...collection.sources] : [];
          if (!updatedSources.includes(source._id)) {
            updatedSources.push(source._id);
          }
          return { ...collection, sources: updatedSources };
        }
        return collection;
      });

      setCollections(updatedCollections);
      setSelectedCollection(updatedCollections.find((c) => c._id === selectedCollection._id));
    } catch (err) {
      console.error("Erreur lors de l'ajout de la source à la collection:", err);
      setError("Impossible d'ajouter cette source à la collection");
    }
  };

  // Gérer le changement de collection sélectionnée
  const handleCollectionChange = (e) => {
    const collectionId = e.target.value;
    const collection = collections.find((c) => c._id === collectionId);
    setSelectedCollection(collection);

    if (collection && collection.sources) {
      const sourceIds = collection.sources.map((source) =>
        typeof source === 'string' ? source : source._id
      );
      setAddedSources(sourceIds);
    } else {
      setAddedSources([]);
    }
  };

  // Vérifier si une source est déjà dans la collection sélectionnée
  const isSourceInCollection = useCallback(
    (sourceId) => {
      return addedSources.includes(sourceId);
    },
    [addedSources]
  );

  // Transformer les IDs des sources en objets pour le catalogue
  const collectionSourcesObjects = addedSources.map((id) => ({ _id: id }));

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* En-tête avec animation */}
      <div className="text-center relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
            Ajoutez des sources à votre collection
          </h2>
          <p className="text-sm sm:text-base text-indigo-100">
            Parcourez le catalogue de sources et ajoutez au moins 3 sources à votre collection pour
            continuer.
          </p>
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-500 rounded-full opacity-50 blur-xl"></div>
      </div>

      {/* Message d'instruction si moins de 3 sources sont ajoutées */}
      {!isStepValid && (
        <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-amber-500 mt-0.5 mr-2"
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
            <p className="text-sm text-amber-800">
              Pour continuer, veuillez ajouter au moins 3 sources à votre collection.
            </p>
          </div>
        </div>
      )}

      {/* Message de succès si au moins 3 sources sont ajoutées */}
      {isStepValid && (
        <div className="bg-green-50 p-4 rounded-md border border-green-200">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-green-500 mt-0.5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-sm text-green-800">
              Bravo ! Vous avez ajouté {addedSources.length} sources à votre collection. Vous pouvez
              continuer ou ajouter d'autres sources.
            </p>
          </div>
        </div>
      )}

      {/* Sélection de collection */}
      {loading ? (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700 text-center">{error}</div>
      ) : collections.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-md text-center">
          <p className="text-gray-700">Vous n'avez pas encore créé de collection.</p>
          <p className="text-sm text-gray-500 mt-2">
            Veuillez revenir à l'étape précédente pour créer une collection.
          </p>
        </div>
      ) : (
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <div className="mb-6">
            <label htmlFor="collection" className="block text-sm font-medium text-gray-700 mb-2">
              Choisissez votre collection
            </label>
            <select
              id="collection"
              value={selectedCollection?._id || ''}
              onChange={handleCollectionChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {collections.map((collection) => (
                <option key={collection._id} value={collection._id}>
                  {collection.name}{' '}
                  {collection.sources ? `(${collection.sources.length} sources)` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Compteur de sources ajoutées */}
          <div className="bg-blue-50 p-3 rounded-md mb-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-blue-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span className="text-blue-700 font-medium">
                {addedSources.length} source{addedSources.length !== 1 ? 's' : ''} dans votre
                collection
              </span>
            </div>
          </div>

          {/* Catalogue de sources */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-900 mb-4">Catalogue de sources</h3>
            <p className="text-sm text-gray-600 mb-4">
              Cliquez sur le bouton "+" pour ajouter une source à votre collection.
            </p>
            <SourceCatalog
              onAddToCollection={handleAddToCollection}
              collectionSources={collectionSourcesObjects}
              userCollections={collections}
            />
          </div>
        </div>
      )}
    </div>
  );
};

AddSourcesToCollection.propTypes = {
  onValidationChange: PropTypes.func,
};

export default AddSourcesToCollection;
