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
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                      {feature.issue && (
                        <a
                          href={feature.issue}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                          title="Voir sur GitHub"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
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
                      <span>Objectif: {feature.goal}€</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${getProgressBarClass(color)}`}
                        style={{ width: `${(feature.funded / feature.goal) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {Math.round((feature.funded / feature.goal) * 100)}% financé
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
