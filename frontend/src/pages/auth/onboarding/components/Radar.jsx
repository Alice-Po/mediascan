import React from 'react';

const Step3Radar = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
          Découvrez de nouvelles sources grâce au Radar
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Exprimez simplement ce qui vous intéresse, nous nous occupons du reste
        </p>
      </div>

      {/* Illustration du concept */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Introduction au Radar */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 sm:p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <span role="img" aria-label="radar" className="text-2xl sm:text-3xl">
                🎯
              </span>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Comment ça marche ?</h3>
                <p className="text-sm text-gray-600">
                  Au lieu d'utiliser des mots-clés, exprimez naturellement ce qui vous intéresse. Le
                  Radar explore ensuite l'ensemble du web, même au-delà de vos sources habituelles,
                  pour vous faire découvrir des contenus pertinents.
                </p>
              </div>
            </div>
          </div>

          {/* Exemple de recherche */}
          <div className="w-full">
            <h3 className="font-medium text-gray-900 mb-2 text-base sm:text-lg">
              Par exemple, dites simplement :
            </h3>
            <div className="bg-white rounded-lg p-3 mb-4 border-2 border-emerald-100">
              <p className="text-xs sm:text-sm text-gray-600 italic">
                "Je veux suivre les expérimentations de culture du bambou en France"
              </p>
            </div>
          </div>

          {/* Exemple de résultat */}
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
            </div>
          </div>

          {/* Avantages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FeatureCard
              icon="🔍"
              title="Découverte intelligente"
              description="Trouvez de nouvelles sources fiables au-delà de vos abonnements"
              color="emerald"
            />
            <FeatureCard
              icon="🎯"
              title="Veille ciblée"
              description="Soyez précis dans votre veille"
              color="emerald"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

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

const FeatureCard = ({ icon, title, description, color }) => (
  <div className={`bg-${color}-50 p-3 sm:p-4 rounded-lg`}>
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

export default Step3Radar;
