import React from 'react';
import { generateColorFromId } from '../../utils/colorUtils';

/**
 * Composant réutilisable pour afficher l'avatar d'une collection
 *
 * @param {Object} collection - L'objet collection contenant les données (name, _id, colorHex, imageUrl)
 * @param {string} size - Taille de l'avatar: 'sm', 'md', 'lg', ou taille personnalisée
 * @param {string} className - Classes CSS additionnelles
 * @returns {JSX.Element} Composant d'avatar de collection
 */
const CollectionAvatar = ({
  collection,
  size = 'md', // sm, md, lg ou custom
  className = '',
}) => {
  // Vérification que l'objet collection est valide
  if (!collection || !collection.name) {
    return null;
  }

  // Déterminer la taille de l'avatar
  let sizeClasses = '';
  if (size === 'sm') {
    sizeClasses = 'w-8 h-8 text-xs';
  } else if (size === 'md') {
    sizeClasses = 'w-10 h-10 text-sm';
  } else if (size === 'lg') {
    sizeClasses = 'w-14 h-14 text-base';
  } else {
    // Taille personnalisée
    sizeClasses = size;
  }

  // Déterminer le fond de l'avatar
  const backgroundColor = collection.colorHex || generateColorFromId(collection._id || '');

  // Obtenir les initiales du nom de la collection (1 ou 2 caractères)
  const initials = collection.name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  return (
    <div
      className={`flex-shrink-0 flex items-center justify-center overflow-hidden mr-3 rounded-full ${sizeClasses} ${className}`}
      style={{
        backgroundColor: !collection.imageUrl ? backgroundColor : undefined,
        backgroundImage: collection.imageUrl ? `url(${collection.imageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {!collection.imageUrl && (
        <span className="text-white font-medium">
          {initials || collection.name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
};

export default CollectionAvatar;
