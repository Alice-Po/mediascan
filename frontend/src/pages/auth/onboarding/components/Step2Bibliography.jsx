import React from 'react';

const Step2Bibliography = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
          Créez et partagez des bibliographies thématiques
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Comme une playlist Spotify, mais pour vos sources d'information !
        </p>
      </div>

      {/* Illustration du concept */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Exemple de bibliographie */}
          <BibliographyExample />

          {/* Exemples d'utilisation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FeatureCard
              icon="🔍"
              title="Veille collaborative"
              description="Construisez et partagez des bibliographies avec vos collègues"
              color="blue"
            />
            <FeatureCard
              icon="🤝"
              title="Partage d'expertise"
              description="Partagez vos connaissances et inspirez votre communauté"
              color="purple"
            />
          </div>

          {/* Citation exemple */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-center italic text-xs sm:text-sm text-gray-600">
            "La bibliographie de Sarah sur les innovations foncières est devenue une référence
            incontournable !"
          </div>
        </div>
      </div>
    </div>
  );
};

const BibliographyExample = () => (
  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 sm:p-6 rounded-xl">
    <div className="flex flex-col sm:flex-row items-start gap-4">
      <div className="p-2 sm:p-3 bg-white rounded-lg shrink-0">
        <span role="img" aria-label="books" className="text-2xl sm:text-3xl">
          📚
        </span>
      </div>
      <div className="w-full">
        <h3 className="font-medium text-gray-900 mb-2 text-base sm:text-lg">
          Bibliographies collaboratives
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-4">
          Créez des collections de sources sur vos sujets favoris et partagez votre expertise.
        </p>
        <div className="flex flex-wrap gap-2">
          <Tag text="Inspirer les communes rurales" color="purple" />
          <Tag text="IA & innovation" color="blue" />
          <Tag text="En ce moment au potager" color="green" />
        </div>
      </div>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, description, color }) => (
  <div className={`bg-${color}-50 p-3 sm:p-4 rounded-lg`}>
    <div className="flex items-start gap-3">
      <span role="img" aria-label="share" className="text-xl sm:text-2xl shrink-0">
        {icon}
      </span>
      <div>
        <p className={`font-medium text-${color}-900 text-sm sm:text-base`}>{title}</p>
        <p className={`text-xs sm:text-sm text-${color}-700`}>{description}</p>
      </div>
    </div>
  </div>
);

const Tag = ({ text, color }) => (
  <span className={`px-2 sm:px-3 py-1 bg-white rounded-full text-xs sm:text-sm text-${color}-700`}>
    {text}
  </span>
);

export default Step2Bibliography;
