import React from 'react';
import { useSnackbar, SNACKBAR_TYPES } from '../../context/SnackbarContext';

const Snackbar = () => {
  const { snackbars, hideSnackbar } = useSnackbar();

  // Si aucune snackbar, ne rien afficher
  if (snackbars.length === 0) return null;

  // Fonction pour obtenir les classes CSS selon le type
  const getTypeClasses = (type) => {
    switch (type) {
      case SNACKBAR_TYPES.SUCCESS:
        return 'bg-green-500 text-white';
      case SNACKBAR_TYPES.ERROR:
        return 'bg-red-500 text-white';
      case SNACKBAR_TYPES.WARNING:
        return 'bg-yellow-500 text-white';
      case SNACKBAR_TYPES.INFO:
      default:
        return 'bg-blue-500 text-white';
    }
  };

  // Fonction pour obtenir l'icône selon le type
  const getIcon = (type) => {
    switch (type) {
      case SNACKBAR_TYPES.SUCCESS:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        );
      case SNACKBAR_TYPES.ERROR:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      case SNACKBAR_TYPES.WARNING:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case SNACKBAR_TYPES.INFO:
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col space-y-2">
      {snackbars.map((snackbar) => (
        <div
          key={snackbar.id}
          className={`flex items-center justify-between px-4 py-3 rounded-md shadow-lg max-w-md ${getTypeClasses(
            snackbar.type
          )} transition-all duration-300 ease-in-out`}
          style={{ minWidth: '300px' }}
        >
          <div className="flex items-center">
            <span className="mr-2">{getIcon(snackbar.type)}</span>
            <p className="text-sm font-medium">{snackbar.message}</p>
          </div>
          <button
            onClick={() => hideSnackbar(snackbar.id)}
            className="ml-4 text-white focus:outline-none"
            aria-label="Fermer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Snackbar;
