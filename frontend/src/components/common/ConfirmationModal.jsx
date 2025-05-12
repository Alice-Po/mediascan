import React from 'react';
import PropTypes from 'prop-types';

/**
 * Composant de modale de confirmation réutilisable
 * @param {Object} props - Propriétés du composant
 * @param {boolean} props.isOpen - Indique si la modale est ouverte
 * @param {function} props.onClose - Fonction appelée lors de l'annulation
 * @param {function} props.onConfirm - Fonction appelée lors de la confirmation
 * @param {string} props.title - Titre de la modale
 * @param {string} props.message - Message de confirmation
 * @param {string} props.itemName - Nom de l'élément concerné (optionnel)
 * @param {string} props.confirmButtonText - Texte du bouton de confirmation
 * @param {string} props.cancelButtonText - Texte du bouton d'annulation
 * @param {string} props.confirmButtonClass - Classes CSS pour le bouton de confirmation
 * @returns {JSX.Element} Composant de modale
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmer',
  message = 'Êtes-vous sûr de vouloir effectuer cette action ?',
  itemName = '',
  confirmButtonText = 'Confirmer',
  cancelButtonText = 'Annuler',
  confirmButtonClass = 'bg-red-600 text-white hover:bg-red-700',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="mb-6">
          {message} {itemName && <span className="font-semibold">{itemName}</span>}
          {message.endsWith('?') ? '' : '?'} Cette action est irréversible.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            {cancelButtonText}
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 rounded-md ${confirmButtonClass}`}>
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  itemName: PropTypes.string,
  confirmButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
  confirmButtonClass: PropTypes.string,
};

export default ConfirmationModal;
