import React, { useState, useEffect } from 'react';
import FeatureIcon from './FeatureIcon';
// Importer directement le fichier JSON
import features from './functionalities.json';

const FeatureList = ({ openContributionModal }) => {
  // Pas besoin de useState et useEffect pour charger le JSON
  // puisqu'on l'importe directement

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Fonctionnalités ouvertes au financement participatif
      </h2>
      <p className="text-gray-700 mb-8">
        Chaque fonctionnalité est développée uniquement lorsque suffisamment de promesses de dons
        sont recueillies. Votez pour celles qui vous semblent prioritaires !
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          // Déterminer la couleur en fonction de l'index
          const colors = ['blue', 'green', 'indigo', 'amber', 'purple'];
          const color = colors[index % colors.length];

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClass(
                      color
                    )}`}
                  >
                    <FeatureIcon name={feature.icon} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-500">
                      {feature.status === 'fundable' ? 'Finançable' : 'En réflexion'}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{feature.description}</p>

                {feature.goal && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{feature.funded}€ collectés</span>
                      <span>{Math.round((feature.funded / feature.goal) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${getProgressBarClass(color)}`}
                        style={{ width: `${(feature.funded / feature.goal) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {feature.goal && (
                  <div className="mt-6">
                    <button
                      onClick={() => openContributionModal(feature.title, 0)}
                      className={`w-full py-2 px-4 ${getButtonClass(
                        color
                      )} text-white font-medium rounded-md transition-colors shadow-sm flex items-center justify-center gap-2`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Contribuer à cette fonctionnalité
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Fonctions utilitaires pour les classes CSS
const getColorClass = (color) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    amber: 'bg-amber-100 text-amber-800',
    purple: 'bg-purple-100 text-purple-800',
  };
  return colorClasses[color] || colorClasses.blue;
};

const getProgressBarClass = (color) => {
  const progressBarClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    indigo: 'bg-indigo-500',
    amber: 'bg-amber-500',
    purple: 'bg-purple-500',
  };
  return progressBarClasses[color] || progressBarClasses.blue;
};

const getButtonClass = (color) => {
  const buttonClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    indigo: 'bg-indigo-600 hover:bg-indigo-700',
    amber: 'bg-amber-600 hover:bg-amber-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
  };
  return buttonClasses[color] || buttonClasses.blue;
};

export default FeatureList;
