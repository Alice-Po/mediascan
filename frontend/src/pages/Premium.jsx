import React, { useState } from 'react';
import ContributionModal from '../components/common/ContributionModal';

const PremiumFeature = ({ icon, title, description, comingSoon }) => (
  <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-1">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
      {comingSoon && (
        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
          Ouvert au financement
        </span>
      )}
    </div>
  </div>
);

const Premium = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [targetAmount, setTargetAmount] = useState(0);

  const handleContribute = (feature, amount) => {
    setSelectedFeature(feature);
    setTargetAmount(amount);
    setModalOpen(true);
  };

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: 'Intégration des infolettres',
      description:
        "Importez vos infolettres préférées directement dans votre fil d'actualités. Fini les emails qui s'accumulent, retrouvez tout votre contenu au même endroit.",
      status: 'fundable',
      goal: 1000,
      funded: 15,
      issue: 'https://github.com/Alice-Po/mediascan/issues/32',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: 'Radar de veille',
      description:
        'Exprimez un sujet d\'intérêt en langage naturel, nous scannons le web pour vous fournir une veille efficace. Par exemple : "Je cherche des retours d\'expérience sur des SCI citoyennes qui fonctionnent bien". Recevez une notification quand un article correspond à votre recherche.',
      status: 'investigation',
      goal: 1500,
      funded: 300,
      issue: 'https://github.com/Alice-Po/mediascan/issues/33',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Détection intelligente de flux d'actualités",
      description:
        "Aujourd'hui nous récupérons les actualités via la technologie RSS. Mais chacun flux RSS délivre des données structurées différemment. Aujourd'hui vous êtes obligé de rentrer l'adresse url précise du flux, ce qui n'est pas forcément évident à trouver. Demain, vous pourriez seulement entrer un site web et nous détecterons automatiquement le flux RSS.",
      status: 'fundable',
      goal: 1000,
      funded: 5,
      issue: 'https://github.com/Alice-Po/mediascan/issues/34',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: 'Lire des acticles payants',
      description:
        "Au lieu de payer plusieurs abonnement payants à des médias, payer à l'article lu avec un crédit MédiaScan.",
      status: 'investigation',
      goal: 1000,
      funded: 200,
      issue: 'https://github.com/Alice-Po/mediascan/issues/35',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: 'Modération communautaire des sources',
      description:
        'Pour garantir la fiabilité des informations sur les sources, nous réflechissons un système de modération collaborative. Nous aimerions étudier ce qui a déjà existé et explorer les possibles.',
      status: 'investigation',
      goal: 800,
      funded: 0,
      issue: 'https://github.com/Alice-Po/mediascan/issues/36',
    },
    // {
    //   icon: (
    //     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth="2"
    //         d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    //       />
    //     </svg>
    //   ),
    //   title: 'Analytics avancées de lecture',
    //   description:
    //     "Pour mieux comprendre vos habitudes de lecture, nous réfléchissons à de nouvelles métriques : temps passé par source, sujets récurrents, évolution de vos centres d'intérêt... Aidez-nous à définir les indicateurs les plus pertinents.",
    //   status: 'investigation',
    //   goal: 600,
    //   funded: 0,
    //   issue: 'https://github.com/Alice-Po/mediascan/issues/37',
    // },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
      title: 'Couverture médiatique complète',
      description:
        "Agrégation intelligente des articles sur un même sujet, sans personnalisation, pour une vision plus objective de l'actualité.Exactement comme le fait Google News",
      status: 'investigation',
      issue: 'https://github.com/Alice-Po/mediascan/issues/39',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      title: 'Playlists de sources',
      description:
        "Créez et partagez des collections de sources thématiques, comme des playlists Spotify. Idéal pour la veille collaborative et le partage de centres d'intérêt spécifiques.",
      status: 'investigation',
      issue: 'https://github.com/Alice-Po/mediascan/issues/40',
    },
  ];

  return (
    <div className="container mx-auto px-0 sm:px-4 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16 pt-16 sm:pt-0">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-12">MédiaScan</h1>

          <div className="space-y-6 sm:space-y-8 text-base sm:text-lg text-gray-700 max-w-3xl mx-auto">
            <div>
              <h2 className="font-semibold text-xl mb-2">Ce que nous faisons :</h2>
              <p>
                Nous développons Médiascan, un agrégateur d'actualités qui évoluera progressivement
                vers une plateforme complète d'information. Notre service minimum actuel pose les
                bases d'un projet qui, grâce au financement participatif, s'enrichira de
                fonctionnalités comme l'intégration d'infolettres, les collections de sources
                partageables ou toute autre fonctionalités réclamées par ses utilisateurs.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-xl mb-2">Pourquoi nous le faisons :</h2>
              <p>
                Nous sommes convaincus que l'"
                <a
                  href="https://fr.wiktionary.org/wiki/enshittification"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  enshittification
                </a>
                " du web a détérioré notre relation à l'information. Les algorithmes opaques
                favorisent l'engagement émotionnel plutôt que la pertinence, creusant les divisions
                sociales et affaiblissant notre capacité d'empathie. Nous voulons briser ce cycle où
                nous jugeons "fous" ceux que nous ne comprenons pas simplement parce que nos sources
                d'information diffèrent. Dans un monde où être bien informé devient paradoxalement
                plus difficile malgré l'abondance de contenus, nous croyons qu'une alternative
                indépendante et transparente est nécessaire.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-xl mb-2">Notre approche :</h2>
              <p>
                Médiascan est développé par et pour sa communauté. Sans investisseurs ni pression
                financière, nous pouvons rester fidèles à notre mission sur le long terme. Chaque
                fonctionnalité est conçue avec pragmatisme, en réponse aux besoins réels des
                utilisateurs et non pour maximiser l'engagement ou les revenus. Notre feuille de
                route est collaborative permettant aux utilisateurs de guider l'évolution du projet
                selon leurs besoins.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-xl mb-2">Notre promesse :</h2>
              <p>
                Médiascan sera toujours un outil au service de votre compréhension du monde, jamais
                un instrument d'exploitation de votre attention. Nous nous engageons à maintenir une
                plateforme qui respecte votre intelligence, valorise la diversité des perspectives,
                et vous aide à retrouver le goût de vous informer. Pas de manipulation algorithmique
                cachée, pas de monétisation agressive de vos données, juste un outil honnête qui
                évolue avec vous.
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-xl mb-2">C'est qui nous ? </h2>
              <p>Pour l'instant c'est Alice et son chat.</p>
            </div>
          </div>

          {/* Séparateur */}
          <div className="border-t border-gray-200 my-12"></div>

          {/* Section des phases de développement */}
          <div className="text-gray-600">
            <p className="mb-8">
              Pour concrétiser cette vision, nous avons choisi une approche progressive et
              transparente. Voici où nous en sommes :
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Phase 1 - Quasiment terminée */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    95% complété
                  </span>
                </div>
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-gray-900 font-semibold mb-2">Phase 1 : Les fondations</h3>
                <p className="text-gray-600 text-sm">
                  Un agrégateur d'actualités fonctionnel et gratuit. Version web complète,
                  applications mobiles en phase finale de développement.
                </p>
              </div>

              {/* Phase 2 - En cours */}
              <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-purple-200 relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                    Phase actuelle
                  </span>
                </div>
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="text-gray-900 font-semibold mb-2">
                  Phase 2 : Fonctionnalités avancées
                </h3>
                <p className="text-gray-600 text-sm">
                  Développement collaboratif des fonctionnalités premium : intégration
                  d'infolettres, veille intelligente, détection automatique des sources. Financées
                  par vos contributions.
                </p>
              </div>

              {/* Phase 3 - À venir */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    Prochainement
                  </span>
                </div>
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-gray-900 font-semibold mb-2">Phase 3 : Pérennisation</h3>
                <p className="text-gray-600 text-sm">
                  Lancement des abonnements premium pour assurer la maintenance et l'évolution
                  continue des fonctionnalités développées ensemble. Nous garantissons une version
                  gratuite sera toujours disponible.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section crowdfunding */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 sm:p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Développement guidé par vos envies</h2>
            <p className="text-lg text-purple-100">
              Pas de levée de fonds, pas d'investisseurs : juste des promesses de soutien pour
              guider nos priorités.
            </p>
          </div>

          <div className="p-4 sm:p-8">
            {/* Explication du concept */}
            <div className="mb-8 bg-blue-50 p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <div className=" hidden flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Comment ça marche ?</h3>
                  <div className="space-y-4 text-blue-800">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-xl">1.</span>
                      <div>
                        <p className="font-medium">Manifestez votre intérêt - sans payer !</p>
                        <p className="text-sm">
                          Faites une simple promesse de don pour les fonctionnalités qui vous
                          intéressent. Aucun paiement n'est demandé à ce stade.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-bold text-xl">2.</span>
                      <div>
                        <p className="font-medium">Nous développons selon vos priorités</p>
                        <p className="text-sm">
                          Une fois qu'une fonctionnalité atteint suffisamment de promesses, nous la
                          développons et la testons rigoureusement.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-bold text-xl">3.</span>
                      <div>
                        <p className="font-medium">Vous ne payez qu'une fois satisfait</p>
                        <p className="text-sm">
                          Nous vous recontactons uniquement quand la fonctionnalité est prête et
                          testée. Vous décidez alors de concrétiser votre promesse ou non.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 bg-white p-4 rounded-lg border border-blue-100">
                      <div className="flex items-start gap-3">
                        <span role="img" aria-label="shield" className="text-xl">
                          🛡️
                        </span>
                        <p className="text-sm">
                          <span className="font-medium block mb-1">Notre engagement :</span>
                          Aucun risque pour vous - vous ne payez que si la fonctionnalité est
                          développée et vous convient.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Avantages contributeurs */}
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-sm text-yellow-800 border-t border-gray-200 pt-6 sm:pt-8 text-center px-2 sm:px-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Devenez membre premium à vie
              </h3>
              <p className="text-gray-600 mb-6">
                Pour toute contribution de 50€ ou plus, recevez un accès premium à vie à toutes les
                fonctionnalités actuelles et futures de MediaScan (Proposition valable jusqu'au 1
                Janvier 2026).
              </p>
            </div>

            {/* Objectifs de financement */}
            <div className="border-t border-gray-200 pt-6 sm:pt-8 text-center px-2 sm:px-0">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Découvrez les fonctionalités ouvertes aux financements
              </h2>
              <div className="space-y-4 sm:space-y-6 mb-8">
                {features
                  .filter((feature) => feature.status === 'fundable')
                  .map((feature, index) => {
                    const progress = Math.round((feature.funded / feature.goal) * 100);
                    const isEven = index % 2 === 0;

                    return (
                      <div
                        key={feature.title}
                        className={`bg-gradient-to-r ${
                          isEven ? 'from-purple-50 to-indigo-50' : 'from-blue-50 to-purple-50'
                        } rounded-lg p-3 sm:p-6 mx-0`}
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-6 mb-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 hidden sm:block">{feature.icon}</div>
                              <div>
                                <h3
                                  className={`text-lg font-semibold ${
                                    isEven ? 'text-purple-900' : 'text-blue-900'
                                  }`}
                                >
                                  {feature.title}
                                </h3>
                                <p
                                  className={`text-sm mt-1 ${
                                    isEven ? 'text-purple-700' : 'text-blue-700'
                                  }`}
                                >
                                  {feature.description}
                                </p>
                                <a
                                  href={feature.issue}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1 mt-2"
                                >
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                  </svg>
                                  <span>Suivre sur GitHub</span>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-xl sm:text-2xl font-bold ${
                                isEven ? 'text-purple-900' : 'text-blue-900'
                              }`}
                            >
                              {feature.goal}€
                            </div>
                            <div
                              className={`text-sm ${isEven ? 'text-purple-700' : 'text-blue-700'}`}
                            >
                              Objectif
                            </div>
                          </div>
                        </div>

                        {/* Barre de progression et bouton */}
                        <div className="space-y-4">
                          <div>
                            <div
                              className={`w-full ${
                                isEven ? 'bg-purple-100' : 'bg-blue-100'
                              } rounded-full h-2 mb-2`}
                            >
                              <div
                                className={`${
                                  isEven ? 'bg-purple-600' : 'bg-blue-600'
                                } h-2 rounded-full`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div
                              className={`flex justify-between text-xs sm:text-sm ${
                                isEven ? 'text-purple-700' : 'text-blue-700'
                              }`}
                            >
                              <span>{feature.funded}€ collectés</span>
                              <span>{progress}%</span>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              handleContribute(feature.title.toLowerCase(), feature.goal)
                            }
                            className={`w-full ${
                              isEven
                                ? 'bg-purple-600 hover:bg-purple-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                            } text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base`}
                          >
                            Contribuer à cette fonctionnalité
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Investigation */}
      <div className="max-w-3xl mx-auto mt-8 sm:mt-16 px-2 sm:px-0">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
            Contribuez avec votre expertise (ou juste votre créativité !)
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mb-6">
            Ces fonctionnalités sont en phase d'étude. Votre expérience, vos contacts ou vos idées
            peuvent nous aider à les concrétiser plus rapidement et plus efficacement.
          </p>

          {/* Section "Comment contribuer" */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-2xl mx-auto">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-5 h-5 mt-0.5 text-blue-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-sm text-left">
                <span className="font-medium text-gray-900">Retour d'expérience</span>
                <p className="text-gray-600">Partagez vos expériences similaires</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-5 h-5 mt-0.5 text-blue-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="text-sm text-left">
                <span className="font-medium text-gray-900">Contacts</span>
                <p className="text-gray-600">Mettez-nous en relation avec des experts</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-5 h-5 mt-0.5 text-blue-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="text-sm text-left">
                <span className="font-medium text-gray-900">Idées</span>
                <p className="text-gray-600">Proposez des solutions originales</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-5 h-5 mt-0.5 text-blue-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <div className="text-sm text-left">
                <span className="font-medium text-gray-900">Code</span>
                <p className="text-gray-600">Contribuez au développement</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {features
            .filter((feature) => feature.status === 'investigation')
            .map((feature) => (
              <div
                key={feature.title}
                className="bg-gradient-to-r from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="hidden sm:flex flex-shrink-0 w-12 h-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          {feature.title}
                        </h3>
                        <span className="self-start sm:self-auto px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                          En réflexion
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 mb-4">
                        {feature.description}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <a
                          href={`/feedback?type=investigation&feature=${feature.title.toLowerCase()}`}
                          className="flex-1 inline-flex justify-center items-center px-4 py-2 border-2 border-blue-600 text-blue-700 hover:bg-blue-50 rounded-lg font-medium transition-colors text-sm sm:text-base"
                        >
                          Partager mon expertise
                        </a>
                        <a
                          href={feature.issue}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1 mt-2"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                          </svg>
                          <span>Suivre sur GitHub</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Section Propositions */}
      <div className="max-w-3xl mx-auto mt-8 sm:mt-16 mb-8 sm:mb-16 px-2 sm:px-0">
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Vous avez une expertise à partager ?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-xl">
                Que vous soyez journalistes, chercheurs, développeur, designer, expert en UX ou
                simplement passionné par l'information, votre expérience peut enrichir le projet.
              </p>
            </div>

            <div className="flex sm:flex-col sm:items-end">
              <a
                href="/feedback"
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white text-sm sm:text-base font-medium rounded-lg sm:rounded-xl hover:bg-purple-700 transition-colors"
              >
                <span>Proposer une contribution</span>
                <svg
                  className="w-4 h-4 ml-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ContributionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        feature={selectedFeature}
        amount={targetAmount}
      />
    </div>
  );
};

export default Premium;
