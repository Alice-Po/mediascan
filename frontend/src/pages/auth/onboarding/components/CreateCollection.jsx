import React, { useState, useEffect, useContext, useRef } from 'react';
import { fetchCollections } from '../../../../api/collectionsApi';
import CollectionItem from '../../../../components/collections/CollectionItem';
import { AuthContext } from '../../../../context/AuthContext';
import WarningBanner from '../../../../components/common/WarningBanner';
import CollectionForm from '../../../../components/collections/CollectionForm';
import CollectionsList from '../../../../components/collections/CollectionsList';

const CreateCollection = ({ onValidationChange }) => {
  const { user } = useContext(AuthContext);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [userCollections, setUserCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const lastValidationValue = useRef(false);
  const formRef = useRef(null);

  // Vérifier si au moins une collection existe
  const isCurrentlyValid = userCollections.length > 0;

  // Suggestions pour l'autocomplétion
  const suggestions = [
    {
      name: 'Au potager',
      description:
        'Inspiration et apprentissage pour le jardinage à destiation des particuliers. Orientation vivrière et permaculture.',
    },
    {
      name: 'Innovation démocratique',
      description: "Blog et sources qui font de l'innavation démocratique et citoyenne",
    },
    {
      name: "Biologie et science de l'ADN",
      description:
        "Articles scientifiques et découvertes récentes sur la biologie et la science de l'ADN",
    },
    { name: 'Info Bretagne', description: 'Presse locale bretonne' },
  ];

  // Charger les collections de l'utilisateur au montage ou après une création réussie
  const loadUserCollections = async () => {
    try {
      setCollectionsLoading(true);
      const collections = await fetchCollections();
      setUserCollections(collections);
    } catch (err) {
      console.error('Erreur lors du chargement des collections:', err);
    } finally {
      setCollectionsLoading(false);
    }
  };

  // Informer le composant parent du changement de validation
  useEffect(() => {
    if (onValidationChange && isCurrentlyValid !== lastValidationValue.current) {
      lastValidationValue.current = isCurrentlyValid;
      onValidationChange(isCurrentlyValid);
    }
  }, [isCurrentlyValid, onValidationChange]);

  useEffect(() => {
    // Charger les collections au montage du composant
    loadUserCollections();
  }, []);

  // Gestionnaire pour la création de collection via CollectionForm
  const handleCollectionCreated = async (collection) => {
    setSuccess(true);
    setError(null);
    await loadUserCollections();

    // Réinitialiser le formulaire après création réussie
    if (formRef.current && typeof formRef.current.resetForm === 'function') {
      formRef.current.resetForm();
    }
  };

  // Gestionnaire pour les erreurs de CollectionForm
  const handleFormError = (errorMessage) => {
    setError(errorMessage);
    setSuccess(false);
  };

  // Appliquer une suggestion au formulaire
  const handleApplySuggestion = (suggestion) => {
    if (formRef.current && typeof formRef.current.applySuggestion === 'function') {
      formRef.current.applySuggestion(suggestion);
    }
  };

  // Gestionnaire pour la suppression d'une collection
  const handleCollectionDeleted = (deletedCollection) => {
    console.log('Collection supprimée:', deletedCollection._id);
    // Mettre à jour l'état local en retirant la collection supprimée
    setUserCollections((prev) =>
      prev.filter((collection) => collection._id !== deletedCollection._id)
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* En-tête avec animation */}
      <div className="text-center relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
            Créez votre première collection
          </h2>
          <p className="text-sm sm:text-base text-indigo-100">
            Créez votre propre collection de sources d'information et organisez votre veille
            médiatique de manière personnalisée.
          </p>
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-500 rounded-full opacity-50 blur-xl"></div>
      </div>

      {/* Message d'instruction si aucune collection n'est créée */}
      {!isCurrentlyValid && (
        <WarningBanner message="Pour continuer, veuillez créer votre première collection en remplissant le formulaire ci-dessous." />
      )}

      {/* Message de succès si une collection a été créée */}
      {success && (
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
              Votre collection a été créée avec succès ! Vous pouvez passer à l'étape suivante.
            </p>
          </div>
        </div>
      )}

      {/* Suggestions de collections */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-4">
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">Suggestions de collections :</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleApplySuggestion(suggestion)}
                className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors"
              >
                {suggestion.name}
              </button>
            ))}
          </div>
        </div>

        {/* Formulaire de création de collection */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <CollectionForm
            ref={formRef}
            isOnboarding={true}
            onSuccess={handleCollectionCreated}
            onError={handleFormError}
            hideNavigation={true}
          />
        </div>
      </div>

      {/* Affichage des collections de l'utilisateur */}
      {userCollections.length > 0 && (
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 text-lg">Mes collections</h3>

          {collectionsLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <CollectionsList
              collections={userCollections}
              showEditAction={false}
              showViewAction={true}
              showDeleteAction={true}
              showShareAction={false}
              isOnboarding={true}
              onCollectionDeleted={handleCollectionDeleted}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CreateCollection;
