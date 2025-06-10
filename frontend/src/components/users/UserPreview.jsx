import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../common/Modal';
import Avatar from '../common/Avatar';
import { formatRelativeTime } from '../../utils/timeUtils';

/**
 * Composant pour afficher les détails d'un utilisateur dans une modal
 * @param {Object} props
 * @param {Object} props.user - Données de l'utilisateur
 * @param {boolean} props.isOpen - État d'ouverture de la modal
 * @param {Function} props.onClose - Fonction de fermeture de la modal
 * @param {boolean} props.showSavedArticles - Indique si les articles sauvegardés doivent être affichés
 * @param {boolean} props.loading - Indique si les données sont en cours de chargement
 * @param {node} props.children - Contenu supplémentaire à afficher
 */
const UserPreview = ({
  user,
  isOpen,
  onClose,
  showSavedArticles = true,
  loading = false,
  children,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profil utilisateur">
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : user ? (
          <>
            {/* En-tête du profil */}
            <div className="flex items-center space-x-4">
              <Avatar
                userId={user._id}
                size={64}
                avatarUrl={user.avatar}
                avatarType={user.avatarType}
                className="rounded-full"
              />
              <div>
                <h2 className="text-xl font-semibold">{user.username}</h2>
                <p className="text-gray-500">Membre depuis {formatRelativeTime(user.createdAt)}</p>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Bio</h3>
                <p className="text-gray-700">{user.bio}</p>
              </div>
            )}

            {/* Statistiques */}
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold">{user.collectionsCount || 0}</div>
                <div className="text-sm text-gray-500">Collections</div>
              </div>
              {showSavedArticles && (
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.savedArticlesCount || 0}</div>
                  <div className="text-sm text-gray-500">Articles sauvegardés</div>
                </div>
              )}
            </div>

            {/* Contenu supplémentaire (collections publiques) */}
            {children}
          </>
        ) : (
          <div className="text-center p-8 text-gray-500">
            Impossible de charger les données de l'utilisateur
          </div>
        )}
      </div>
    </Modal>
  );
};

UserPreview.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    avatarType: PropTypes.string,
    bio: PropTypes.string,
    createdAt: PropTypes.string,
    collectionsCount: PropTypes.number,
    savedArticlesCount: PropTypes.number,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  showSavedArticles: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.node,
};

export default UserPreview;
