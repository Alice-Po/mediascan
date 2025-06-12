import React from 'react';
import PropTypes from 'prop-types';

const getInitials = (siteName) => {
  if (!siteName) return '??';

  // Diviser le nom en mots
  const words = siteName.split(/[\s-]+/);

  if (words.length === 1) {
    // Pour un seul mot, prendre les deux premières lettres
    return words[0].substring(0, 2).toUpperCase();
  }

  // Pour plusieurs mots, prendre la première lettre des deux premiers mots
  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
};

const FaviconPlaceholder = ({ siteName, size = 16, className = '' }) => {
  const initials = getInitials(siteName);

  return (
    <div
      className={`
        flex items-center justify-center
        bg-gray-900 text-white
        rounded-full
        ${className}
      `}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${Math.max(size * 0.5, 8)}px`,
        lineHeight: 1,
      }}
    >
      <span className="font-medium">{initials}</span>
    </div>
  );
};

FaviconPlaceholder.propTypes = {
  siteName: PropTypes.string.isRequired,
  size: PropTypes.number,
  className: PropTypes.string,
};

export default FaviconPlaceholder;
