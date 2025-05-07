import React from 'react';

const Step5Credits = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* En-tête avec animation */}
      <div className="text-center relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Crédits MédiaScan</h2>
          <p className="text-sm sm:text-base text-emerald-100">
            Lisez les articles qui vous intéressent sans multiplier les abonnements
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-xs font-medium">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1.5"></span>Finançable
            </span>
          </div>
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-teal-500 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-emerald-500 rounded-full opacity-50 blur-xl"></div>
      </div>

      {/* Présentation du concept */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Un système simple et équitable</h3>
        <p className="text-gray-700 mb-6">
          Les crédits MédiaScan vous permettent d'accéder aux contenus premium de différents médias
          sans avoir à souscrire de multiples abonnements. Payez uniquement pour ce que vous lisez
          réellement, tout en soutenant directement les créateurs de contenu.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <FeatureCard
            icon="💰"
            title="Économique"
            description="Payez uniquement pour les articles que vous lisez, de 0,20€ à 2€ selon le contenu"
            color="emerald"
          />
          <FeatureCard
            icon="🔓"
            title="Sans engagement"
            description="Aucun abonnement mensuel, rechargez vos crédits quand vous le souhaitez"
            color="teal"
          />
          <FeatureCard
            icon="🤝"
            title="Équitable"
            description="80% du montant revient directement aux créateurs de contenu"
            color="green"
          />
        </div>
      </div>

      {/* Illustration du problème et solution */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50">
          <h3 className="font-semibold text-gray-900 text-lg mb-4">Comment ça fonctionne</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg p-5 shadow-sm border border-red-100">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                  <span className="text-xl">😤</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Le problème actuel</h4>
                  <p className="text-sm text-gray-700">
                    Vous tombez sur un article intéressant mais... il est payant. Vous ne voulez pas
                    prendre un abonnement complet juste pour un article !
                  </p>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex flex-col space-y-3">
                  <ScenarioItem
                    title="Frustration"
                    description="Vous abandonnez la lecture d'un contenu qui vous intéresse"
                  />
                  <ScenarioItem
                    title="Coût élevé"
                    description="Vous payez pour des abonnements que vous sous-utilisez"
                  />
                  <ScenarioItem
                    title="Multiplication"
                    description="Vous devez gérer de nombreux comptes et abonnements"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm border border-emerald-100">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <span className="text-xl">💡</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">La solution MédiaScan</h4>
                  <p className="text-sm text-gray-700">
                    Créditez votre compte et payez uniquement les articles qui vous intéressent,
                    sans engagement.
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="flex flex-col space-y-3">
                  <SolutionItem
                    title="Liberté"
                    description="Lisez n'importe quel article premium sans abonnement"
                  />
                  <SolutionItem
                    title="Économie"
                    description="Payez uniquement ce que vous consommez réellement"
                  />
                  <SolutionItem
                    title="Simplicité"
                    description="Un seul compte pour accéder à tous les médias partenaires"
                  />
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
              <CreditExample
                count={150}
                price="0,20€"
                type="Articles courts"
                icon={<DocumentIcon />}
                color="emerald"
              />
              <CreditExample
                count={60}
                price="0,50€"
                type="Articles standards"
                icon={<DocumentTextIcon />}
                color="teal"
              />
              <CreditExample
                count={15}
                price="2€"
                type="Enquêtes approfondies"
                icon={<DocumentSearchIcon />}
                color="green"
              />
            </div>
          </div>
        </div>

        {/* Types de contenus */}
        <div className="p-5 bg-white">
          <h3 className="font-semibold text-gray-900 mb-4 text-lg">
            Types de contenus accessibles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ContentTypeCard
              title="Presse traditionnelle"
              items={[
                "Articles d'investigation",
                'Analyses approfondies',
                'Reportages exclusifs',
                "Tribunes d'experts",
              ]}
              icon={<NewspaperIcon />}
            />
            <ContentTypeCard
              title="Créateurs indépendants"
              items={[
                'Blogs spécialisés',
                'Recherches académiques',
                'Newsletters premium',
                'Analyses de données',
              ]}
              icon={<UserGroupIcon />}
            />
          </div>

          {/* Répartition des revenus */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-5">
            <h4 className="font-medium text-gray-900 mb-3 text-center">Répartition des revenus</h4>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
              <RevenueShare
                percentage={80}
                recipient="Créateurs de contenu"
                description="Revient directement aux médias et auteurs"
                color="emerald"
              />
              <RevenueShare
                percentage={20}
                recipient="MédiaScan"
                description="Pour maintenir et améliorer le service"
                color="teal"
              />
            </div>
          </div>
        </div>
      </div>
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

// Composant pour les scénarios problématiques
const ScenarioItem = ({ title, description }) => (
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
      <p className="font-medium text-gray-900 text-sm">{title}</p>
      <p className="text-xs text-gray-700">{description}</p>
    </div>
  </div>
);

// Composant pour les solutions
const SolutionItem = ({ title, description }) => (
  <div className="flex items-start gap-2">
    <svg
      className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <div>
      <p className="font-medium text-gray-900 text-sm">{title}</p>
      <p className="text-xs text-gray-700">{description}</p>
    </div>
  </div>
);

// Composant pour les exemples de crédit
const CreditExample = ({ count, price, type, icon, color }) => (
  <div className={`bg-${color}-50 p-4 rounded-lg text-center`}>
    <div
      className={`w-12 h-12 mx-auto bg-${color}-100 rounded-full flex items-center justify-center text-${color}-600 mb-3`}
    >
      {icon}
    </div>
    <div className={`text-3xl font-bold text-${color}-600 mb-1`}>{count}</div>
    <div className="text-sm font-medium text-gray-900 mb-1">{type}</div>
    <div className="text-xs text-gray-600">à {price} l'unité</div>
  </div>
);

// Composant pour les types de contenus
const ContentTypeCard = ({ title, items, icon }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <div className="flex items-center gap-3 mb-3">
      <div className="text-emerald-600 bg-emerald-50 p-2 rounded-lg">{icon}</div>
      <h4 className="font-medium text-gray-900">{title}</h4>
    </div>
    <ul className="text-sm text-gray-700 space-y-2 pl-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="text-emerald-500 mt-0.5">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Composant pour la répartition des revenus
const RevenueShare = ({ percentage, recipient, description, color }) => (
  <div className="text-center">
    <div className={`text-4xl font-bold text-${color}-600 mb-1`}>{percentage}%</div>
    <div className="font-medium text-gray-900 mb-1">{recipient}</div>
    <div className="text-xs text-gray-600">{description}</div>
  </div>
);

// Icônes
const DocumentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    ></path>
  </svg>
);

const DocumentTextIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    ></path>
  </svg>
);

const DocumentSearchIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"
    ></path>
  </svg>
);

const NewspaperIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
    ></path>
  </svg>
);

const UserGroupIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    ></path>
  </svg>
);

export default Step5Credits;
