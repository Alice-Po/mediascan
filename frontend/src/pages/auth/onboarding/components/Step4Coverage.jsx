import React from 'react';

const Step4Coverage = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
          Couverture médiatique complète
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Découvrez différents points de vue sur un même sujet d'actualité
        </p>
      </div>

      {/* Illustration du concept */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Introduction */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <span role="img" aria-label="coverage" className="text-2xl sm:text-3xl">
                📰
              </span>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Vision objective de l'actualité</h3>
                <p className="text-sm text-gray-600">
                  Notre système regroupe automatiquement les articles traitant du même sujet pour
                  vous offrir une vue d'ensemble équilibrée, sans biais de personnalisation.
                </p>
              </div>
            </div>
          </div>

          {/* Exemple de couverture */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-3 border-b border-gray-100">
              <h3 className="font-medium text-gray-900">Elections présidentielles en Roumanie</h3>
              <p className="text-xs text-gray-500 mt-1">5 sources en parlent</p>
            </div>

            <div className="divide-y divide-gray-100">
              {/* Top des actualités */}
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Top des actualités</h4>
                <div className="space-y-4">
                  <ArticleItem
                    source="Le Monde"
                    time="Il y a 6 heures"
                    author="Jean-baptiste Chastand"
                    title="Présidentielle en Roumanie : George Simion, candidat de l'extrême droite, obtient un score écrasant au premier tour"
                  />
                  <ArticleItem
                    source="BFMTV"
                    time="Il y a 14 minutes"
                    author="Léa Ramsamy"
                    title="Inspiré par Trump, fan de TikTok... Qui est George Simion, le candidat d'extrême droite en tête de l'élection présidentielle en Roumanie?"
                  />
                </div>
              </div>

              {/* Interviews */}
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Interviews</h4>
                <div className="space-y-4">
                  <ArticleItem
                    source="BFMTV"
                    time="Il y a 4 heures"
                    title="Le monde qui bouge - L'interview : Roumanie, le nationaliste George Simion en tête - 05/05"
                  />
                  <ArticleItem
                    source="Le JDD"
                    time="Hier"
                    title="EXCLUSIF – George Simion au JDD : «Le système veut voler l'élection en Roumanie»"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Avantages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FeatureCard
              icon="⚖️"
              title="Vision équilibrée"
              description="Accédez à différents points de vue sur un même sujet"
              color="blue"
            />
            <FeatureCard
              icon="🔄"
              title="Mise en contexte"
              description="Suivez l'évolution d'un sujet dans le temps"
              color="blue"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ArticleItem = ({ source, time, author, title }) => (
  <div className="flex gap-4">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium">{source}</span>
        <span className="text-xs text-gray-500">• {time}</span>
      </div>
      <p className="text-sm text-gray-900">{title}</p>
      {author && <p className="text-xs text-gray-500 mt-1">Par {author}</p>}
    </div>
  </div>
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

export default Step4Coverage;
