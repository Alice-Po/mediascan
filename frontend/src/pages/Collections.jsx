import React, { useEffect, useContext, useState } from 'react';
import { CollectionsList } from '../components/collections';
import { useCollections } from '../hooks/useCollections';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import PublicCollectionModal from '../components/collections/PublicCollectionModal';
import {
  fetchPublicCollections,
  followCollection,
  unfollowCollection,
  checkIfFollowing,
} from '../api/collectionsApi';

const Collections = () => {
  const { user } = useContext(AuthContext);
  const { collections, loading, loadCollections } = useCollections(user);
  const [showPublicCollectionsModal, setShowPublicCollectionsModal] = useState(false);
  const [publicCollections, setPublicCollections] = useState([]);
  const [publicCollectionsLoading, setPublicCollectionsLoading] = useState(false);
  const [publicCollectionsError, setPublicCollectionsError] = useState(null);
  const [followStatus, setFollowStatus] = useState({});
  const [followLoading, setFollowLoading] = useState({});
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Nombre minimum de sources requises pour afficher une collection
  const MIN_SOURCES_REQUIRED = 5;

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  // Charger les collections publiques quand la modal est ouverte
  const handleOpenPublicCollections = async () => {
    setShowPublicCollectionsModal(true);
    await loadPublicCollections();
  };

  // Fermer la modal des collections publiques
  const handleClosePublicCollections = () => {
    setShowPublicCollectionsModal(false);
  };

  // Charger les collections publiques
  const loadPublicCollections = async () => {
    try {
      setPublicCollectionsLoading(true);
      setPublicCollectionsError(null);
      const collections = await fetchPublicCollections();

      // Filtrer pour ne garder que les collections avec au moins 5 sources
      const filteredCollections = collections.filter(
        (collection) => (collection.sources?.length || 0) >= MIN_SOURCES_REQUIRED
      );

      setPublicCollections(filteredCollections);

      // Vérifier le statut de suivi pour chaque collection filtrée
      const statusObj = {};
      for (const collection of filteredCollections) {
        try {
          const isFollowing = await checkIfFollowing(collection._id);
          statusObj[collection._id] = isFollowing;
        } catch (err) {
          console.error(
            `Erreur lors de la vérification du statut de suivi pour ${collection._id}:`,
            err
          );
          statusObj[collection._id] = false;
        }
      }
      setFollowStatus(statusObj);
    } catch (err) {
      console.error('Erreur lors du chargement des collections publiques:', err);
      setPublicCollectionsError('Impossible de charger les collections publiques.');
    } finally {
      setPublicCollectionsLoading(false);
    }
  };

  // Gérer le suivi d'une collection
  const handleFollowToggle = async (collectionId) => {
    try {
      setFollowLoading((prev) => ({ ...prev, [collectionId]: true }));

      if (followStatus[collectionId]) {
        // Si déjà suivi, désabonner
        await unfollowCollection(collectionId);
        setFollowStatus((prev) => ({ ...prev, [collectionId]: false }));
      } else {
        // Sinon, suivre
        await followCollection(collectionId);
        setFollowStatus((prev) => ({ ...prev, [collectionId]: true }));
        // Recharger les collections de l'utilisateur pour mettre à jour la liste
        loadCollections();
      }
    } catch (err) {
      console.error('Erreur lors du changement de statut de suivi:', err);
    } finally {
      setFollowLoading((prev) => ({ ...prev, [collectionId]: false }));
    }
  };

  // Gérer l'ouverture de la modale de détails
  const handleViewDetails = (collection) => {
    setSelectedCollection(collection);
    setShowDetailModal(true);
  };

  // Gérer le changement de statut de suivi depuis la modale de détails
  const handleFollowFromModal = (collectionId, isFollowing) => {
    setFollowStatus((prev) => ({ ...prev, [collectionId]: isFollowing }));
    // Recharger les collections de l'utilisateur si nécessaire
    if (isFollowing) {
      loadCollections();
    }
  };

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Mes collections</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleOpenPublicCollections}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            Explorer les collections publiques
          </button>
          <Link
            to="/collections/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Créer une collection
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : collections.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Vous n'avez pas encore de collections
          </h3>
          <p className="text-gray-600 mb-4">
            Les collections vous permettent d'organiser vos sources comme des playlists.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={handleOpenPublicCollections}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              Suivre des collections publiques
            </button>
            <Link
              to="/collections/new"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Créer ma première collection
            </Link>
          </div>
        </div>
      ) : (
        <CollectionsList collections={collections} />
      )}

      {/* Modal pour les collections publiques */}
      {showPublicCollectionsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm bg-white/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Collections publiques</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={handleClosePublicCollections}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="text-center relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-6 text-white shadow-lg">
                <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
                <div className="relative z-10">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">
                    Explorez et suivez des collections thématiques
                  </h2>
                  <p className="text-sm sm:text-base text-indigo-100">
                    Découvrez des collections de sources créées par d'autres utilisateurs pour
                    enrichir votre expérience.
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500 rounded-full opacity-50 blur-xl"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-500 rounded-full opacity-50 blur-xl"></div>
              </div>

              {publicCollectionsLoading && (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              )}

              {publicCollectionsError && (
                <div className="bg-red-50 p-4 rounded-md text-red-700 text-center">
                  {publicCollectionsError}
                </div>
              )}

              {!publicCollectionsLoading &&
                !publicCollectionsError &&
                publicCollections.length === 0 && (
                  <div className="bg-gray-50 p-6 rounded-md text-center">
                    <p className="text-gray-700">
                      Aucune collection publique avec au moins {MIN_SOURCES_REQUIRED} sources n'est
                      disponible pour le moment.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Les collections avec moins de {MIN_SOURCES_REQUIRED} sources ne sont pas
                      affichées.
                    </p>
                  </div>
                )}

              {!publicCollectionsLoading &&
                !publicCollectionsError &&
                publicCollections.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {publicCollections.map((collection) => (
                      <div
                        key={collection._id}
                        className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-center mb-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white mr-3"
                            style={{ backgroundColor: collection.colorHex || '#6366F1' }}
                          >
                            {collection.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg">{collection.name}</h4>
                            <div className="flex flex-wrap items-center text-sm text-gray-600">
                              <span>
                                Par {collection.createdBy?.username || 'Utilisateur anonyme'}
                              </span>
                              <span className="mx-2">•</span>
                              <span>{collection.sources?.length || 0} sources</span>
                            </div>
                          </div>
                        </div>

                        {collection.description && (
                          <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
                            <p className="text-gray-700 text-sm italic">
                              "{collection.description}"
                            </p>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-3">
                          <button
                            className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg text-sm font-medium transition-colors"
                            onClick={() => handleViewDetails(collection)}
                          >
                            Voir les détails
                          </button>
                          <button
                            className={`flex items-center justify-center sm:justify-start px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              followStatus[collection._id]
                                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                            }`}
                            onClick={() => handleFollowToggle(collection._id)}
                            disabled={followLoading[collection._id]}
                          >
                            {followLoading[collection._id] ? (
                              <span className="h-4 w-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin mr-1"></span>
                            ) : (
                              <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                {followStatus[collection._id] ? (
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                ) : (
                                  <path
                                    fillRule="evenodd"
                                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                    clipRule="evenodd"
                                  />
                                )}
                              </svg>
                            )}
                            {followStatus[collection._id] ? 'Suivi' : 'Suivre'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Modal pour les détails d'une collection */}
      {selectedCollection && showDetailModal && (
        <PublicCollectionModal
          collectionId={selectedCollection._id}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onFollow={handleFollowFromModal}
          followStatus={followStatus[selectedCollection._id]}
          isFollowLoading={followLoading[selectedCollection._id]}
        />
      )}
    </div>
  );
};

export default Collections;
