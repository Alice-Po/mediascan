import React, { useState, useEffect } from 'react';
import {
  fetchPublicCollections,
  followCollection,
  unfollowCollection,
  checkIfFollowing,
} from '../../../../api/collectionsApi';
import PublicCollectionModal from '../../../../components/collections/PublicCollectionModal';
import { generateFollowersFromId } from '../../../../utils/colorUtils';

const PublicCollections = ({ onValidationChange }) => {
  const [publicCollections, setPublicCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followStatus, setFollowStatus] = useState({});
  const [followLoading, setFollowLoading] = useState({});
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Vérifier si l'étape est valide (au moins une collection suivie)
  const hasFollowedCollections = () => {
    return Object.values(followStatus).some((status) => status === true);
  };

  useEffect(() => {
    // Informer le composant parent du changement de validation
    if (onValidationChange) {
      onValidationChange(hasFollowedCollections());
    }
  }, [followStatus, onValidationChange]);

  useEffect(() => {
    const loadPublicCollections = async () => {
      try {
        setIsLoading(true);
        const collections = await fetchPublicCollections();
        console.log('Collections publiques chargées:', collections);
        setPublicCollections(collections);

        // Vérifier le statut de suivi pour chaque collection
        const statusObj = {};
        for (const collection of collections) {
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
        setError('Impossible de charger les collections publiques.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPublicCollections();
  }, []);

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

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* En-tête avec animation */}
      <div className="text-center relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
            Bibliographies thématiques partagées
          </h2>
          <p className="text-sm sm:text-base text-indigo-100">
            Créer des collections de sources d'information sur n'importe quel sujet, comme vous le
            feriez avec une playlist musicale et partager les.{' '}
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            {/* <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-xs font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>En développement
            </span> */}
            {/* <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-xs font-medium">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1.5"></span>Finançable
            </span> */}
          </div>
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-500 rounded-full opacity-50 blur-xl"></div>
      </div>

      {/* Message d'instruction si aucune collection n'est suivie */}
      {!isLoading && !hasFollowedCollections() && (
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
              Pour continuer, veuillez suivre au moins une collection publique. Cliquez sur le
              bouton "Suivre" d'une collection qui vous intéresse.
            </p>
          </div>
        </div>
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

        {!isLoading && !error && publicCollections.length === 0 && (
          <div className="bg-gray-50 p-6 rounded-md text-center">
            <p className="text-gray-700">
              Aucune collection publique n'est disponible pour le moment.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Soyez le premier à créer et partager une collection !
            </p>
          </div>
        )}

        {!isLoading && !error && publicCollections.length > 0 && (
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
                      <span>Par {collection.createdBy?.username || 'Utilisateur anonyme'}</span>
                      <span className="mx-2">•</span>
                      <span>{collection.sources?.length || 0} sources</span>
                      <span className="mx-2">•</span>
                      <span>{generateFollowersFromId(collection._id)} suiveurs</span>
                    </div>
                  </div>
                </div>

                {collection.description && (
                  <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
                    <p className="text-gray-700 text-sm italic">"{collection.description}"</p>
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

      {/* Modale de détail de collection */}
      {selectedCollection && (
        <PublicCollectionModal
          collectionId={selectedCollection._id}
          isOpen={showModal}
          onClose={handleCloseModal}
          onFollow={handleFollowFromModal}
          followStatus={followStatus[selectedCollection._id]}
          isFollowLoading={followLoading[selectedCollection._id]}
        />
      )}
    </div>
  );
};

// Composant pour les caractéristiques
const Feature = ({ text }) => (
  <div className="flex items-center">
    <svg
      className="w-5 h-5 text-indigo-500 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span className="text-gray-700">{text}</span>
  </div>
);

// Composant pour les sources dans l'exemple
const SourceItem = ({ name, type }) => (
  <div className="flex items-center justify-between">
    <span className="font-medium text-gray-800">{name}</span>
    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{type}</span>
  </div>
);

// Composant pour les cartes de fonctionnalités
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-4 rounded-lg border border-blue-100 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
    <div className="text-blue-600 shrink-0 mt-0.5 bg-blue-50 p-2 rounded-lg">{icon}</div>
    <div>
      <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  </div>
);

// Composant pour les exemples de bibliographies
const BibliographyExample = ({ title, color, count, author }) => (
  <div
    className={`bg-white p-4 rounded-lg shadow-sm border border-${color}-100 hover:shadow-md transition-shadow`}
  >
    <div
      className={`w-8 h-8 bg-${color}-100 rounded-full flex items-center justify-center text-${color}-600 mb-3`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        ></path>
      </svg>
    </div>
    <h4 className={`font-medium text-${color}-900 mb-1`}>{title}</h4>
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500">{count} sources</span>
      <span className="text-xs font-medium text-gray-700">Par {author}</span>
    </div>
  </div>
);

// Composant pour les options de financement
const FundingOption = ({ amount, title, description, highlighted = false }) => (
  <div
    className={`rounded-lg p-4 ${
      highlighted
        ? 'bg-white text-indigo-900 shadow-lg transform scale-105'
        : 'bg-white/20 text-white'
    }`}
  >
    <div className="text-center mb-2">
      <span className={`text-2xl font-bold ${highlighted ? 'text-indigo-600' : ''}`}>{amount}</span>
    </div>
    <h4 className="font-medium text-center mb-2">{title}</h4>
    <p className={`text-sm text-center ${highlighted ? 'text-gray-700' : 'text-indigo-100'}`}>
      {description}
    </p>
  </div>
);

export default PublicCollections;
