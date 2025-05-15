import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Composant de modale générique réutilisable avec gestion d'accessibilité
 * @param {Object} props - Propriétés du composant
 * @param {boolean} props.isOpen - Indique si la modale est ouverte
 * @param {function} props.onClose - Fonction appelée lors de la fermeture
 * @param {string} props.title - Titre de la modale
 * @param {React.ReactNode} props.children - Contenu de la modale
 * @param {string} props.size - Taille de la modale ('sm', 'md', 'lg', 'xl')
 * @param {boolean} props.showCloseButton - Si true, affiche le bouton de fermeture (par défaut: true)
 * @returns {JSX.Element} Composant de modale
 */
const Modal = ({ isOpen, onClose, title = '', children, size = 'md', showCloseButton = true }) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Gérer la fermeture avec la touche Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Gérer le focus quand la modale s'ouvre
  useEffect(() => {
    if (isOpen) {
      // Mettre le focus sur le bouton de fermeture ou la modale elle-même
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      } else if (modalRef.current) {
        modalRef.current.focus();
      }

      // Empêcher le scroll sur le body
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurer le scroll
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Définir la largeur de la modale en fonction de la taille
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

  // Empêcher la propagation des clics depuis la modale vers le backdrop
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-lg ${modalClass} w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-xl animate-fadeIn`}
        onClick={handleModalClick}
        tabIndex={-1}
      >
        <div className="flex justify-between items-center border-b p-3 sm:p-4">
          <h3 id="modal-title" className="text-base sm:text-lg font-semibold truncate">
            {title}
          </h3>
          {showCloseButton && (
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Fermer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          )}
        </div>
        <div className="overflow-y-auto p-3 sm:p-4 flex-grow">{children}</div>
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
