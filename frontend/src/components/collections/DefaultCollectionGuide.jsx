import React, { useRef } from 'react';
import { StarIcon } from '../common/icons';

const DefaultCollectionGuide = ({ collectionId, onClose }) => {
  const guideRef = useRef(null);

  return (
    <div
      ref={guideRef}
      className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm animate-fade-in"
      style={{ animation: 'slideIn 0.5s ease-out' }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <StarIcon className="h-6 w-6 text-yellow-400" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Astuce : Définir une collection par défaut
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              aria-label="Fermer"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Vous pouvez définir cette collection comme votre collection par défaut. C'est celle que
            vous verrez en premier en arrivant sur votre tableau de bord !
          </p>
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-700">
              Pour cela, cliquez sur l'étoile{' '}
              <StarIcon className="h-4 w-4 inline text-yellow-400" /> à côté de votre collection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultCollectionGuide;

// Ajouter les styles d'animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
