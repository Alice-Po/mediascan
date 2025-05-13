import React from 'react';
import PropTypes from 'prop-types';
import { isLightColor, ORIENTATIONS, generateColorFromLabel } from '../../utils/colorUtils';

/**
 * Composant Badge réutilisable simplifié
 * Affiche un badge avec du texte et gère automatiquement toutes les propriétés visuelles
 * Calcule la couleur de fond à partir du texte et la couleur du texte pour un contraste optimal
 * @param {Object} props - Les propriétés du composant
 * @param {string|node} props.text - Le texte à afficher dans le badge (seule prop obligatoire)
 * @param {string} [props.size] - Taille du badge: 'sm', 'md' ou 'lg'
 * @param {string} [props.className] - Classes CSS additionnelles
 * @param {node} [props.icon] - Icône optionnelle à afficher avant le texte
 * @param {number} [props.opacity] - Opacité du fond (0 à 1)
 * @param {Function} [props.onRemove] - Fonction appelée lorsque l'utilisateur clique sur le bouton de suppression
 */
const Badge = ({ text, size = 'md', opacity = 1, className = '', icon, onRemove, ...props }) => {
  // Déterminer la couleur de fond à partir du texte
  let backgroundColor;

  // Recherche si le texte correspond à une orientation connue
  const orientationKey = Object.keys(ORIENTATIONS).find(
    (key) => ORIENTATIONS[key].label === text || key === text.toLowerCase()
  );

  if (orientationKey) {
    // Si c'est une orientation connue, utiliser sa couleur
    backgroundColor = ORIENTATIONS[orientationKey].color;
  } else {
    // Sinon générer une couleur à partir du texte
    backgroundColor = generateColorFromLabel(text);
  }

  // Déterminer la couleur du texte pour un contraste optimal
  const textColor = isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';

  // Appliquer l'opacité à la couleur de fond si nécessaire
  const backgroundColorWithOpacity =
    opacity < 1
      ? `${backgroundColor}${Math.round(opacity * 255)
          .toString(16)
          .padStart(2, '0')}`
      : backgroundColor;

  // Définir les classes en fonction de la taille
  const sizeClasses =
    {
      sm: 'px-1.5 py-0.5 text-xs',
      md: 'px-2 py-1 text-xs',
      lg: 'px-2.5 py-1.5 text-sm',
    }[size] || 'px-2 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses} ${className} ${
        onRemove ? 'pr-1' : ''
      }`}
      style={{
        backgroundColor: backgroundColorWithOpacity,
        color: textColor,
      }}
      {...props}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {text}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 flex-shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-opacity-25 hover:bg-gray-900 focus:outline-none"
          aria-label="Supprimer"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

Badge.propTypes = {
  /** Texte à afficher dans le badge (seule prop obligatoire) */
  text: PropTypes.node.isRequired,
  /** Taille du badge: 'sm', 'md' ou 'lg' */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Opacité du fond (0 à 1) */
  opacity: PropTypes.number,
  /** Classes CSS additionnelles */
  className: PropTypes.string,
  /** Icône optionnelle à afficher avant le texte */
  icon: PropTypes.node,
  /** Fonction appelée lorsque l'utilisateur clique sur le bouton de suppression */
  onRemove: PropTypes.func,
};

export default Badge;
