import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const Conclusion = ({ onValidationChange }) => {
  // Cette étape est toujours valide
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(true);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
          Félicitations !
        </h2>
      </div>

      {/* Carte de succès */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100 shadow-sm">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
          Votre compte est configuré
        </h3>
        <p className="text-gray-700 text-center mb-6">Bonne lecture !</p>
      </div>

      <div className="text-center pt-4">
        <p className="text-gray-500 text-sm">
          Cliquez sur "Terminer" pour accéder à votre tableau de bord.
        </p>
      </div>
    </div>
  );
};

Conclusion.propTypes = {
  onValidationChange: PropTypes.func,
};

export default Conclusion;
