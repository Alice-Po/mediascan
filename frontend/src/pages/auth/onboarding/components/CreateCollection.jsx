import React, { useState, useEffect } from 'react';
import { createCollection, fetchCollections } from '../../../../api/collectionsApi';

const CreateCollection = ({ onValidationChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
    sources: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userCollections, setUserCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    { name: 'Au potager', description: 'Inspiration et apprentissage pour le jardinage' },
    { name: 'Municipalisme', description: 'Innovation démocratique et citoyenne' },
    {
      name: 'Sciences et découvertes',
      description: 'Articles scientifiques et découvertes récentes',
    },
    { name: 'Info Bretagne', description: 'Presse locale bretonne' },
  ]);

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

  useEffect(() => {
    // Informer le composant parent du changement de validation (formulaire valide si collection créée)
    if (onValidationChange) {
      onValidationChange(success);
    }
  }, [success, onValidationChange]);

  useEffect(() => {
    // Charger les collections au montage du composant
    loadUserCollections();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const applySuggestion = (suggestion) => {
    setFormData((prevData) => ({
      ...prevData,
      name: suggestion.name,
      description: suggestion.description,
    }));
  };

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

      await createCollection(formData);
      setSuccess(true);

      // Reset form after successful creation
      setFormData({
        name: '',
        description: '',
        isPublic: false,
        sources: [],
      });

      // Recharger les collections après création réussie
      await loadUserCollections();
    } catch (err) {
      console.error('Erreur lors de la création de la collection:', err);
      setError('Impossible de créer la collection');
    } finally {
      setLoading(false);
    }
  };

  // Générer une couleur aléatoire basée sur l'ID
  const generateColorFromId = (id) => {
    const colors = [
      '#4F46E5', // indigo-600
      '#7C3AED', // violet-600
      '#EC4899', // pink-600
      '#0891B2', // cyan-600
      '#16A34A', // green-600
      '#CA8A04', // yellow-600
      '#EA580C', // orange-600
      '#DC2626', // red-600
    ];

    let sum = 0;
    for (let i = 0; i < id.length; i++) {
      sum += id.charCodeAt(i);
    }

    return colors[sum % colors.length];
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
      {!success && userCollections.length === 0 && (
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
              Pour continuer, veuillez créer votre première collection en remplissant le formulaire
              ci-dessous.
            </p>
          </div>
        </div>
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

      {/* Formulaire de création de collection */}
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg text-center">
          {userCollections.length > 0
            ? 'Créer une autre collection'
            : 'Créer votre première collection'}
        </h3>

        {/* Suggestions de collections */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">Suggestions de collections :</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => applySuggestion(suggestion)}
                className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors"
              >
                {suggestion.name}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              placeholder="Ex: Actualités tech"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Décrivez votre collection en quelques mots..."
            ></textarea>
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                Collection publique
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Les collections publiques peuvent être visibles et suivies par d'autres utilisateurs
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Création en cours...
              </>
            ) : (
              'Créer ma collection'
            )}
          </button>
        </form>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userCollections.map((collection) => (
                <CollectionExample
                  key={collection._id}
                  id={collection._id}
                  title={collection.name}
                  color={collection.colorHex || generateColorFromId(collection._id)}
                  count={collection.sources?.length || 0}
                  description={collection.description}
                  isPublic={collection.isPublic}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Composant pour afficher un exemple de collection
const CollectionExample = ({ id, title, color, count, description, isPublic }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all">
    <div className="flex items-center mb-2">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        {title.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          {isPublic && (
            <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-800">
              Public
            </span>
          )}
        </div>
        <p className="text-xs text-gray-600">
          {count} source{count !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
    {description && <p className="text-sm text-gray-700 mt-2 italic">"{description}"</p>}
  </div>
);

export default CreateCollection;
