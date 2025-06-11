import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Avatar from '../common/Avatar';
import UserPreview from './UserPreview';
import CollectionItem from '../collections/CollectionItem';
import CollectionDetails from '../collections/CollectionDetails';
import Modal from '../common/Modal';
import { fetchUserPublicCollections } from '../../api/collectionsApi';
import { formatRelativeTime } from '../../utils/timeUtils';

/**
 * Composant pour afficher un utilisateur avec son avatar et gérer l'affichage du preview
 * @param {Object} props
 * @param {string} props.userId - ID de l'utilisateur
 * @param {string} props.userName - Nom de l'utilisateur (optionnel, pour affichage initial)
 * @param {string} props.avatarUrl - URL de l'avatar (optionnel, pour affichage initial)
 * @param {string} props.avatarType - Type de l'avatar (optionnel)
 * @param {string} [props.className] - Classes CSS additionnelles
 */
const UserItem = ({ userId, userName, avatarUrl, avatarType, className = '' }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);

  // Charger les collections publiques quand on ouvre le preview
  useEffect(() => {
    const loadCollections = async () => {
      if (showPreview) {
        try {
          setLoading(true);
          const userCollections = await fetchUserPublicCollections(userId);
          setCollections(userCollections);
        } catch (err) {
          console.error('Erreur lors du chargement des collections:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };
    loadCollections();
  }, [showPreview, userId]);

  const handleClick = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleCollectionClick = (collection) => {
    setSelectedCollection(collection);
    setShowCollectionModal(true);
  };

  // Les informations de l'utilisateur viennent de la première collection
  const userInfo = collections[0]?.createdBy || {};

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center group hover:bg-gray-50 rounded-full px-2 py-1 transition-colors ${className}`}
      >
        <Avatar
          userId={userId}
          size={20}
          className="mr-2"
          avatarUrl={avatarUrl || userInfo.avatar}
          avatarType={avatarType || userInfo.avatarType}
        />
        <span className="text-sm text-gray-500 group-hover:text-gray-700">
          {userName || userInfo.username || 'Utilisateur anonyme'}
        </span>
      </button>

      <UserPreview
        user={{
          ...userInfo,
          _id: userId,
          username: userName || userInfo.username,
          avatar: avatarUrl || userInfo.avatar,
          avatarType: avatarType || userInfo.avatarType,
        }}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        loading={loading}
        showSavedArticles={true}
      >
        {collections.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Collections publiques</h3>
            <div className="space-y-2">
              {collections.map((collection) => (
                <CollectionItem
                  key={collection._id}
                  collection={collection}
                  currentUserId={userId}
                  showActionButtons={true}
                  actionConfig={{ view: true, edit: false, delete: false, share: true }}
                  onClick={() => handleCollectionClick(collection)}
                />
              ))}
            </div>
          </div>
        )}
      </UserPreview>

      {/* Modal pour les détails de la collection */}
      <Modal
        isOpen={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
        title="Détails de la collection"
        size="xl"
      >
        {selectedCollection && (
          <CollectionDetails
            collection={{
              ...selectedCollection,
              createdBy: {
                ...selectedCollection.createdBy,
                username:
                  userName || selectedCollection.createdBy?.username || 'Utilisateur anonyme',
              },
            }}
            isOwner={false}
            layoutType="compact"
          />
        )}
      </Modal>
    </>
  );
};

UserItem.propTypes = {
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string,
  avatarUrl: PropTypes.string,
  avatarType: PropTypes.string,
  className: PropTypes.string,
};

export default UserItem;
