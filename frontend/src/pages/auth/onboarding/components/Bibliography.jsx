import React from 'react';

const Step2Bibliography = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* En-tête avec animation */}
      <div className="text-center relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
            Bibliographies thématiques partagées
          </h2>
          <p className="text-sm sm:text-base text-indigo-100">
            Comme une playlist Spotify, mais pour vos sources d'information !
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            {/* <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-xs font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>En développement
            </span> */}
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-xs font-medium">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1.5"></span>Finançable
            </span>
          </div>
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-500 rounded-full opacity-50 blur-xl"></div>
      </div>
      {/* Présentation visuelle du concept */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/2">
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">
              Le concept en un coup d'œil
            </h3>
            <p className="text-gray-700 mb-4">
              Imaginez pouvoir créer et partager des collections de sources d'information sur
              n'importe quel sujet, comme vous le feriez avec une playlist musicale. C'est
              exactement ce que permettront les bibliographies thématiques.
            </p>
            <div className="space-y-2">
              <Feature text="Organisez vos sources par thèmes" />
              <Feature text="Partagez votre expertise avec la communauté" />
              <Feature text="Découvrez les meilleures sources sur vos sujets favoris" />
              <Feature text="Collaborez avec d'autres utilisateurs" />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      ></path>
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900">Transition écologique</h4>
                </div>
                <div className="space-y-2 pl-11">
                  <SourceItem name="Reporterre" type="Média indépendant" />
                  <SourceItem name="The Conversation" type="Analyses académiques" />
                  <SourceItem name="Bon Pote" type="Blog spécialisé" />
                  <div className="text-center pt-1">
                    <span className="text-xs text-indigo-500">+ 12 autres sources</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Citation exemple */}
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg text-center">
          Exemple de bibliographie thématique
        </h3>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                ></path>
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">Inspirer les communes rurales</h4>
              <div className="flex items-center text-sm text-gray-600">
                <span>Créée par Marie D.</span>
                <span className="mx-2">•</span>
                <span>14 sources</span>
                <span className="mx-2">•</span>
                <span className="text-purple-600">Publique</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <p className="text-gray-700 mb-3 text-sm italic">
              "Une collection de sources pour aider les communes rurales à trouver l'inspiration et
              des solutions concrètes pour revitaliser leurs territoires."
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                Ruralité
              </span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Développement local
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Transition écologique
              </span>
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                Participation citoyenne
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="font-medium text-gray-900 mb-2">Sources principales</h5>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-3">
                    <span className="font-bold text-xs">VF</span>
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-900">Village Factory</h6>
                    <p className="text-xs text-gray-600">Magazine sur l'innovation rurale</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Média
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    <span className="font-bold text-xs">RT</span>
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-900">Ruralité Territoire</h6>
                    <p className="text-xs text-gray-600">Newsletter de l'ANCT</p>
                  </div>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Institutionnel
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                    <span className="font-bold text-xs">TC</span>
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-900">Terre Commune</h6>
                    <p className="text-xs text-gray-600">Blog sur les initiatives locales</p>
                  </div>
                </div>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                  Blog
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                    <span className="font-bold text-xs">RR</span>
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-900">Réseau Rural</h6>
                    <p className="text-xs text-gray-600">Plateforme collaborative</p>
                  </div>
                </div>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  Réseau
                </span>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="text-xs text-indigo-500 font-medium">+ 10 autres sources</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-700 italic mb-3">
            "La bibliographie de Marie sur les innovations rurales est devenue une référence
            incontournable pour notre collectif de communes rurales. Elle nous a fait découvrir des
            initiatives dont nous n'aurions jamais entendu parler autrement !"
          </p>
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-2">
              <span className="text-xs font-medium">MP</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              Martin Petit, Maire de Saint-Julien
            </span>
          </div>
        </div>
      </div>
      {/* Fonctionnalités actuelles */}
      <div className="bg-blue-50 rounded-xl p-6 shadow-md">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg">
          Ce que vous pouvez déjà faire aujourd'hui
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
            }
            title="Catalogue communautaire"
            description="Choisissez parmi des centaines de sources déjà référencées par la communauté."
          />
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
            }
            title="Ajout de sources"
            description="Ajoutez vos propres sources qui intégreront le catalogue communautaire."
          />
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
            }
            title="Enrichissement des métadonnées"
            description="Renseignez l'orientation politique, le financement ou la ligne éditoriale des sources."
          />
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>
            }
            title="Contribution collective"
            description="Chaque source que vous ajoutez enrichit le catalogue pour tous les utilisateurs."
          />
        </div>

        <div className="bg-white p-4 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <div className="text-blue-600 mr-3 mt-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <div>
              <p className="text-blue-800 font-medium mb-1">Merci pour votre contribution !</p>
              <p className="text-gray-700 text-sm">
                Chaque source que vous ajoutez ou enrichissez aide toute la communauté à mieux
                s'informer. Nous vous remercions par avance pour les sources que vous allez ajouter
                !
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Appel à l'action pour le financement */}
      {/* <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 shadow-lg text-white">
        <div className="text-center mb-6">
          <h3 className="font-bold text-xl mb-2">
            Soutenez le développement de cette fonctionnalité
          </h3>
          <p className="text-indigo-100">
            Votre contribution nous permettra d'accélérer le développement des bibliographies
            thématiques et de créer un outil encore plus puissant pour la communauté.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <FundingOption
            amount="5€"
            title="Contributeur"
            description="Accès anticipé à la fonctionnalité"
          />
          <FundingOption
            amount="20€"
            title="Supporter"
            description="Accès anticipé + nom dans les remerciements"
            highlighted={true}
          />
          <FundingOption
            amount="50€"
            title="Mécène"
            description="Tous les avantages + session personnalisée"
          />
        </div>

        <div className="text-center">
          <button className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium shadow-md hover:bg-indigo-50 transition-colors">
            Contribuer au financement
          </button>
        </div>
      </div>*/}
    </div>
  );
};

// Composant pour les caractéristiques
const Feature = ({ text }) => (
  <div className="flex items-center">
    <svg
      className="w-5 h-5 text-indigo-500 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span className="text-gray-700">{text}</span>
  </div>
);

// Composant pour les sources dans l'exemple
const SourceItem = ({ name, type }) => (
  <div className="flex items-center justify-between">
    <span className="font-medium text-gray-800">{name}</span>
    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{type}</span>
  </div>
);

// Composant pour les cartes de fonctionnalités
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-4 rounded-lg border border-blue-100 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
    <div className="text-blue-600 shrink-0 mt-0.5 bg-blue-50 p-2 rounded-lg">{icon}</div>
    <div>
      <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  </div>
);

// Composant pour les exemples de bibliographies
const BibliographyExample = ({ title, color, count, author }) => (
  <div
    className={`bg-white p-4 rounded-lg shadow-sm border border-${color}-100 hover:shadow-md transition-shadow`}
  >
    <div
      className={`w-8 h-8 bg-${color}-100 rounded-full flex items-center justify-center text-${color}-600 mb-3`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        ></path>
      </svg>
    </div>
    <h4 className={`font-medium text-${color}-900 mb-1`}>{title}</h4>
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500">{count} sources</span>
      <span className="text-xs font-medium text-gray-700">Par {author}</span>
    </div>
  </div>
);

// Composant pour les options de financement
const FundingOption = ({ amount, title, description, highlighted = false }) => (
  <div
    className={`rounded-lg p-4 ${
      highlighted
        ? 'bg-white text-indigo-900 shadow-lg transform scale-105'
        : 'bg-white/20 text-white'
    }`}
  >
    <div className="text-center mb-2">
      <span className={`text-2xl font-bold ${highlighted ? 'text-indigo-600' : ''}`}>{amount}</span>
    </div>
    <h4 className="font-medium text-center mb-2">{title}</h4>
    <p className={`text-sm text-center ${highlighted ? 'text-gray-700' : 'text-indigo-100'}`}>
      {description}
    </p>
  </div>
);

export default Step2Bibliography;
