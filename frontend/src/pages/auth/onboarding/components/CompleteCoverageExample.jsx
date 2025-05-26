import React from 'react';
import Accordion from '../../../../components/common/Accordion';

const CompleteCoverageExample = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-4">Exemple de couverture complète</h3>

        {/* Sujet d'actualité mis en valeur */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6 border border-purple-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shrink-0">
              <span className="text-xl">📰</span>
            </div>
            <div>
              <div className="text-sm font-medium text-purple-600 mb-1">Sujet d'actualité</div>
              <h4 className="text-lg font-semibold text-gray-900">
                La prolifération des chats errants non castrés en zones urbaines
              </h4>
            </div>
          </div>
        </div>

        {/* Liste des accordions pour chaque perspective */}
        <div className="space-y-2">
          <Accordion
            title={
              <div>
                <span className="block text-xs opacity-80">AFP</span>
                <span className="block">Alerte parlementaire</span>
              </div>
            }
            titleClassName="text-left"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mb-4">
                <span className="text-xl">📰</span>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">
                Une mission parlementaire lance l'alerte sur la prolifération des chats errants
              </h4>

              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium">Agence France Presse</span>
                <span className="mx-2">•</span>
                <span>06/05/2025</span>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700">
                <p>
                  La mission d'information parlementaire sur la condition animale a présenté hier
                  son rapport sur la gestion des populations de chats errants en France. Selon ce
                  rapport, le nombre de chats errants aurait augmenté de 35% en cinq ans, atteignant
                  près de 13 millions d'individus sur le territoire. Le rapport recommande un plan
                  national de stérilisation et un renforcement des sanctions contre l'abandon.
                </p>
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
          </Accordion>

          <Accordion
            title={
              <div>
                <span className="block text-xs opacity-80">Reporterre</span>
                <span className="block">Impact biodiversité</span>
              </div>
            }
            titleClassName="text-left"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                <span className="text-xl">🌿</span>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">
                Une catastrophe silencieuse pour la biodiversité
              </h4>

              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium">Reporterre</span>
                <span className="mx-2">•</span>
                <span>05/05/2025</span>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700">
                <p>
                  Les chats errants seraient responsables de la disparition de plus de 40 espèces
                  d'oiseaux et de petits mammifères en France. Notre enquête révèle l'impact
                  dévastateur de ces prédateurs sur la faune locale, particulièrement dans les zones
                  périurbaines et les espaces naturels sensibles. Les associations écologistes
                  dénoncent l'inaction des pouvoirs publics face à ce qu'elles qualifient de
                  'catastrophe écologique silencieuse'.
                </p>
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
          </Accordion>

          <Accordion
            title={
              <div>
                <span className="block text-xs opacity-80">Le Figaro</span>
                <span className="block">Irresponsabilité</span>
              </div>
            }
            titleClassName="text-left"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <span className="text-xl">🏛️</span>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">
                Chats errants : quand l'irresponsabilité des propriétaires devient un fléau
                collectif
              </h4>

              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium">Le Figaro</span>
                <span className="mx-2">•</span>
                <span>04/05/2025</span>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700">
                <p>
                  L'explosion du nombre de chats errants révèle une déresponsabilisation croissante
                  des propriétaires d'animaux domestiques. Entre abandons, refus de stérilisation et
                  négligence, notre société paie le prix d'une relation déséquilibrée à l'animal de
                  compagnie. Notre éditorialiste analyse ce phénomène comme le symptôme d'une
                  société qui revendique des droits sans assumer les devoirs correspondants.
                </p>
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
          </Accordion>

          <Accordion
            title={
              <div>
                <span className="block text-xs opacity-80">CNews</span>
                <span className="block">Attaque à Marseille</span>
              </div>
            }
            titleClassName="text-left"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
                <span className="text-xl">⚠️</span>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">
                Une octogénaire attaquée par une meute de chats errants à Marseille
              </h4>

              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium">CNews</span>
                <span className="mx-2">•</span>
                <span>03/05/2025</span>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700">
                <p>
                  Jeanne Martin, 82 ans, a été hospitalisée hier après avoir été attaquée par une
                  dizaine de chats errants alors qu'elle nourrissait les oiseaux dans un parc
                  marseillais. "Ils sont devenus agressifs, comme organisés", témoigne la victime.
                  Le maire de l'arrondissement a ordonné une opération de capture dans le quartier
                  et dénonce "l'ensauvagement" de ces animaux livrés à eux-mêmes.
                </p>
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
          </Accordion>

          <Accordion
            title={
              <div>
                <span className="block text-xs opacity-80">Le Média</span>
                <span className="block">Business vétérinaire</span>
              </div>
            }
            titleClassName="text-left"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
                <span className="text-xl">🔍</span>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">
                Derrière la 'crise des chats errants', un business juteux pour l'industrie
                vétérinaire
              </h4>

              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium">Le Média</span>
                <span className="mx-2">•</span>
                <span>06/05/2025</span>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700">
                <p>
                  Notre enquête révèle comment l'industrie vétérinaire et les fabricants d'aliments
                  pour animaux instrumentalisent la problématique des chats errants pour promouvoir
                  un marché de la stérilisation estimé à 2,5 milliards d'euros annuels. Des
                  documents internes montrent comment ces lobbies ont influencé le récent rapport
                  parlementaire, tout en occultant les alternatives non-chirurgicales à la
                  stérilisation.
                </p>
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
          </Accordion>

          <Accordion
            title={
              <div>
                <span className="block text-xs opacity-80">Ouest-France</span>
                <span className="block">Programme à Nantes</span>
              </div>
            }
            titleClassName="text-left"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 mb-4">
                <span className="text-xl">🏙️</span>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">
                À Nantes, un programme pilote de stérilisation divise par deux la population féline
                errante
              </h4>

              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium">Ouest-France</span>
                <span className="mx-2">•</span>
                <span>02/05/2025</span>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700">
                <p>
                  La métropole nantaise présente les résultats de son programme 'Chats libres' après
                  trois ans d'expérimentation. Grâce à la collaboration entre municipalités,
                  associations et vétérinaires, plus de 15 000 chats ont été stérilisés puis
                  relâchés, réduisant significativement leur population tout en améliorant leur état
                  sanitaire. Un modèle qui inspire désormais d'autres grandes villes françaises.
                </p>
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
          </Accordion>

          <Accordion
            title={
              <div>
                <span className="block text-xs opacity-80">Sciences et Avenir</span>
                <span className="block">Innovation contraceptive</span>
              </div>
            }
            titleClassName="text-left"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                <span className="text-xl">💡</span>
              </div>

              <h4 className="font-bold text-gray-900 text-lg">
                La contraception féline non-chirurgicale, une révolution pour gérer les populations
                de chats errants ?
              </h4>

              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium">Sciences et Avenir</span>
                <span className="mx-2">•</span>
                <span>01/05/2025</span>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700">
                <p>
                  Des chercheurs de l'INRAE ont développé un vaccin contraceptif réversible pour les
                  chats, administrable par simple injection. Cette innovation pourrait révolutionner
                  la gestion des populations félines errantes à moindre coût. Les premiers essais,
                  menés dans plusieurs communes rurales, montrent une efficacité de 95% pendant
                  trois ans.
                </p>
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
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default CompleteCoverageExample;
