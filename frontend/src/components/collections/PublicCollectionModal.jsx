import React, { useState, useEffect } from 'react';
import {
  followCollection,
  unfollowCollection,
  checkIfFollowing,
  fetchCollectionById,
} from '../../api/collectionsApi';
import { generateFollowersFromId } from '../../utils/colorUtils';
import SimpleSourceItem from '../sources/SourceItem';
import SourceDetailsModal from '../sources/SourceDetailsModal';

/**
 * Composant modal pour afficher le détail d'une collection publique
 */
const PublicCollectionModal = ({
  collectionId,
  isOpen,
  onClose,
  onFollow,
  followStatus,
  isFollowLoading,
}) => {
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(followStatus || false);
  const [followLoading, setFollowLoading] = useState(isFollowLoading || false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [showSourceModal, setShowSourceModal] = useState(false);

  // Charger les détails de la collection
  useEffect(() => {
    const fetchCollectionDetails = async () => {
      if (!collectionId || !isOpen) return;

      try {
        setLoading(true);
        const data = await fetchCollectionById(collectionId);
        console.log('Détails de la collection:', data);
        setCollection(data);

        // Vérifier si l'utilisateur suit déjà cette collection si status non fourni
        if (followStatus === undefined) {
          try {
            const isFollowingStatus = await checkIfFollowing(collectionId);
            setIsFollowing(isFollowingStatus);
          } catch (err) {
            console.error('Erreur lors de la vérification du statut de suivi:', err);
          }
        }
      } catch (err) {
        setError('Impossible de charger les détails de la collection');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionDetails();
  }, [collectionId, isOpen, followStatus]);

  // Gérer le suivi d'une collection
  const handleFollowToggle = async () => {
    if (!collection) return;

    try {
      setFollowLoading(true);

      if (isFollowing) {
        // Si déjà suivi, désabonner
        await unfollowCollection(collection._id);
        setIsFollowing(false);
      } else {
        // Sinon, suivre
        await followCollection(collection._id);
        setIsFollowing(true);
      }

      // Informer le composant parent du changement
      if (onFollow) {
        onFollow(collection._id, !isFollowing);
      }
    } catch (err) {
      console.error('Erreur lors du changement de statut de suivi:', err);
      // Gérer l'erreur
    } finally {
      setFollowLoading(false);
    }
  };

  // Gérer le clic sur une source pour voir ses détails
  const handleSourceClick = (source) => {
    setSelectedSource(source);
    setShowSourceModal(true);
  };

  // Fermer la modale de détails de la source
  const handleCloseSourceModal = () => {
    setShowSourceModal(false);
    setSelectedSource(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm bg-white/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Détails de la collection</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
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

        <div className="p-4">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && collection && (
            <>
              {/* En-tête de la collection - Version mobile d'abord */}
              <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center text-white mr-4"
                    style={{ backgroundColor: collection.colorHex || '#6366F1' }}
                  >
                    <span className="text-xl font-bold">
                      {collection.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-bold">{collection.name}</h1>
                    <div className="flex flex-wrap items-center mt-1">
                      <span className="text-sm text-gray-500">
                        Par{' '}
                        {collection.createdBy?.username ||
                          collection.userId?.username ||
                          'Utilisateur anonyme'}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="text-sm text-gray-500">
                        {collection.sources?.length || 0} sources
                      </span>
                      <span className="mx-2">•</span>
                      <span className="text-sm text-gray-500">
                        {generateFollowersFromId(collection._id)} suiveurs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bouton Suivre/Suivi adapté au mobile */}
                <div className="w-full sm:w-auto mt-2 sm:mt-0">
                  <button
                    className={`w-full sm:w-auto flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isFollowing
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                    }`}
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                  >
                    {followLoading ? (
                      <span className="h-4 w-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin mr-1"></span>
                    ) : (
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        {isFollowing ? (
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
                    {isFollowing ? 'Suivi' : 'Suivre'}
                  </button>
                </div>
              </div>

              {/* Description */}
              {collection.description && (
                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                  <h2 className="text-sm font-semibold text-gray-500 mb-2">Description</h2>
                  <p className="text-gray-700">{collection.description}</p>
                </div>
              )}

              {/* Liste des sources */}
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Sources ({collection.sources?.length || 0})
                </h2>

                {!collection.sources || collection.sources.length === 0 ? (
                  <div className="text-center p-6 bg-gray-50 rounded-md">
                    <p className="text-gray-500">Cette collection ne contient aucune source</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {collection.sources.map((source) => (
                      <div key={source._id} onClick={() => handleSourceClick(source)}>
                        <SimpleSourceItem source={source} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end space-x-2 pt-4 border-t">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Fermer
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de détails de la source */}
      {selectedSource && (
        <SourceDetailsModal
          isOpen={showSourceModal}
          onClose={handleCloseSourceModal}
          source={selectedSource}
        />
      )}
    </div>
  );
};

export default PublicCollectionModal;
