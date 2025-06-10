import React, { useState } from 'react';
import { UserIcon } from './icons';

/**
 * Composant Avatar réutilisable
 * @param {string} userId - L'ID de l'utilisateur
 * @param {string} [className] - Classes CSS optionnelles
 * @param {number} [size] - Taille en pixels (par défaut 48)
 * @param {string|number} [cacheBust] - Paramètre pour forcer le rafraîchissement de l'image
 * @param {string} [avatarUrl] - URL directe de l'avatar (pour les placeholders)
 * @param {string} [avatarType] - Type d'avatar ('buffer' ou 'url')
 */
const Avatar = ({
  userId,
  className = '',
  size = 48,
  cacheBust,
  avatarUrl,
  avatarType,
  ...props
}) => {
  const [error, setError] = useState(false);

  // Si on a une URL directe et le type est 'url', on l'utilise
  const src =
    avatarUrl && avatarType === 'url'
      ? avatarUrl
      : userId
      ? `/api/auth/user/${userId}/avatar${cacheBust ? `?t=${cacheBust}` : ''}`
      : undefined;

  if (!src || error) {
    return (
      <span
        className={`inline-block rounded-full bg-gray-200 ${className}`}
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Avatar utilisateur"
      >
        <UserIcon className={`w-full h-full text-gray-400`} />
      </span>
    );
  }

  return (
    <img
      src={src}
      alt="Avatar utilisateur"
      className={`rounded-full object-cover bg-gray-200 ${className}`}
      style={{ width: size, height: size }}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default Avatar;
