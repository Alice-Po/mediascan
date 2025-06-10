import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CompleteCoverageExample from './CompleteCoverageExample';

const UpcomingFeatures = ({ onValidationChange }) => {
  const [activeAccordion, setActiveAccordion] = useState('');

  // Signaler que cette étape est toujours valide
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(true);
    }
  }, [onValidationChange]);

  // Toggle pour activer/désactiver un accordéon
  const toggleAccordion = (accordionId) => {
    setActiveAccordion(accordionId === activeAccordion ? null : accordionId);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* En-tête avec animation */}
      <div className="text-center relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Fonctionnalités à venir</h2>
          <p className="text-sm sm:text-base text-indigo-100">
            Découvrez les fonctionnalités ouvertes au financement participatif
          </p>
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-500 rounded-full opacity-50 blur-xl"></div>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-lg p-5 shadow-sm">
        <p className="text-gray-700 mb-4">
          MédiaScan continue d'évoluer avec de nouvelles fonctionnalités financées par le
          financement participatif. Cliquez sur chaque section ci-dessous pour découvrir les
          fonctionnalités à l'étude.
        </p>

        {/* Accordéons des fonctionnalités */}
        <div className="space-y-4">
          {/* Accordéon pour Radar */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className={`w-full flex items-center justify-between p-4 text-left ${
                activeAccordion === 'radar' ? 'bg-blue-50' : 'bg-white'
              }`}
              onClick={() => toggleAccordion('radar')}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white mr-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Radar de veille intelligent</h3>
                  <p className="text-sm text-gray-600">
                    Découvrez les contenus pertinents au-delà de vos sources habituelles
                  </p>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  activeAccordion === 'radar' ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Contenu de l'accordéon Radar */}
            <div
              className={`overflow-hidden transition-all max-h-0 ${
                activeAccordion === 'radar' ? 'max-h-[2000px]' : 'max-h-0'
              }`}
            >
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
                {/* Contenu du Radar */}
                <div className="space-y-4">
                  {/* Présentation du concept */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                      Découvrez de nouvelles sources grâce au Radar
                    </h3>
                    <p className="text-gray-700 mb-6">
                      Au lieu d'utiliser des mots-clés, exprimez naturellement ce qui vous
                      intéresse. Le Radar explore ensuite l'ensemble du web, même au-delà de vos
                      sources habituelles, pour vous faire découvrir des contenus pertinents.
                    </p>
                  </div>

                  {/* Exemple concret */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-lg mb-4">
                        Comment ça marche ?
                      </h3>
                      {/* Exemple de recherche */}
                      <div className="w-full">
                        <p className="text-gray-700 mb-4">Par exemple, dites simplement :</p>
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
                                La ferme du Bec-Hellouin lance un espace test pour la culture du
                                bambou
                              </h3>
                              <p className="text-sm text-gray-500 mb-3">
                                Ouest-France • Il y a 2 heures
                              </p>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                            La célèbre ferme biologique normande inaugure un nouvel espace dédié à
                            l'expérimentation de la culture du bambou. Ce projet innovant vise à
                            étudier l'adaptation de différentes variétés de bambou au climat normand
                            et leur potentiel pour la construction durable.
                          </p>

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
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
                              Le Bec-Hellouin, Normandie
                            </span>
                            <span>•</span>
                            <span className="text-emerald-600">
                              Correspond à votre recherche sur le bambou
                            </span>
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                            <div className="flex space-x-2">
                              <button className="text-gray-500 hover:text-gray-700">
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
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                  ></path>
                                </svg>
                              </button>
                              <button className="text-gray-500 hover:text-gray-700">
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
                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                  ></path>
                                </svg>
                              </button>
                              <button className="text-gray-500 hover:text-gray-700">
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

                    <div className="p-4 bg-blue-50 rounded-lg m-4">
                      <div className="flex items-start gap-2">
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
                        <p className="text-sm text-blue-700">
                          <span className="font-medium">Pour les curieux :</span> Cette
                          fonctionnalité utilisera une base de données vectorielle pour effectuer
                          des recherches sémantiques avancées dans le contenu de Médiascan. Les
                          spécifications techniques précises sont encore en cours d'élaboration.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Accordéon pour Couverture */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className={`w-full flex items-center justify-between p-4 text-left ${
                activeAccordion === 'coverage' ? 'bg-purple-50' : 'bg-white'
              }`}
              onClick={() => toggleAccordion('coverage')}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white mr-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Couverture complète</h3>
                  <p className="text-sm text-gray-600">
                    Explorez un sujet d'actualité sous différents angles
                  </p>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  activeAccordion === 'coverage' ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Contenu de l'accordéon Couverture */}
            <div
              className={`overflow-hidden transition-all max-h-0 ${
                activeAccordion === 'coverage' ? 'max-h-[2000px]' : 'max-h-0'
              }`}
            >
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                {/* Contenu de Couverture */}
                <div className="space-y-4">
                  {/* Présentation du concept */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                      Comprendre un sujet sous tous ses angles
                    </h3>
                    <p className="text-gray-700 mb-6">
                      La fonctionnalité "Couverture complète" vous permet d'explorer un sujet
                      d'actualité à travers différentes approches journalistiques. Découvrez comment
                      un même événement peut être traité selon diverses perspectives : écologique,
                      sociétale, critique, locale ou orientée solutions.
                    </p>
                  </div>
                  <CompleteCoverageExample />
                  <div>
                    <div className="p-4 bg-purple-50 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-2">
                            <svg
                              className="w-4 h-4"
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
                          </div>
                          <span className="text-sm text-gray-700">
                            Explorez les différentes perspectives en cliquant sur les onglets
                            ci-dessus
                          </span>
                        </div>
                        <span className="text-xs text-purple-600 font-medium">
                          7 perspectives disponibles
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Accordéon pour Crédits */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className={`w-full flex items-center justify-between p-4 text-left ${
                activeAccordion === 'credits' ? 'bg-emerald-50' : 'bg-white'
              }`}
              onClick={() => toggleAccordion('credits')}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full flex items-center justify-center text-white mr-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Crédits MédiaScan</h3>
                  <p className="text-sm text-gray-600">
                    Lisez les articles sans multiplier les abonnements
                  </p>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  activeAccordion === 'credits' ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Contenu de l'accordéon Crédits */}
            <div
              className={`overflow-hidden transition-all max-h-0 ${
                activeAccordion === 'credits' ? 'max-h-[2000px]' : 'max-h-0'
              }`}
            >
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50">
                {/* Contenu de Crédits */}
                <div className="space-y-4">
                  {/* Présentation du concept */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <p className="text-gray-700 mb-6">
                      Les crédits MédiaScan vous permettent d'accéder aux contenus premium de
                      différents médias sans avoir à souscrire de multiples abonnements. Payez
                      uniquement pour ce que vous lisez réellement, tout en soutenant directement
                      les créateurs de contenu.
                    </p>
                  </div>

                  {/* Illustration du problème et solution */}
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-lg mb-4">
                        Comment ça fonctionne
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white rounded-lg p-5 shadow-sm border border-red-100">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                              <span className="text-xl">😤</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Le problème actuel</h4>
                              <p className="text-sm text-gray-700">
                                Vous tombez sur un article intéressant mais... il est payant. Vous
                                ne voulez pas prendre un abonnement complet juste pour un article !
                              </p>
                            </div>
                          </div>

                          <div className="bg-red-50 rounded-lg p-4">
                            <div className="flex flex-col space-y-3">
                              <div className="flex items-start gap-2">
                                <svg
                                  className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">Frustration</p>
                                  <p className="text-xs text-gray-700">
                                    Vous abandonnez la lecture d'un contenu qui vous intéresse
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <svg
                                  className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">Coût élevé</p>
                                  <p className="text-xs text-gray-700">
                                    Vous payez pour des abonnements que vous sous-utilisez
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <svg
                                  className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">
                                    Multiplication
                                  </p>
                                  <p className="text-xs text-gray-700">
                                    Vous devez gérer de nombreux comptes et abonnements
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-5 shadow-sm border border-emerald-100">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                              <span className="text-xl">💡</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">
                                La solution MédiaScan
                              </h4>
                              <p className="text-sm text-gray-700">
                                Créditez votre compte et payez uniquement les articles qui vous
                                intéressent, sans engagement.
                              </p>
                            </div>
                          </div>

                          <div className="bg-emerald-50 rounded-lg p-4">
                            <div className="flex flex-col space-y-3">
                              <div className="flex items-start gap-2">
                                <svg
                                  className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  ></path>
                                </svg>
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">Liberté</p>
                                  <p className="text-xs text-gray-700">
                                    Lisez n'importe quel article premium sans abonnement
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <svg
                                  className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  ></path>
                                </svg>
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">Économie</p>
                                  <p className="text-xs text-gray-700">
                                    Payez uniquement ce que vous consommez réellement
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <svg
                                  className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  ></path>
                                </svg>
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">Simplicité</p>
                                  <p className="text-xs text-gray-700">
                                    Un seul compte pour accéder à tous les médias partenaires
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Exemple de crédit */}
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100 mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 text-center mb-4">
                          Exemple avec 30€ de crédit
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-emerald-50 p-4 rounded-lg text-center">
                            <div className="w-12 h-12 mx-auto bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-3">
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                ></path>
                              </svg>
                            </div>
                            <div className="text-3xl font-bold text-emerald-600 mb-1">150</div>
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              Articles courts
                            </div>
                            <div className="text-xs text-gray-600">à 0,20€ l'unité</div>
                          </div>

                          <div className="bg-teal-50 p-4 rounded-lg text-center">
                            <div className="w-12 h-12 mx-auto bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-3">
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                ></path>
                              </svg>
                            </div>
                            <div className="text-3xl font-bold text-teal-600 mb-1">60</div>
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              Articles standards
                            </div>
                            <div className="text-xs text-gray-600">à 0,50€ l'unité</div>
                          </div>

                          <div className="bg-green-50 p-4 rounded-lg text-center">
                            <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"
                                ></path>
                              </svg>
                            </div>
                            <div className="text-3xl font-bold text-green-600 mb-1">15</div>
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              Enquêtes approfondies
                            </div>
                            <div className="text-xs text-gray-600">à 2€ l'unité</div>
                          </div>
                        </div>
                      </div>

                      {/* Répartition des revenus */}
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-5 mb-4">
                        <h4 className="font-medium text-gray-900 mb-3 text-center">
                          Répartition des revenus
                        </h4>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-emerald-600 mb-1">80%</div>
                            <div className="font-medium text-gray-900 mb-1">
                              Créateurs de contenu
                            </div>
                            <div className="text-xs text-gray-600">
                              Revient directement aux médias et auteurs
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-4xl font-bold text-teal-600 mb-1">20%</div>
                            <div className="font-medium text-gray-900 mb-1">MédiaScan</div>
                            <div className="text-xs text-gray-600">
                              Pour maintenir et améliorer le service
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Comment fonctionne notre financement participatif ?
      </h2>
      <p className="text-gray-700 mb-6 font-medium">
        Votez avec votre portefeuille pour les fonctionnalités que vous souhaitez voir développées.
      </p>
      <ol className="space-y-4 mb-6">
        <li className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium shrink-0 mt-0.5">
            1
          </div>
          <p className="text-gray-700">
            <strong>Faites une promesse de don</strong> pour les fonctionnalités qui vous
            intéressent
          </p>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium shrink-0 mt-0.5">
            2
          </div>
          <p className="text-gray-700">
            <strong>Aucun prélèvement immédiat</strong> - votre promesse est un vote qui nous aide à
            prioriser
          </p>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium shrink-0 mt-0.5">
            3
          </div>
          <p className="text-gray-700">
            <strong>Paiement uniquement à la livraison</strong> - vous ne payez que lorsque la
            fonctionnalité est développée et fonctionnelle
          </p>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium shrink-0 mt-0.5">
            4
          </div>
          <p className="text-gray-700">
            <strong>Transparence totale</strong> sur l'avancement des développements
          </p>
        </li>
      </ol>
      <p className="text-gray-700">
        Notre approche vous donne un pouvoir direct sur l'évolution de Médiascan tout en nous
        imposant une obligation de résultat. RDV sur l'onglet{' '}
        <strong>Financement participatif</strong> pour en savoir plus
      </p>
      {/* Note finale */}
      {/* <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-100">
        <div className="flex items-start gap-3">
          <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-indigo-700">
              Ces fonctionnalités sont en cours de développement et seront bientôt disponibles sur
              MédiaScan. Certaines pourront nécessiter un financement participatif pour voir le jour
              plus rapidement.
            </p>
          </div>
        </div> 
      </div>*/}
    </div>
  );
};

UpcomingFeatures.propTypes = {
  onValidationChange: PropTypes.func,
};

export default UpcomingFeatures;
