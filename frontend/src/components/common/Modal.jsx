import React from 'react';
import PropTypes from 'prop-types';

/**
 * Composant Modal générique pour afficher des modales
 * @param {Object} props - Propriétés du composant
 * @param {boolean} props.isOpen - Indique si la modale est ouverte
 * @param {function} props.onClose - Fonction appelée lors de la fermeture
 * @param {string} props.title - Titre de la modale
 * @param {React.ReactNode} props.children - Contenu de la modale
 * @param {string} props.size - Taille de la modale ('sm', 'md', 'lg', 'xl')
 * @param {boolean} props.showCloseButton - Si true, affiche le bouton de fermeture (par défaut: true)
 * @returns {JSX.Element} Composant Modal
 */
const Modal = ({ isOpen, onClose, title = '', children, size = 'md', showCloseButton = true }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full',
  };

  const modalClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm bg-white/30 flex items-center justify-center p-4">
      <div className={`bg-white rounded-lg ${modalClass} w-full max-h-[90vh] overflow-y-auto`}>
        <div className="sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          {showCloseButton && (
            <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full']),
  showCloseButton: PropTypes.bool,
};

export default Modal;
