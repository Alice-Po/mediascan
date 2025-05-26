import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useCollections } from '../../../../hooks/useCollections';
import CollectionCard from '../../../../components/collections/CollectionCard';
import WarningBanner from '../../../../components/common/WarningBanner';
import Modal from '../../../../components/common/Modal';
import CollectionDetails from '../../../../components/collections/CollectionDetails';

const OnboardingPublicCollections = ({ onValidationChange, user }) => {
  const {
    publicCollections,
    loading: isLoading,
    error,
    followCollection,
    unfollowCollection,
    checkIfFollowing,
    loadPublicCollections,
  } = useCollections(user);

  useEffect(() => {
    loadPublicCollections();
  }, [loadPublicCollections]);

  const [followStatus, setFollowStatus] = useState({});
  const [followLoading, setFollowLoading] = useState({});
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const lastValidationValue = useRef(false);

  // Nombre minimum de sources requises pour afficher une collection
  const MIN_SOURCES_REQUIRED = 5;

  // Vérifier si l'étape est valide (au moins une collection suivie)
  const hasFollowedCollections = useCallback(() => {
    const hasFollowed = Object.values(followStatus).some((status) => status === true);

    return hasFollowed;
  }, [followStatus]);

  // Informer le composant parent quand le statut de validation change
  useEffect(() => {
    if (onValidationChange) {
      const isCurrentlyValid = hasFollowedCollections();

      // Seulement mettre à jour si la valeur a changé
      if (isCurrentlyValid !== lastValidationValue.current) {
        lastValidationValue.current = isCurrentlyValid;
        onValidationChange(isCurrentlyValid);
      }
    }
  }, [onValidationChange, hasFollowedCollections]);

  useEffect(() => {
    const loadFollowStatus = async () => {
      if (!publicCollections.length) {
        console.log('[OnboardingPublicCollections] Aucune collection publique disponible');
        return;
      }

      // Vérifier le statut de suivi pour chaque collection filtrée
      const statusObj = {};
      for (const collection of publicCollections) {
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
    };

    loadFollowStatus();
  }, [publicCollections, checkIfFollowing]);

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
      }
    } catch (err) {
      console.error('Erreur lors du changement de statut de suivi:', err);
      // Afficher une notification d'erreur si nécessaire
    } finally {
      setFollowLoading((prev) => ({ ...prev, [collectionId]: false }));
    }
  };

  // Gérer l'ouverture de la modale de détails
  const handleViewDetails = (collection) => {
    setSelectedCollection(collection);
    setShowModal(true);
  };

  // Fermer la modale
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Gérer le changement de statut de suivi depuis la modale
  const handleFollowFromModal = (collectionId, isFollowing) => {
    setFollowStatus((prev) => ({ ...prev, [collectionId]: isFollowing }));
  };

  // Filtrer les collections avec au moins 5 sources
  const filteredCollections = publicCollections.filter(
    (collection) => (collection.sources?.length || 0) >= MIN_SOURCES_REQUIRED
  );

  return (
    <div className="space-y-6 sm:space-y-8" id="public-collections-container">
      {/* En-tête avec animation */}
      <div className="text-center relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
            Collections de sources thématiques partagées
          </h2>
          <p className="text-sm sm:text-base text-indigo-100">
            Créer des collections de sources d'information sur n'importe quel sujet, comme vous le
            feriez avec une playlist musicale et partager les.{' '}
          </p>
          <div className="mt-4 flex justify-center space-x-2"></div>
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-500 rounded-full opacity-50 blur-xl"></div>
      </div>

      {/* Message d'instruction si aucune collection n'est suivie */}
      {!isLoading && !hasFollowedCollections() && (
        <WarningBanner message='Pour continuer, veuillez suivre au moins une collection publique. Cliquez sur le bouton "Suivre" d&apos;une collection qui vous intéresse.' />
      )}

      {/* Collections populaires disponibles */}
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg text-center">
          Commencer à suivre une collection publique
        </h3>

        {isLoading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {error && <div className="bg-red-50 p-4 rounded-md text-red-700 text-center">{error}</div>}

        {!isLoading && !error && filteredCollections.length === 0 && (
          <div className="bg-gray-50 p-6 rounded-md text-center">
            <p className="text-gray-700">
              Aucune collection publique avec au moins {MIN_SOURCES_REQUIRED} sources n'est
              disponible pour le moment.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Les collections avec moins de {MIN_SOURCES_REQUIRED} sources ne sont pas affichées.
            </p>
          </div>
        )}

        {!isLoading && !error && filteredCollections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCollections.map((collection) => (
              <CollectionCard
                key={collection._id}
                collection={collection}
                isFollowed={followStatus[collection._id]}
                isLoading={followLoading[collection._id]}
                onFollowToggle={handleFollowToggle}
                onViewDetails={handleViewDetails}
                showFull={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modale de détail de collection */}
      {selectedCollection && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title="Détails de la collection"
          size="3xl"
        >
          <CollectionDetails
            collection={selectedCollection}
            isOwner={false}
            isFollowing={followStatus[selectedCollection._id]}
            followLoading={followLoading[selectedCollection._id]}
            onFollowToggle={handleFollowToggle}
            onBrowseArticles={handleCloseModal}
            withSourcesList={true}
            isOnboarding={true}
          />
        </Modal>
      )}
    </div>
  );
};

export default OnboardingPublicCollections;
