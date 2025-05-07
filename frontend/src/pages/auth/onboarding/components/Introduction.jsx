import React from 'react';

const Step1Introduction = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
          Bienvenue sur Médiascan !
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Votre nouvel espace d'information personnalisé gratuit.
        </p>
      </div>

      {/* Visualisation des sources */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-4 text-base sm:text-lg">
          Centralisez toutes vos sources d'information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <SourceType icon="📰" title="Médias" description="Journaux, magazines..." color="blue" />
          <SourceType icon="✍️" title="Blogs" description="Articles, analyses..." color="purple" />
          <SourceType
            icon="📧"
            title="Infolettres"
            description="Newsletters, digests..."
            color="green"
          />
          <SocialMediaType />
          <SourceType icon="✨" title="Et plus" description="À venir..." color="gray" />
        </div>
      </div>

      {/* Comment ça marche */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-4 text-base sm:text-lg">Comment ça marche ?</h3>
        <div className="space-y-3 sm:space-y-4">
          <Step number={1} text="Choisissez vos sources d'information préférées" />
          <Step number={2} text="Retrouvez tous vos contenus au même endroit" />
          <Step number={3} text="Organisez vos sources par thèmes et partagez-les" />
        </div>
      </div>
    </div>
  );
};

// Composants utilitaires
const SourceType = ({ icon, title, description, color }) => (
  <div className={`bg-${color}-50 p-3 sm:p-4 rounded-lg hover:bg-${color}-100 transition-colors`}>
    <div className="flex items-start gap-3">
      <span role="img" aria-label={title.toLowerCase()} className="text-xl sm:text-2xl">
        {icon}
      </span>
      <div>
        <p className={`font-medium text-${color}-900 text-sm sm:text-base`}>{title}</p>
        <p className={`text-xs sm:text-sm text-${color}-700`}>{description}</p>
      </div>
    </div>
  </div>
);

const SocialMediaType = () => (
  <div className="bg-orange-50 p-3 sm:p-4 rounded-lg hover:bg-orange-100 transition-colors">
    <div className="flex items-start gap-3">
      <div className="flex gap-1 items-center">
        <span className="w-5 h-5 sm:w-6 sm:h-6">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-full h-full">
            <path
              fill="currentColor"
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            />
          </svg>
        </span>
      </div>
      <div>
        <p className="font-medium text-orange-900 text-sm sm:text-base">Réseaux sociaux</p>
        <p className="text-xs sm:text-sm text-orange-700">X, Bluesky, Mastodon...</p>
      </div>
    </div>
  </div>
);

const Step = ({ number, text }) => (
  <div className="flex items-center gap-3">
    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-medium text-sm sm:text-base">
      {number}
    </div>
    <p className="text-sm sm:text-base text-gray-700">{text}</p>
  </div>
);

export default Step1Introduction;
