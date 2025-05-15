import React from 'react';
import { WarningIcon } from './icons';

/**
 * Composant de bannière d'avertissement réutilisable
 *
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.message - Le message à afficher dans la bannière
 * @param {string} props.bgColor - Couleur de fond (défaut: amber)
 * @param {string} props.textColor - Couleur du texte (défaut: amber)
 * @param {string} props.borderColor - Couleur de la bordure (défaut: amber)
 * @param {string} props.iconColor - Couleur de l'icône (défaut: amber)
 * @param {ReactNode} props.children - Contenu alternatif au message (optionnel)
 * @returns {JSX.Element} Bannière d'avertissement
 */
const WarningBanner = ({
  message,
  bgColor = 'amber',
  textColor = 'amber',
  borderColor = 'amber',
  iconColor = 'amber',
  children,
}) => {
  // Générer les classes CSS en fonction des couleurs
  const containerClasses = `bg-${bgColor}-50 p-4 rounded-md border border-${borderColor}-200`;
  const iconClasses = `w-5 h-5 text-${iconColor}-500 mt-0.5 mr-2`;
  const textClasses = `text-sm text-${textColor}-800`;

  return (
    <div className={containerClasses}>
      <div className="flex items-start">
        <WarningIcon className={iconClasses} />
        {message ? <p className={textClasses}>{message}</p> : children}
      </div>
    </div>
  );
};

export default WarningBanner;
