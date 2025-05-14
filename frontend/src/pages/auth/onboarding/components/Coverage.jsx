import React, { useState, useEffect } from 'react';

const Step4Coverage = ({ onValidationChange }) => {
  const [activeTab, setActiveTab] = useState('main');

  // Cette étape est toujours valide, informer le parent
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(true);
    }
  }, [onValidationChange]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* En-tête avec animation */}
      <div className="text-center relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
            Fonctionnalité "Couverture complète"
          </h2>
          <p className="text-sm sm:text-base text-purple-100">
            Découvrez toutes les facettes d'un sujet d'actualité
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-xs font-medium">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1.5"></span>Finançable
            </span>
          </div>
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-pink-500 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-500 rounded-full opacity-50 blur-xl"></div>
      </div>

      {/* Présentation du concept */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg">
          Comprendre un sujet sous tous ses angles
        </h3>
        <p className="text-gray-700 mb-6">
          La fonctionnalité "Couverture complète" vous permet d'explorer un sujet d'actualité à
          travers différentes approches journalistiques. Découvrez comment un même événement peut
          être traité selon diverses perspectives : écologique, sociétale, critique, locale ou
          orientée solutions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <FeatureCard
            icon="🔍"
            title="Vision complète"
            description="Accédez à toutes les facettes d'un sujet pour vous forger votre propre opinion"
            color="purple"
          />
          <FeatureCard
            icon="🧩"
            title="Diversité des sources"
            description="Consultez des médias aux approches et sensibilités variées"
            color="pink"
          />
          <FeatureCard
            icon="💡"
            title="Contextualisation"
            description="Comprenez les enjeux et les différentes interprétations d'un même fait"
            color="indigo"
          />
        </div>
      </div>

      {/* Exemple concret */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            Exemple de couverture complète
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Sujet d'actualité : La prolifération des chats errants non castrés en zones urbaines
          </p>

          {/* Navigation entre les perspectives */}
          <div className="flex flex-wrap gap-2 mb-4">
            <PerspectiveTab
              id="main"
              active={activeTab === 'main'}
              onClick={() => setActiveTab('main')}
              label="Actualité principale"
              source="AFP"
            />
            <PerspectiveTab
              id="eco"
              active={activeTab === 'eco'}
              onClick={() => setActiveTab('eco')}
              label="Perspective écologique"
              source="Reporterre"
            />
            <PerspectiveTab
              id="faits"
              active={activeTab === 'faits'}
              onClick={() => setActiveTab('faits')}
              label="Faits divers"
              source="CNews"
            />
            <PerspectiveTab
              id="societe"
              active={activeTab === 'societe'}
              onClick={() => setActiveTab('societe')}
              label="Analyse sociétale"
              source="Le Figaro"
            />
            <PerspectiveTab
              id="critique"
              active={activeTab === 'critique'}
              onClick={() => setActiveTab('critique')}
              label="Approche critique"
              source="Le Média"
            />
            <PerspectiveTab
              id="local"
              active={activeTab === 'local'}
              onClick={() => setActiveTab('local')}
              label="Perspective locale"
              source="Ouest-France"
            />
            <PerspectiveTab
              id="solution"
              active={activeTab === 'solution'}
              onClick={() => setActiveTab('solution')}
              label="Solutions et innovations"
              source="Sciences et Avenir"
            />
          </div>
        </div>

        {/* Contenu de la perspective sélectionnée */}
        <div className="p-5 bg-white">
          {activeTab === 'main' && (
            <ArticleView
              title="Une mission parlementaire lance l'alerte sur la prolifération des chats errants"
              source="Agence France Presse"
              date="06/05/2025"
              content="La mission d'information parlementaire sur la condition animale a présenté hier son rapport sur la gestion des populations de chats errants en France. Selon ce rapport, le nombre de chats errants aurait augmenté de 35% en cinq ans, atteignant près de 13 millions d'individus sur le territoire. Le rapport recommande un plan national de stérilisation et un renforcement des sanctions contre l'abandon."
              icon="📰"
              color="gray"
            />
          )}

          {activeTab === 'eco' && (
            <ArticleView
              title="Une catastrophe silencieuse pour la biodiversité"
              source="Reporterre"
              date="05/05/2025"
              content="Les chats errants seraient responsables de la disparition de plus de 40 espèces d'oiseaux et de petits mammifères en France. Notre enquête révèle l'impact dévastateur de ces prédateurs sur la faune locale, particulièrement dans les zones périurbaines et les espaces naturels sensibles. Les associations écologistes dénoncent l'inaction des pouvoirs publics face à ce qu'elles qualifient de 'catastrophe écologique silencieuse'."
              icon="🌿"
              color="green"
            />
          )}

          {activeTab === 'faits' && (
            <ArticleView
              title="Une octogénaire attaquée par une meute de chats errants à Marseille"
              source="CNews"
              date="03/05/2025"
              content="Jeanne Martin, 82 ans, a été hospitalisée hier après avoir été attaquée par une dizaine de chats errants alors qu'elle nourrissait les oiseaux dans un parc marseillais. 'Ils sont devenus agressifs, comme organisés', témoigne la victime. Le maire de l'arrondissement a ordonné une opération de capture dans le quartier et dénonce 'l'ensauvagement' de ces animaux livrés à eux-mêmes."
              icon="⚠️"
              color="red"
            />
          )}

          {activeTab === 'societe' && (
            <ArticleView
              title="Chats errants : quand l'irresponsabilité des propriétaires devient un fléau collectif"
              source="Le Figaro"
              date="04/05/2025"
              content="L'explosion du nombre de chats errants révèle une déresponsabilisation croissante des propriétaires d'animaux domestiques. Entre abandons, refus de stérilisation et négligence, notre société paie le prix d'une relation déséquilibrée à l'animal de compagnie. Notre éditorialiste analyse ce phénomène comme le symptôme d'une société qui revendique des droits sans assumer les devoirs correspondants."
              icon="🏛️"
              color="blue"
            />
          )}

          {activeTab === 'critique' && (
            <ArticleView
              title="Derrière la 'crise des chats errants', un business juteux pour l'industrie vétérinaire"
              source="Le Média"
              date="06/05/2025"
              content="Notre enquête révèle comment l'industrie vétérinaire et les fabricants d'aliments pour animaux instrumentalisent la problématique des chats errants pour promouvoir un marché de la stérilisation estimé à 2,5 milliards d'euros annuels. Des documents internes montrent comment ces lobbies ont influencé le récent rapport parlementaire, tout en occultant les alternatives non-chirurgicales à la stérilisation."
              icon="🔍"
              color="amber"
            />
          )}

          {activeTab === 'local' && (
            <ArticleView
              title="À Nantes, un programme pilote de stérilisation divise par deux la population féline errante"
              source="Ouest-France"
              date="02/05/2025"
              content="La métropole nantaise présente les résultats de son programme 'Chats libres' après trois ans d'expérimentation. Grâce à la collaboration entre municipalités, associations et vétérinaires, plus de 15 000 chats ont été stérilisés puis relâchés, réduisant significativement leur population tout en améliorant leur état sanitaire. Un modèle qui inspire désormais d'autres grandes villes françaises."
              icon="🏙️"
              color="cyan"
            />
          )}

          {activeTab === 'solution' && (
            <ArticleView
              title="La contraception féline non-chirurgicale, une révolution pour gérer les populations de chats errants ?"
              source="Sciences et Avenir"
              date="01/05/2025"
              content="Des chercheurs de l'INRAE ont développé un vaccin contraceptif réversible pour les chats, administrable par simple injection. Cette innovation pourrait révolutionner la gestion des populations félines errantes à moindre coût. Les premiers essais, menés dans plusieurs communes rurales, montrent une efficacité de 95% pendant trois ans."
              icon="💡"
              color="purple"
            />
          )}
        </div>

        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <span className="text-sm text-gray-700">
                Explorez les différentes perspectives en cliquant sur les onglets ci-dessus
              </span>
            </div>
            <span className="text-xs text-purple-600 font-medium">7 perspectives disponibles</span>
          </div>
        </div>
      </div>

      {/* Explication des bénéfices */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg text-center">
          Les bénéfices de la fonctionnalité "Couverture complète"
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BenefitCard
            title="Information équilibrée"
            description="Évitez les biais d'information en consultant différentes sources et approches journalistiques"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                ></path>
              </svg>
            }
          />
          <BenefitCard
            title="Esprit critique"
            description="Développez votre capacité à analyser et comparer différentes interprétations d'un même fait"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                ></path>
              </svg>
            }
          />
          <BenefitCard
            title="Contextualisation"
            description="Replacez l'actualité dans son contexte plus large pour mieux comprendre les enjeux"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            }
          />
          <BenefitCard
            title="Découverte de solutions"
            description="Accédez aux innovations et solutions proposées face aux problématiques d'actualité"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                ></path>
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
};

// Composant pour les onglets de perspective
const PerspectiveTab = ({ id, active, onClick, label, source }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      active ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    <span className="block text-xs opacity-80">{source}</span>
    <span>{label}</span>
  </button>
);

// Composant pour afficher un article
const ArticleView = ({ title, source, date, content, icon, color }) => (
  <div className="space-y-3">
    <div
      className={`w-12 h-12 rounded-full bg-${color}-100 flex items-center justify-center text-${color}-600 mb-4`}
    >
      <span className="text-xl">{icon}</span>
    </div>

    <h4 className="font-bold text-gray-900 text-lg">{title}</h4>

    <div className="flex items-center text-sm text-gray-500">
      <span className="font-medium">{source}</span>
      <span className="mx-2">•</span>
      <span>{date}</span>
    </div>

    <div className="prose prose-sm max-w-none text-gray-700">
      <p>{content}</p>
    </div>

    <div className="pt-3 flex justify-between items-center border-t border-gray-100 mt-4">
      <div className="flex space-x-2">
        <button className="text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            ></path>
          </svg>
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            ></path>
          </svg>
        </button>
      </div>
      <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
        Lire l'article complet
      </button>
    </div>
  </div>
);

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

// Composant pour les cartes de bénéfices
const BenefitCard = ({ title, description, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-3">
      <div className="text-purple-600 shrink-0 mt-0.5 bg-purple-50 p-2 rounded-lg">{icon}</div>
      <div>
        <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-700">{description}</p>
      </div>
    </div>
  </div>
);

export default Step4Coverage;
