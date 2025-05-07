import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import functionalities from './functionalities.json';
import ContributionModal from '../common/ContributionModal';
import FeatureDetailModal from '../common/FeatureDetailModal';
// Importation dynamique des composants de détail
import Bibliography from '../../pages/auth/onboarding/components/Bibliography';
import Radar from '../../pages/auth/onboarding/components/Radar';
import Coverage from '../../pages/auth/onboarding/components/Coverage';
import Credits from '../../pages/auth/onboarding/components/Credits';

const FeatureList = () => {
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleFundingClick = (feature) => {
    setSelectedFeature(feature);
    setShowFundingModal(true);
  };

  const handleDetailClick = (feature) => {
    if (feature.modal) {
      setSelectedFeature(feature);
      setShowDetailModal(true);
    }
  };

  // Fonction pour obtenir le composant de détail en fonction du nom
  const getDetailComponent = (modalName) => {
    switch (modalName) {
      case 'Bibliography':
        return <Bibliography />;
      case 'Radar':
        return <Radar />;
      case 'Coverage':
        return <Coverage />;
      case 'Credits':
        return <Credits />;
      default:
        return <div>Détails non disponibles</div>;
    }
  };

  // Fonction pour obtenir la couleur de fond en fonction de l'icône
  const getBackgroundColor = (iconName) => {
    switch (iconName) {
      case 'mail':
        return 'bg-purple-50';
      case 'search':
        return 'bg-emerald-50';
      case 'plus-circle':
        return 'bg-blue-50';
      case 'users':
        return 'bg-amber-50';
      case 'globe':
        return 'bg-indigo-50';
      case 'archive':
        return 'bg-pink-50';
      default:
        return 'bg-gray-50';
    }
  };

  // Fonction pour obtenir la couleur du texte en fonction de l'icône
  const getTextColor = (iconName) => {
    switch (iconName) {
      case 'mail':
        return 'text-purple-600';
      case 'search':
        return 'text-emerald-600';
      case 'plus-circle':
        return 'text-blue-600';
      case 'users':
        return 'text-amber-600';
      case 'globe':
        return 'text-indigo-600';
      case 'archive':
        return 'text-pink-600';
      default:
        return 'text-gray-600';
    }
  };

  // Fonction pour obtenir la couleur du bouton en fonction de l'icône
  const getButtonColor = (iconName) => {
    switch (iconName) {
      case 'mail':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'search':
        return 'bg-emerald-600 hover:bg-emerald-700';
      case 'plus-circle':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'users':
        return 'bg-amber-600 hover:bg-amber-700';
      case 'globe':
        return 'bg-indigo-600 hover:bg-indigo-700';
      case 'archive':
        return 'bg-pink-600 hover:bg-pink-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  // Fonction pour obtenir la couleur de la barre de progression en fonction de l'icône
  const getProgressColor = (iconName) => {
    switch (iconName) {
      case 'mail':
        return 'bg-purple-600';
      case 'search':
        return 'bg-emerald-600';
      case 'plus-circle':
        return 'bg-blue-600';
      case 'users':
        return 'bg-amber-600';
      case 'globe':
        return 'bg-indigo-600';
      case 'archive':
        return 'bg-pink-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Découvrez les fonctionnalités ouvertes aux financements
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {functionalities.map((feature, index) => {
          const bgColor = getBackgroundColor(feature.icon);
          const textColor = getTextColor(feature.icon);
          const buttonColor = getButtonColor(feature.icon);
          const progressColor = getProgressColor(feature.icon);
          const progressPercentage = Math.round((feature.funded / feature.goal) * 100);

          return (
            <div key={index} className={`${bgColor} rounded-lg p-6`}>
              {/* En-tête avec icône, titre et objectif */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start">
                  <div className={`${textColor} mr-4`}>
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
                        d={getIconPath(feature.icon)}
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold mb-2 ${textColor}`}>{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">{feature.goal}€</span>
                  <p className="text-sm text-gray-600">Objectif</p>
                </div>
              </div>

              {/* Lien GitHub discret */}
              <div className="mb-4">
                <Link
                  to={feature.issue}
                  target="_blank"
                  className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Suivre sur GitHub
                </Link>
              </div>

              {/* Montant collecté et barre de progression */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{feature.funded}€ collectés</span>
                  <span className="text-gray-600">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-white rounded-full h-2.5">
                  <div
                    className={`${progressColor} h-2.5 rounded-full`}
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFundingClick(feature)}
                  className={`flex-1 ${buttonColor} text-white py-2 rounded-md transition-colors`}
                >
                  Contribuer à cette fonctionnalité
                </button>
                {feature.modal && (
                  <button
                    onClick={() => handleDetailClick(feature)}
                    className={`bg-white text-${textColor.split('-')[1]} border border-${
                      textColor.split('-')[1]
                    }-200 py-2 px-4 rounded-md hover:bg-${
                      textColor.split('-')[1]
                    }-50 transition-colors`}
                  >
                    En savoir plus
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de financement */}
      {showFundingModal && selectedFeature && (
        <ContributionModal
          isOpen={showFundingModal}
          onClose={() => setShowFundingModal(false)}
          feature={selectedFeature}
        />
      )}

      {/* Modal de détail */}
      {showDetailModal && selectedFeature && (
        <FeatureDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          feature={selectedFeature}
          detailComponent={getDetailComponent(selectedFeature.modal)}
        />
      )}
    </div>
  );
};

// Fonction pour obtenir le chemin d'icône SVG
const getIconPath = (iconName) => {
  switch (iconName) {
    case 'mail':
      return 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z';
    case 'search':
      return 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z';
    case 'plus-circle':
      return 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z';
    case 'users':
      return 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z';
    case 'globe':
      return 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    case 'archive':
      return 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4';
    default:
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
  }
};

export default FeatureList;
