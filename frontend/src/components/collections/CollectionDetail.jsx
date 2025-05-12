import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import ConfirmationModal from '../common/ConfirmationModal';
import { generateFollowersFromId } from '../../utils/colorUtils';

/**
 * Composant pour afficher le détail d'une collection
 */
const CollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    loadCollectionById,
    deleteCollection,
    currentCollection,
    removeSourceFromCollection,
    filterByCollection,
    loadingCollections,
  } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Charger les détails de la collection
  useEffect(() => {
    const fetchCollectionDetails = async () => {
      try {
        setLoading(true);
        await loadCollectionById(id);
      } catch (err) {
        setError('Impossible de charger les détails de la collection');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionDetails();
  }, [id, loadCollectionById]);

  // Gérer la suppression de la collection
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteCollection(id);
      navigate('/');
    } catch (err) {
      setError('Erreur lors de la suppression de la collection');
      console.error(err);
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };

  // Gérer le retrait d'une source de la collection
  const handleRemoveSource = async (sourceId) => {
    try {
      await removeSourceFromCollection(id, sourceId);
    } catch (err) {
      setError('Erreur lors du retrait de la source');
      console.error(err);
    }
  };

  // Gérer le clic sur "Voir les articles"
  const handleBrowseArticles = () => {
    filterByCollection(id);
    navigate('/');
  };

  if (loading || loadingCollections) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-md">
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
        >
          Retour
        </button>
      </div>
    );
  }

  if (!currentCollection) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Collection introuvable</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* En-tête de la collection */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <div
            className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden mr-4"
            style={{
              backgroundImage: currentCollection.imageUrl
                ? `url(${currentCollection.imageUrl})`
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: !currentCollection.imageUrl
                ? currentCollection.colorHex || 'none'
                : undefined,
            }}
          >
            {!currentCollection.imageUrl && (
              <span className="text-white text-xl">
                {currentCollection.name.substring(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{currentCollection.name}</h1>
            <div className="flex items-center mt-1">
              {currentCollection.isPublic ? (
                <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mr-2">
                  Public
                </span>
              ) : (
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full mr-2">
                  Privé
                </span>
              )}
              <span className="text-xs text-gray-500">{generateFollowersFromId(id)} suiveurs</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleBrowseArticles}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Voir les articles
          </button>
          {currentCollection.isPublic && (
            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Partager
            </button>
          )}
          <Link
            to={`/collections/edit/${id}`}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Modifier
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* Description */}
      {currentCollection.description && (
        <div className="mb-8 p-4 bg-gray-50 rounded-md">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">Description</h2>
          <p className="text-gray-700">{currentCollection.description}</p>
        </div>
      )}

      {/* Liste des sources */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Sources ({currentCollection.sources?.length || 0})
        </h2>

        {!currentCollection.sources || currentCollection.sources.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">Cette collection ne contient aucune source</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCollection.sources.map((source) => (
              <div
                key={source._id}
                className="p-4 border border-gray-200 rounded-md flex items-center"
              >
                <div
                  className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden mr-3 flex-shrink-0"
                  style={{
                    backgroundImage: source.faviconUrl ? `url(${source.faviconUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {!source.faviconUrl && (
                    <span className="text-gray-500 text-xs">
                      {source.name.substring(0, 1).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{source.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{source.url}</p>
                </div>
                <button
                  onClick={() => handleRemoveSource(source._id)}
                  className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                  title="Retirer de la collection"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modale de partage */}
      <ConfirmationModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onConfirm={() => setShowShareModal(false)}
        title="Partager la collection"
        message="Le système de partage de collections sera bientôt disponible ! Vous pourrez partager"
        itemName={currentCollection?.name}
        confirmButtonText="D'accord"
        cancelButtonText="Fermer"
        confirmButtonClass="bg-blue-600 text-white hover:bg-blue-700"
      />

      {/* Utilisation du composant ConfirmationModal pour suppression */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer la collection"
        itemName={currentCollection?.name}
        confirmButtonText="Supprimer"
        cancelButtonText="Annuler"
      />
    </div>
  );
};

export default CollectionDetail;
