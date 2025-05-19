import React, { useEffect } from 'react';
import { MobileIcon } from '../../../../components/common/icons';

const Step1Introduction = ({ onValidationChange }) => {
  // L'introduction est toujours valide, informer le parent
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(true);
    }
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
          On vous propose un petit tour d'horizon pour commencer la configuration de votre premier
          fils d'actualité
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Tout d'abord, un grand <strong>MERCI</strong> à vous de faire partie de nos premiers
          utilisateurs test :)
        </p>
      </div>

      {/* État d'avancement */}
      <div className="bg-blue-50 rounded-xl p-4 sm:p-6 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-3 text-base sm:text-lg">
          Où en sommes-nous aujourd'hui ?
        </h3>
        <p className="text-gray-700 mb-4">
          Médiascan est un projet en développement actif. Nous sommes actuellement dans une phase
          d'allers retours avec de nombreux tests à la fois techniques et fonctionnels. Le projet et
          son interface évoluent trés rapidement. Nous vous remercions par avance pour votre
          indulgence face aux éventuels bugs ou fonctionnalités manquantes.
        </p>
        <p className="text-gray-900 mb-4">
          <strong>Tous vos retours sont les bienvenus !</strong>
        </p>
      </div>

      {/* Annonce applications mobiles */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="text-indigo-600 shrink-0 mt-1">
            <MobileIcon />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2 text-base sm:text-lg">
              Applications mobiles en préparation
            </h3>
            <p className="text-gray-700 text-sm sm:text-base mb-4">
              Les versions Android et iOS de Médiascan seront bientôt disponibles sur les stores.
            </p>
            <div className="flex items-center gap-4">
              <img
                src="/App-Store-Logo-2013-2017.png"
                alt="Apple App Store"
                className="h-10 object-contain"
              />
              <img
                src="/AND2020082101.png"
                alt="Google Play Store"
                className="h-10 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1Introduction;
