import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import CollectionDetails from './CollectionDetails';
import CollectionCard from './CollectionCard';
import { useCollections } from '../../hooks/useCollections';
import Modal from '../common/Modal';

/**
 * Composant pour afficher un catalogue de collections publiques
 * Inclut le comportement de consultation des détails et de suivi des collections
 */
const PublicCollectionsCatalog = ({
  isOpen,
  onClose,
  minSourcesRequired = 5,
  onFollowStatusChange,
}) => {
  const { user } = useContext(AuthContext);
  const {
    publicCollections,
    loading,
    error,
    followCollection,
    unfollowCollection,
    checkIfFollowing,
    loadPublicCollections,
  } = useCollections();
  const [publicCollectionsLoading, setPublicCollectionsLoading] = useState(false);
  const [publicCollectionsError, setPublicCollectionsError] = useState(null);
  const [followStatus, setFollowStatus] = useState({});
  const [followLoading, setFollowLoading] = useState({});
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Charger les collections publiques quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      fetchAndSetPublicCollections();
    }
  }, [isOpen]);

  // Fonction pour charger les collections publiques via le hook
  const fetchAndSetPublicCollections = async () => {
    try {
      setPublicCollectionsLoading(true);
      setPublicCollectionsError(null);
      await loadPublicCollections(minSourcesRequired);
    } catch (error) {
      setPublicCollectionsError(
        'Une erreur est survenue lors du chargement des collections publiques.'
      );
    } finally {
      setPublicCollectionsLoading(false);
    }
  };

  // Initialiser le statut de suivi pour chaque collection quand publicCollections change
  useEffect(() => {
    if (publicCollections && publicCollections.length > 0) {
      const initFollowStatus = async () => {
        const statusObj = {};
        for (const collection of publicCollections) {
          try {
            statusObj[collection._id] = await checkIfFollowing(collection._id);
          } catch {
            statusObj[collection._id] = false;
          }
        }
        setFollowStatus(statusObj);
      };
      initFollowStatus();
    }
  }, [publicCollections]);

  // Gérer le clic sur "Voir les détails"
  const handleViewDetails = (collection) => {
    setSelectedCollection(collection);
    setShowDetailModal(true);
  };

  // Gérer le suivi/non-suivi d'une collection
  const handleFollowToggle = async (collectionId) => {
    if (!user) return;
    setFollowLoading((prev) => ({ ...prev, [collectionId]: true }));
    try {
      if (followStatus[collectionId]) {
        await unfollowCollection(collectionId);
        setFollowStatus((prev) => ({ ...prev, [collectionId]: false }));
      } else {
        await followCollection(collectionId);
        setFollowStatus((prev) => ({ ...prev, [collectionId]: true }));
      }
      if (onFollowStatusChange) {
        onFollowStatusChange(collectionId, !followStatus[collectionId]);
      }
    } catch (error) {
      // Optionnel : gestion d'erreur
    } finally {
      setFollowLoading((prev) => ({ ...prev, [collectionId]: false }));
    }
  };

  // Gérer la fermeture de la modale de détails
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedCollection(null);
  };

  // Gérer le suivi depuis la modale de détails
  const handleFollowFromDetails = (collectionId, isFollowing) => {
    setFollowStatus((prev) => ({ ...prev, [collectionId]: isFollowing }));
    if (onFollowStatusChange) {
      onFollowStatusChange(collectionId, isFollowing);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm bg-white/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Collections publiques</h2>
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

        <div className="p-6">
          <div className="text-center relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-6 text-white shadow-lg">
            <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                Explorez et suivez des collections thématiques
              </h2>
              <p className="text-sm sm:text-base text-indigo-100">
                Découvrez des collections de sources créées par d'autres utilisateurs pour enrichir
                votre expérience.
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
                  Aucune collection publique avec au moins {minSourcesRequired} sources n'est
                  disponible pour le moment.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Les collections avec moins de {minSourcesRequired} sources ne sont pas affichées.
                </p>
              </div>
            )}

          {!publicCollectionsLoading && !publicCollectionsError && publicCollections.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publicCollections.map((collection) => (
                <CollectionCard
                  key={collection._id}
                  collectionId={collection._id}
                  collection={collection}
                  isFollowed={followStatus[collection._id]}
                  isLoading={followLoading[collection._id]}
                  onViewDetails={handleViewDetails}
                  onFollowToggle={() => handleFollowToggle(collection._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de détails d'une collection */}
      <Modal
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        title={selectedCollection?.name || 'Détail de la collection'}
        size="lg"
      >
        {selectedCollection && (
          <CollectionDetails
            collection={selectedCollection}
            isOwner={false}
            isFollowing={followStatus[selectedCollection._id]}
            followLoading={followLoading[selectedCollection._id]}
            onFollowToggle={handleFollowToggle}
            onBrowseArticles={handleCloseDetailModal}
            layoutType="compact"
          />
        )}
      </Modal>
    </div>
  );
};

export default PublicCollectionsCatalog;
