import React from 'react';
import PropTypes from 'prop-types';
import { CloseIcon } from '../common/icons';

const FeatureDetailModal = ({ isOpen, onClose, feature, detailComponent }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{feature.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Fermer"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-4">{detailComponent}</div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

FeatureDetailModal.propTypes = {
  /** Si la modale est ouverte */
  isOpen: PropTypes.bool.isRequired,
  /** Fonction appelée lors de la fermeture */
  onClose: PropTypes.func.isRequired,
  /** Informations sur la fonctionnalité */
  feature: PropTypes.object.isRequired,
  /** Composant à afficher dans la modale */
  detailComponent: PropTypes.node.isRequired,
};

export default FeatureDetailModal;
