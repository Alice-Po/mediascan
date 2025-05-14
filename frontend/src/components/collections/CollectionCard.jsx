import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CollectionDetailsModal from './CollectionDetailsModal';

/**
 * Composant pour afficher une carte de collection publique
 *
 * @param {Object} collection - Objet de la collection à afficher
 * @param {boolean} isFollowed - État de suivi de la collection
 * @param {boolean} isLoading - État de chargement du suivi
 * @param {Function} onViewDetails - Fonction appelée pour voir les détails (si fournie, plutôt que d'ouvrir la modal)
 * @param {Function} onFollowToggle - Fonction appelée pour suivre/désabonner
 */
const CollectionCard = ({
  collection,
  isFollowed = false,
  isLoading = false,
  onViewDetails,
  onFollowToggle,
}) => {
  const navigate = useNavigate();
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Éviter les erreurs si l'objet collection est incomplet
  if (!collection || !collection._id) {
    return null;
  }

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(collection);
    } else {
      // Si aucune fonction onViewDetails n'est fournie, naviguer vers la page détaillée
      navigate(`/collections/${collection._id}`);
    }
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
        {/* En-tête de la carte avec avatar et infos de base */}
        <div className="flex items-center mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white mr-3"
            style={{ backgroundColor: collection.colorHex || '#6366F1' }}
          >
            {collection.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-lg line-clamp-1" title={collection.name}>
              {collection.name}
            </h4>
            <div className="flex flex-wrap items-center text-sm text-gray-600">
              <span className="line-clamp-1">
                Par {collection.createdBy?.username || 'Utilisateur anonyme'}
              </span>
              <span className="mx-2">•</span>
              <span>{collection.sources?.length || 0} sources</span>
            </div>
          </div>
        </div>

        {/* Description (si disponible) */}
        {collection.description && (
          <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
            <p className="text-gray-700 text-sm italic line-clamp-2" title={collection.description}>
              "{collection.description}"
            </p>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-3">
          <button
            className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg text-sm font-medium transition-colors"
            onClick={handleViewDetails}
          >
            Voir les détails
          </button>
          <button
            className={`flex items-center justify-center sm:justify-start px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isFollowed
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
            }`}
            onClick={() => onFollowToggle && onFollowToggle(collection._id)}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="h-4 w-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin mr-1"></span>
            ) : (
              <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                {isFollowed ? (
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
            {isFollowed ? 'Suivi' : 'Suivre'}
          </button>
        </div>
      </div>
    </>
  );
};

export default CollectionCard;
