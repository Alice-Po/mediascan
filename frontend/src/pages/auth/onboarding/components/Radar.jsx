import React, { useEffect } from 'react';

const Step3Radar = ({ onValidationChange }) => {
  // Cette étape est toujours valide, informer le parent
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(true);
    }
  }, [onValidationChange]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* En-tête avec animation */}
      <div className="text-center relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
            Radar de veille intelligent
          </h2>
          <p className="text-sm sm:text-base text-blue-100">
            Découvrez les contenus pertinents que vous auriez pu manquer
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-xs font-medium">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1.5"></span>Finançable
            </span>
          </div>
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-cyan-500 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500 rounded-full opacity-50 blur-xl"></div>
      </div>

      {/* Présentation du concept */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg">
          Découvrez de nouvelles sources grâce au Radar
        </h3>
        <p className="text-gray-700 mb-6">
          Au lieu d'utiliser des mots-clés, exprimez naturellement ce qui vous intéresse. Le Radar
          explore ensuite l'ensemble du web, même au-delà de vos sources habituelles, pour vous
          faire découvrir des contenus pertinents.
        </p>
      </div>

      {/* Exemple concret */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50">
          <h3 className="font-semibold text-gray-900 text-lg mb-4">Comment ça marche ?</h3>
          {/* Exemple de recherche */}
          <div className="w-full">
            <p className="text-gray-700 mb-6">Par exemple, dites simplement :</p>
            <div className="bg-white rounded-lg p-3 mb-4 border-2 border-emerald-100">
              <p className="text-xs sm:text-sm text-gray-600 italic">
                "Je veux suivre les expérimentations de culture du bambou en France"
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2669&auto=format&fit=crop"
                alt="Champ expérimental de bambou"
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3 bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                Nouveau • via votre radar
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 text-base sm:text-lg mb-1">
                    La ferme du Bec-Hellouin lance un espace test pour la culture du bambou
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">Ouest-France • Il y a 2 heures</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                La célèbre ferme biologique normande inaugure un nouvel espace dédié à
                l'expérimentation de la culture du bambou. Ce projet innovant vise à étudier
                l'adaptation de différentes variétés de bambou au climat normand et leur potentiel
                pour la construction durable.
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <LocationIcon />
                  Le Bec-Hellouin, Normandie
                </span>
                <span>•</span>
                <span className="text-emerald-600">Correspond à votre recherche sur le bambou</span>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <div className="flex space-x-2">
                  <button className="text-gray-500 hover:text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      ></path>
                    </svg>
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      ></path>
                    </svg>
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      ></path>
                    </svg>
                  </button>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Lire l'article complet
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700 flex items-start gap-2">
            <svg
              className="w-5 h-5 text-blue-500 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p>
              <span className="font-medium">Pour les curieux :</span> Cette fonctionnalité utilisera
              une base de données vectorielle pour effectuer des recherches sémantiques avancées
              dans le contenu de Médiascan. Les spécifications techniques précises sont encore en
              cours d'élaboration.
            </p>
          </div>
        </div>
      </div>

      {/* Financement */}
      {/* <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-6 text-white shadow-lg">
        <h3 className="font-semibold text-center mb-6 text-lg">
          Contribuez au développement de cette fonctionnalité
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <FundingOption
            amount="10€"
            title="Soutien initial"
            description="Accès anticipé à la fonctionnalité"
          />
          <FundingOption
            amount="30€"
            title="Soutien premium"
            description="Accès anticipé + 3 mois d'utilisation gratuite"
            highlighted={true}
          />
          <FundingOption
            amount="50€"
            title="Soutien VIP"
            description="Accès anticipé + 6 mois d'utilisation gratuite"
          />
        </div>

        <div className="text-center">
          <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium shadow-sm transition-colors">
            Contribuer au financement
          </button>
        </div>
      </div>*/}
    </div>
  );
};

// Composant pour les cartes de fonctionnalités
const FeatureCard = ({ icon, title, description, color }) => (
  <div className={`bg-${color}-50 p-4 rounded-lg`}>
    <div className="flex items-start gap-3">
      <span role="img" aria-label={title.toLowerCase()} className="text-xl sm:text-2xl shrink-0">
        {icon}
      </span>
      <div>
        <p className={`font-medium text-${color}-900 text-sm sm:text-base`}>{title}</p>
        <p className={`text-xs sm:text-sm text-${color}-700`}>{description}</p>
      </div>
    </div>
  </div>
);

// Composant pour les étapes du processus
const ProcessStep = ({ number, title, description, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
    <div className="flex items-center mb-3">
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
        <span className="font-medium">{number}</span>
      </div>
      <h4 className="font-medium text-gray-900">{title}</h4>
    </div>
    <div className="pl-11">
      <p className="text-sm text-gray-700 mb-3">{description}</p>
      <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center text-blue-600">
        {icon}
      </div>
    </div>
  </div>
);

// Composant pour les cartes de bénéfices
const BenefitCard = ({ title, description, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-3">
      <div className="text-blue-600 shrink-0 mt-0.5 bg-blue-50 p-2 rounded-lg">{icon}</div>
      <div>
        <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-700">{description}</p>
      </div>
    </div>
  </div>
);

// Composant pour les options de financement
const FundingOption = ({ amount, title, description, highlighted = false }) => (
  <div
    className={`rounded-lg p-4 ${
      highlighted
        ? 'bg-white text-blue-900 shadow-lg transform scale-105'
        : 'bg-white/20 text-white'
    }`}
  >
    <div className="text-center mb-2">
      <span className={`text-2xl font-bold ${highlighted ? 'text-blue-600' : ''}`}>{amount}</span>
    </div>
    <h4 className="font-medium text-center mb-2">{title}</h4>
    <p className={`text-sm text-center ${highlighted ? 'text-gray-700' : 'text-blue-100'}`}>
      {description}
    </p>
  </div>
);

// Icônes
const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const AnalysisIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    ></path>
  </svg>
);

const SearchIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    ></path>
  </svg>
);

const RecommendationIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
    ></path>
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

const CompassIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
    ></path>
  </svg>
);

const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    ></path>
  </svg>
);

const EyeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    ></path>
  </svg>
);

export default Step3Radar;
