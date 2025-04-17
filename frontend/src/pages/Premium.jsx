import React from 'react';

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
          Bientôt disponible
        </span>
      )}
    </div>
  </div>
);

const Premium = () => {
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
      title: 'Intégration des newsletters',
      description:
        "Importez vos newsletters préférées directement dans votre fil d'actualités. Fini les emails qui s'accumulent, retrouvez tout votre contenu au même endroit.",
      comingSoon: true,
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
        'Exprimez un sujet d\'intérêt en langage naturel, nous scannons le web pour vous fournir une veille efficace. Par exemple : "Je cherche des retours d\'expérience sur des SCI citoyennes qui fonctionnent bien"',
      comingSoon: true,
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
      title: 'Ajout de sources illimitées',
      description:
        "La version gratuite de MédiaScan vous permet d'ajouter jusqu'à 3 sources par jour. La version Premium vous permet d'ajouter autant de sources que vous le souhaitez.",
      comingSoon: false,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* En-tête */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Une veille professionnelle accessible au grand public
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          On pourrait tous avoir un outil de veille informationnelle français et de qualité à un
          prix abordable. Reprennez le controle de votre information pour plus de contrôle et moins
          de chaos.
        </p>
      </div>

      {/* Grille des fonctionnalités */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <PremiumFeature key={index} {...feature} />
        ))}
      </div>

      {/* Section prix */}
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Offre de soutien au lancement</h2>
          <div className="text-5xl font-bold mb-4">
            4,99€ <span className="text-lg font-normal">/mois</span>
          </div>
          <p className="text-purple-100">Annulable à tout moment</p>
        </div>

        <div className="p-8">
          <ul className="space-y-4 mb-8">
            <li className="flex items-center text-gray-600">
              <svg
                className="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Toutes les fonctionnalités premium
            </li>
            <li className="flex items-center text-gray-600">
              <svg
                className="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Support prioritaire
            </li>
            <li className="flex items-center text-gray-600">
              <svg
                className="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Mises à jour en avant-première
            </li>
          </ul>

          <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            Commencer maintenant
          </button>

          <p className="text-sm text-gray-500 text-center mt-4">
            Satisfait ou remboursé pendant 30 jours
          </p>
        </div>
      </div>

      {/* Nouvelle section feedback */}
      <div className="max-w-2xl mx-auto mt-16 text-center">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Aidez-nous à construire le bon modèle
          </h3>
          <p className="text-blue-700 mb-4">
            C'est trop cher ? Une fonctionnalité vous manque pour être convaincu ? Nous sommes à
            l'écoute de vos suggestions pour construire une offre qui correspond à vos besoins.
          </p>
          <a
            href="/feedback"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            Partagez votre avis
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* FAQ */}
      {/* <div className="max-w-2xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Questions fréquentes</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Comment fonctionne l'intégration des newsletters ?
            </h3>
            <p className="text-gray-600">
              Il vous suffit d'ajouter l'adresse email dédiée à votre compte et de transférer vos
              newsletters préférées. Elles seront automatiquement intégrées à votre fil
              d'actualités.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Puis-je annuler à tout moment ?
            </h3>
            <p className="text-gray-600">
              Oui, vous pouvez annuler votre abonnement à tout moment. Vous continuerez à bénéficier
              des fonctionnalités premium jusqu'à la fin de votre période de facturation.
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Premium;
