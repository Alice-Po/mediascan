import React, { useState, useEffect, useContext } from 'react';
import { useSources } from '../hooks/useSources';
import { DeletableSourceItem, SimpleSourceItem } from '../components/sources/SourceItem';
import AddSourceForm from '../components/sources/AddSourceForm';
import SourceCatalog from '../components/sources/SourceCatalog';
import PremiumBanner from '../components/premium/PremiumBanner';
import { useCollections } from '../hooks/useCollections';
import { AuthContext } from '../context/AuthContext';

const Sources = () => {
  const { user } = useContext(AuthContext);
  const {
    sources: userSources,
    allSources,
    loading: loadingSources,
    error,
    enableSource,
    disableSource,
    addSource,
    loadUserSources,
    loadAllSources,
  } = useSources();

  const {
    collections,
    loadCollections,
    loadingCollections,
    addSourceToCollection,
    createCollection,
  } = useCollections(user);

  // State local pour l'UI
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [selectedSource, setSelectedSource] = useState(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showNewCollectionForm, setShowNewCollectionForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [showCatalog, setShowCatalog] = useState(false);

  // Charger les sources au montage
  useEffect(() => {
    loadUserSources();
    loadAllSources();
  }, [loadUserSources, loadAllSources]);

  // Charger les collections lors du montage initial ET lorsque la modal est ouverte
  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  // Charger les collections spécifiquement quand la modale s'ouvre
  useEffect(() => {
    if (showCollectionModal) {
      loadCollections();
      // Enregistrer des informations de débogage
      setDebugInfo({
        user: user ? 'Utilisateur connecté' : "Pas d'utilisateur",
        collectionsCount: collections.length,
        timestamp: new Date().toISOString(),
      });
    }
  }, [showCollectionModal, loadCollections, user, collections.length]);

  // Gérer la recherche et les suggestions
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedIndex(-1);

    if (value.trim()) {
      const filtered = allSources
        .filter(
          (source) =>
            source.name.toLowerCase().includes(value.toLowerCase()) &&
            !userSources.some((us) => us._id === source._id)
        )
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setShowAddForm(filtered.length === 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setShowAddForm(false);
    }
  };

  // Handler pour la sélection d'une suggestion
  const handleSuggestionSelect = async (source) => {
    await enableSource(source._id);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  // Handler pour la soumission du formulaire
  const handleSubmit = async (sourceData) => {
    try {
      await addSource(sourceData);
      setShowAddForm(false);
      setFormErrors({});
    } catch (error) {
      setFormErrors(error.response?.data?.errors || {});
    }
  };

  // Handler pour l'ajout à une collection
  const handleAddToCollection = async (source) => {
    setSelectedSource(source);

    // Force un chargement des collections avant d'ouvrir la modale
    try {
      console.log('Chargement forcé des collections...');
      await loadCollections();
      console.log(`${collections.length} collections chargées`);

      if (collections.length === 0 && user) {
        console.warn("Collections vides malgré l'utilisateur connecté:", user);
        setActionError('Problème de chargement des collections. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des collections:', error);
      setActionError('Impossible de charger vos collections');
    }

    setShowCollectionModal(true);
    setShowNewCollectionForm(false);
    setNewCollectionName('');
  };

  // Ajouter à une collection existante
  const handleAddToExistingCollection = async (collectionId) => {
    if (!selectedSource) return;

    try {
      setActionLoading(true);
      setActionError(null);
      await addSourceToCollection(collectionId, selectedSource._id);

      // Forcer le rechargement des collections pour mettre à jour le nombre de sources partout
      await loadCollections();

      setShowCollectionModal(false);
      setSelectedSource(null);
    } catch (err) {
      setActionError("Impossible d'ajouter la source à cette collection");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Créer une nouvelle collection
  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!selectedSource) return;

    if (!newCollectionName.trim()) {
      setActionError('Le nom de la collection est requis');
      return;
    }

    try {
      setActionLoading(true);
      setActionError(null);

      await createCollection({
        name: newCollectionName,
        description: '',
        sources: [selectedSource._id],
      });

      // Forcer le rechargement des collections pour mettre à jour l'interface
      await loadCollections();

      setShowCollectionModal(false);
      setSelectedSource(null);
      setNewCollectionName('');
    } catch (err) {
      setActionError('Impossible de créer la collection');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle pour afficher/masquer le catalogue
  const toggleCatalog = () => {
    setShowCatalog(!showCatalog);
  };

  if (loadingSources) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PremiumBanner
        className="mb-8"
        variant="coming"
        title="Vos infolettres ici plutôt que dans votre boîte mail !"
        description="Imaginez : toutes vos infolettres préférées, directement dans votre fil d'actualités, aux côtés de vos autres sources."
        linkText="En savoir plus sur l'intégration des infolettres"
      />

      <div className="relative mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Rechercher une source..."
          className="w-full p-2 border rounded-lg"
        />

        {showSuggestions && (
          <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg">
            {suggestions.map((source) => (
              <li
                key={source._id}
                onClick={() => handleSuggestionSelect(source)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <SimpleSourceItem source={source} />
              </li>
            ))}
          </ul>
        )}

        {showAddForm && (
          <AddSourceForm
            onSubmit={handleSubmit}
            onCancel={() => setShowAddForm(false)}
            formErrors={formErrors}
          />
        )}
      </div>
      {/* Section du catalogue de sources */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Catalogue de sources</h2>
          <button
            onClick={toggleCatalog}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showCatalog ? 'Masquer le catalogue' : 'Afficher le catalogue'}
          </button>
        </div>
        {showCatalog && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <SourceCatalog onAddToCollection={handleAddToCollection} userSources={userSources} />
          </div>
        )}
        {!showCatalog && (
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p className="text-gray-600">
              Découvrez de nouvelles sources à ajouter à votre flux d'actualités.
            </p>
          </div>
        )}
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Mes sources ({userSources?.length || 0})</h2>
        <div className="bg-white rounded-lg shadow-sm">
          {userSources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Vous n'avez pas encore de sources actives</p>
              <a href="/onboarding" className="text-primary hover:text-primary-dark underline">
                Ajouter des sources
              </a>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {userSources.map((source) => (
                <li key={source._id} className="p-4 hover:bg-gray-50">
                  <DeletableSourceItem
                    source={source}
                    onDelete={() => disableSource(source._id)}
                    onAddToCollection={() => handleAddToCollection(source)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Modal pour ajouter à une collection style Spotify */}
      {showCollectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Ajouter à une collection</h3>
              <button
                onClick={() => setShowCollectionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Formulaire de recherche et nouvelle collection */}
            <div className="p-4 border-b">
              {showNewCollectionForm ? (
                <form onSubmit={handleCreateCollection} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nom de la collection"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded"
                    required
                  />
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setShowNewCollectionForm(false)}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                      Créer
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowNewCollectionForm(true)}
                  className="w-full flex items-center p-3 text-left text-indigo-600 hover:bg-indigo-50 rounded-md"
                >
                  <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Nouvelle collection
                </button>
              )}
            </div>

            {/* Affichage d'erreur */}
            {actionError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border-b">{actionError}</div>
            )}

            {/* Info de débogage (temporaire) */}
            {debugInfo && (
              <div className="p-2 text-xs text-gray-500 bg-gray-50 border-b">
                <p>État: {debugInfo.user}</p>
                <p>Collections: {debugInfo.collectionsCount}</p>
                <p>Mise à jour: {debugInfo.timestamp}</p>
              </div>
            )}

            {/* Liste des collections */}
            <div className="max-h-60 overflow-y-auto">
              {loadingCollections || actionLoading ? (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : collections.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Vous n'avez pas encore de collections
                </div>
              ) : (
                <div className="divide-y">
                  {collections.map((collection) => {
                    const isSourceInCollection = collection.sources?.some(
                      (source) =>
                        selectedSource &&
                        (source._id === selectedSource._id || source === selectedSource._id)
                    );

                    return (
                      <div
                        key={collection._id}
                        className={`p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer ${
                          isSourceInCollection ? 'bg-green-50' : ''
                        }`}
                        onClick={() =>
                          !isSourceInCollection && handleAddToExistingCollection(collection._id)
                        }
                      >
                        <div className="flex items-center">
                          <div
                            className="w-10 h-10 rounded bg-gray-200 mr-3 flex items-center justify-center"
                            style={{
                              backgroundImage: collection.imageUrl
                                ? `url(${collection.imageUrl})`
                                : 'none',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          >
                            {!collection.imageUrl && (
                              <span className="text-gray-500 font-medium">
                                {collection.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{collection.name}</p>
                            <p className="text-xs text-gray-500">
                              {collection.sources?.length || 0} source
                              {collection.sources?.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        {isSourceInCollection && (
                          <span className="text-green-600 px-2 py-1 text-sm bg-green-100 rounded-full">
                            Ajouté
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sources;
