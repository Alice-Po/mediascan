import React, { useEffect } from 'react';

const Step1Introduction = ({ onValidationChange }) => {
  // L'introduction est toujours valide, informer le parent
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(true);
    }
  }, [onValidationChange]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
          On vous propose un petit tour d'horizon des fonctionnalités à venir
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Merci de votre intérêt pour Médiascan ! Nous sommes ravis de vous compter parmi nos
          premiers utilisateurs.
        </p>
      </div>

      {/* État d'avancement */}
      <div className="bg-blue-50 rounded-xl p-4 sm:p-6 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-3 text-base sm:text-lg">
          Où en sommes-nous aujourd'hui ?
        </h3>
        <p className="text-gray-700 mb-4">
          Médiascan est un projet en développement actif. Nous menons actuellement des tests
          utilisateurs et l'interface évolue très rapidement en fonction de vos retours. Nous vous
          remercions par avance pour votre indulgence face aux éventuels bugs ou fonctionnalités
          manquantes.
        </p>
        <p className="text-gray-900 mb-4">Merci de vos retours !</p>
      </div>

      {/* Annonce applications mobiles */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="text-indigo-600 shrink-0 mt-1">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2 text-base sm:text-lg">
              Applications mobiles en préparation
            </h3>
            <p className="text-gray-700 text-sm sm:text-base">
              Les versions Android et iOS de Médiascan seront bientôt disponibles sur les stores.
              Vous pourrez ainsi profiter de l'expérience Médiascan où que vous soyez !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour afficher l'état des fonctionnalités
const FeatureStatus = ({ title, items, color }) => (
  <div className={`bg-${color}-100 p-3 rounded-lg`}>
    <h4 className={`font-medium text-${color}-800 mb-2`}>{title}</h4>
    <ul className="space-y-1">
      {items.map((item, index) => (
        <li key={index} className={`text-sm text-${color}-700 flex items-center gap-2`}>
          <span>•</span> {item}
        </li>
      ))}
    </ul>
  </div>
);

// Composants utilitaires
const SourceType = ({ icon, title, description, color }) => (
  <div className={`bg-${color}-50 p-3 sm:p-4 rounded-lg hover:bg-${color}-100 transition-colors`}>
    <div className="flex items-start gap-3">
      <span role="img" aria-label={title.toLowerCase()} className="text-xl sm:text-2xl">
        {icon}
      </span>
      <div>
        <p className={`font-medium text-${color}-900 text-sm sm:text-base`}>{title}</p>
        <p className={`text-xs sm:text-sm text-${color}-700`}>{description}</p>
      </div>
    </div>
  </div>
);

const SocialMediaType = () => (
  <div className="bg-orange-50 p-3 sm:p-4 rounded-lg hover:bg-orange-100 transition-colors">
    <div className="flex items-start gap-3">
      <div className="flex gap-1 items-center">
        <span className="w-5 h-5 sm:w-6 sm:h-6">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-full h-full">
            <path
              fill="currentColor"
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            />
          </svg>
        </span>
      </div>
      <div>
        <p className="font-medium text-orange-900 text-sm sm:text-base">Réseaux sociaux</p>
        <p className="text-xs sm:text-sm text-orange-700">X, Bluesky, Mastodon...</p>
      </div>
    </div>
  </div>
);

const Step = ({ number, text }) => (
  <div className="flex items-center gap-3">
    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-medium text-sm sm:text-base">
      {number}
    </div>
    <p className="text-sm sm:text-base text-gray-700">{text}</p>
  </div>
);

export default Step1Introduction;
