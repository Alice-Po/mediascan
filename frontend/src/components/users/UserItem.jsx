import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Avatar from '../common/Avatar';
import UserPreview from './UserPreview';
import { useUser } from '../../hooks/useUser';

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
  const [publicCollections, setPublicCollections] = useState([]);
  const { user, loading, error, loadUserDetails, loadUserPublicCollections } = useUser(userId);

  // Charger les détails utilisateur quand on ouvre le preview
  useEffect(() => {
    if (showPreview) {
      loadUserDetails();
    }
  }, [showPreview, loadUserDetails]);

  // Charger les collections publiques quand on ouvre le preview
  useEffect(() => {
    const loadCollections = async () => {
      if (showPreview && user) {
        const collections = await loadUserPublicCollections();
        setPublicCollections(collections);
      }
    };
    loadCollections();
  }, [showPreview, user, loadUserPublicCollections]);

  const handleClick = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  // Utiliser les données initiales si disponibles, sinon utiliser les données chargées
  const displayName = userName || user?.username || 'Utilisateur anonyme';
  const displayAvatarUrl = avatarUrl || user?.avatar;
  const displayAvatarType = avatarType || user?.avatarType;

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
          avatarUrl={displayAvatarUrl}
          avatarType={displayAvatarType}
        />
        <span className="text-sm text-gray-500 group-hover:text-gray-700">{displayName}</span>
      </button>

      <UserPreview
        user={user}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        loading={loading}
        showSavedArticles={true}
      >
        {publicCollections.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Collections publiques</h3>
            <div className="space-y-2">
              {publicCollections.map((collection) => (
                <div key={collection._id} className="p-2 bg-gray-50 rounded-lg text-sm">
                  {collection.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </UserPreview>
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
