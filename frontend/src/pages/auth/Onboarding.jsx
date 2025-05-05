import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { fetchAllSources } from '../../api/sourcesApi';
import { completeOnboarding } from '../../api/authApi';
import { SelectableSourceItem } from '../../components/sources/SourceItem';

/**
 * Page d'onboarding pour les nouveaux utilisateurs
 */
const Onboarding = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Réduire à 5 étapes au lieu de 3
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Garder uniquement les sources
  const [selectedSources, setSelectedSources] = useState([]);
  const [allSources, setAllSources] = useState([]);

  // Vérifier si l'utilisateur a déjà complété l'onboarding
  useEffect(() => {
    if (user && user.onboardingCompleted) {
      navigate('/');
    }
  }, [user, navigate]);

  // Charger les sources disponibles
  useEffect(() => {
    const loadSources = async () => {
      try {
        const sources = await fetchAllSources();
        // Vérifier que sources est bien un tableau
        if (Array.isArray(sources)) {
          setAllSources(sources);
        } else if (sources.data && Array.isArray(sources.data)) {
          setAllSources(sources.data);
        } else {
          console.error('Sources received is not an array:', sources);
          setAllSources([]);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des sources:', err);
        setError('Erreur lors du chargement des sources');
        setAllSources([]);
      }
    };

    loadSources();
  }, []);

  // Ajouter un useEffect pour initialiser les sources sélectionnées quand allSources est chargé
  useEffect(() => {
    if (Array.isArray(allSources) && allSources.length > 0) {
      // Présélectionner toutes les sources
      const allSourceIds = allSources.map((source) => source._id);
      setSelectedSources(allSourceIds);
    }
  }, [allSources]); // Dépendance à allSources pour ne s'exécuter qu'une fois au chargement des sources

  // Toggle pour une source
  const toggleSource = (sourceId) => {
    console.log('Toggling source:', sourceId);
    console.log('Current selectedSources:', selectedSources);
    console.log(
      'Source object:',
      allSources.find((s) => s._id === sourceId)
    );

    if (selectedSources.includes(sourceId)) {
      console.log('Removing source');
      setSelectedSources((prev) => {
        const newSelection = prev.filter((id) => id !== sourceId);
        console.log('New selection after removal:', newSelection);
        return newSelection;
      });
    } else {
      console.log('Adding source');
      setSelectedSources((prev) => {
        const newSelection = [...prev, sourceId];
        console.log('New selection after addition:', newSelection);
        return newSelection;
      });
    }
  };

  // Ajouter en haut du composant, après les states
  const titleRef = React.useRef(null);

  // Modifier la fonction nextStep
  const nextStep = async () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    } else {
      if (selectedSources.length < 3) {
        setError('Veuillez sélectionner au moins 3 sources pour continuer.');
        return;
      }
      completeOnboardingProcess();
    }

    // Scroll doux vers le titre après le changement d'étape
    setTimeout(() => {
      titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Revenir à l'étape précédente
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null);
    }
  };

  // Terminer le processus d'onboarding
  const completeOnboardingProcess = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('État final avant envoi:', {
        selectedSources,
        recommendedSources: recommendedSources.map((s) => ({
          id: s._id,
          name: s.name,
        })),
      });

      const sourcesToSend =
        selectedSources.length > 0 ? selectedSources : recommendedSources.map((s) => s._id);

      const dataToSend = {
        sources: sourcesToSend,
      };

      console.log('Données à envoyer au serveur:', dataToSend);

      const userData = await completeOnboarding(dataToSend);

      if (userData.user) {
        updateUser({
          ...user,
          ...userData.user,
          onboardingCompleted: true,
        });
      }

      navigate('/');
    } catch (err) {
      console.error('Erreur:', err);
      setError("Erreur lors de la finalisation de l'onboarding");
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les sources recommandées basées sur les catégories sélectionnées
  const recommendedSources = Array.isArray(allSources) ? allSources.slice(0, 20) : [];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8" ref={titleRef}>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Bienvenue sur MédiaScan</h1>
          <p className="text-gray-600">Étape {step} sur 5</p>

          {/* Indicateur d'étapes */}
          <div className="flex justify-center mt-4 space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  i === step ? 'bg-blue-600 scale-110' : i < step ? 'bg-blue-400' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Message d'erreur */}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}

        {/* Contenu principal */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Contenu des différentes étapes */}
          {step === 1 && (
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
                  {/* Médias */}
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="flex items-start gap-3">
                      <span role="img" aria-label="newspaper" className="text-xl sm:text-2xl">
                        📰
                      </span>
                      <div>
                        <p className="font-medium text-blue-900 text-sm sm:text-base">Médias</p>
                        <p className="text-xs sm:text-sm text-blue-700">Journaux, magazines...</p>
                      </div>
                    </div>
                  </div>

                  {/* Blogs */}
                  <div className="bg-purple-50 p-3 sm:p-4 rounded-lg hover:bg-purple-100 transition-colors">
                    <div className="flex items-start gap-3">
                      <span role="img" aria-label="blog" className="text-xl sm:text-2xl">
                        ✍️
                      </span>
                      <div>
                        <p className="font-medium text-purple-900 text-sm sm:text-base">Blogs</p>
                        <p className="text-xs sm:text-sm text-purple-700">Articles, analyses...</p>
                      </div>
                    </div>
                  </div>

                  {/* Infolettres */}
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg hover:bg-green-100 transition-colors">
                    <div className="flex items-start gap-3">
                      <span role="img" aria-label="newsletter" className="text-xl sm:text-2xl">
                        📧
                      </span>
                      <div>
                        <p className="font-medium text-green-900 text-sm sm:text-base">
                          Infolettres
                        </p>
                        <p className="text-xs sm:text-sm text-green-700">Newsletters, digests...</p>
                      </div>
                    </div>
                  </div>

                  {/* Réseaux sociaux */}
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
                        <p className="font-medium text-orange-900 text-sm sm:text-base">
                          Réseaux sociaux
                        </p>
                        <p className="text-xs sm:text-sm text-orange-700">
                          X, Bluesky, Mastodon...
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Et plus */}
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start gap-3">
                      <span role="img" aria-label="more" className="text-xl sm:text-2xl">
                        ✨
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">Et plus</p>
                        <p className="text-xs sm:text-sm text-gray-700">À venir...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment ça marche */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4 text-base sm:text-lg">
                  Comment ça marche ?
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-medium text-sm sm:text-base">
                      1
                    </div>
                    <p className="text-sm sm:text-base text-gray-700">
                      Choisissez vos sources d'information préférées
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-medium text-sm sm:text-base">
                      2
                    </div>
                    <p className="text-sm sm:text-base text-gray-700">
                      Retrouvez tous vos contenus au même endroit
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-medium text-sm sm:text-base">
                      3
                    </div>
                    <p className="text-sm sm:text-base text-gray-700">
                      Organisez vos sources par thèmes et partagez-les
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
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
                          Créez des collections de sources sur vos sujets favoris et partagez votre
                          expertise.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 sm:px-3 py-1 bg-white rounded-full text-xs sm:text-sm text-purple-700">
                            Inspirer les communes rurales
                          </span>
                          <span className="px-2 sm:px-3 py-1 bg-white rounded-full text-xs sm:text-sm text-blue-700">
                            IA & innovation
                          </span>
                          <span className="px-2 sm:px-3 py-1 bg-white rounded-full text-xs sm:text-sm text-green-700">
                            En ce moment au potager
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Exemples d'utilisation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <span
                          role="img"
                          aria-label="share"
                          className="text-xl sm:text-2xl shrink-0"
                        >
                          🔍
                        </span>
                        <div>
                          <p className="font-medium text-blue-900 text-sm sm:text-base">
                            Veille collaborative
                          </p>
                          <p className="text-xs sm:text-sm text-blue-700">
                            Construisez et partagez des bibliographies avec vos collègues
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <span
                          role="img"
                          aria-label="share"
                          className="text-xl sm:text-2xl shrink-0"
                        >
                          🤝
                        </span>
                        <div>
                          <p className="font-medium text-purple-900 text-sm sm:text-base">
                            Partage d'expertise
                          </p>
                          <p className="text-xs sm:text-sm text-purple-700">
                            Partagez vos connaissances et inspirez votre communauté
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Citation exemple */}
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-center italic text-xs sm:text-sm text-gray-600">
                    "La bibliographie de Sarah sur les innovations foncières est devenue une
                    référence incontournable !"
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
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
                        <p className="text-sm text-gray-600 mb-4">
                          Au lieu d'utiliser des mots-clés, exprimez naturellement ce qui vous
                          intéresse. Le Radar explore ensuite l'ensemble du web, même au-delà de vos
                          sources habituelles, pour vous faire découvrir des contenus pertinents.
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
                    <p className="text-xs sm:text-sm text-gray-500">
                      Le Radar comprend votre intention et cherche les informations pertinentes dans
                      toutes les sources disponibles
                    </p>
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
                          <p className="text-sm text-gray-500 mb-3">
                            Ouest-France • Il y a 2 heures
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        La célèbre ferme biologique normande inaugure un nouvel espace dédié à
                        l'expérimentation de la culture du bambou. Ce projet innovant vise à étudier
                        l'adaptation de différentes variétés de bambou au climat normand et leur
                        potentiel pour la construction durable.
                      </p>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
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
                          Le Bec-Hellouin, Normandie
                        </span>
                        <span>•</span>
                        <span className="text-emerald-600">
                          Correspond à votre recherche sur le bambou
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Avantages */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-emerald-50 p-3 sm:p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <span
                          role="img"
                          aria-label="discover"
                          className="text-xl sm:text-2xl shrink-0"
                        >
                          🔍
                        </span>
                        <div>
                          <p className="font-medium text-emerald-900 text-sm sm:text-base">
                            Découverte intelligente
                          </p>
                          <p className="text-xs sm:text-sm text-emerald-700">
                            Trouvez de nouvelles sources fiables au-delà de vos abonnements
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 p-3 sm:p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <span
                          role="img"
                          aria-label="natural"
                          className="text-xl sm:text-2xl shrink-0"
                        >
                          🎯
                        </span>
                        <div>
                          <p className="font-medium text-emerald-900 text-sm sm:text-base">
                            Veille ciblée
                          </p>
                          <p className="text-xs sm:text-sm text-emerald-700">
                            Soyez précis dans votre veille
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
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
                        <h3 className="font-medium text-gray-900 mb-2">
                          Vision objective de l'actualité
                        </h3>
                        <p className="text-sm text-gray-600">
                          Notre système regroupe automatiquement les articles traitant du même sujet
                          pour vous offrir une vue d'ensemble équilibrée, sans biais de
                          personnalisation.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Exemple de couverture */}
                  <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-3 border-b border-gray-100">
                      <h3 className="font-medium text-gray-900 text-lg">
                        Elections présidentielles en Roumanie
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">5 sources en parlent</p>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {/* Top des actualités */}
                      <div className="p-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-3">
                          Top des actualités
                        </h4>

                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">Le Monde</span>
                                <span className="text-xs text-gray-500">• Il y a 6 heures</span>
                              </div>
                              <p className="text-sm text-gray-900">
                                Présidentielle en Roumanie : George Simion, candidat de l'extrême
                                droite, obtient un score écrasant au premier tour
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Par Jean-baptiste Chastand
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">BFMTV</span>
                                <span className="text-xs text-gray-500">• Il y a 14 minutes</span>
                              </div>
                              <p className="text-sm text-gray-900">
                                Inspiré par Trump, fan de TikTok... Qui est George Simion, le
                                candidat d'extrême droite en tête de l'élection présidentielle en
                                Roumanie?
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Par Léa Ramsamy</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Interviews */}
                      <div className="p-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-3">Interviews</h4>

                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">BFMTV</span>
                                <span className="text-xs text-gray-500">• Il y a 4 heures</span>
                              </div>
                              <p className="text-sm text-gray-900">
                                Le monde qui bouge - L'interview : Roumanie, le nationaliste George
                                Simion en tête - 05/05
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">Le JDD</span>
                                <span className="text-xs text-gray-500">• Hier</span>
                              </div>
                              <p className="text-sm text-gray-900">
                                EXCLUSIF – George Simion au JDD : «Le système veut voler l'élection
                                en Roumanie»
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Avantages */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <span
                          role="img"
                          aria-label="balance"
                          className="text-xl sm:text-2xl shrink-0"
                        >
                          ⚖️
                        </span>
                        <div>
                          <p className="font-medium text-blue-900 text-sm sm:text-base">
                            Vision équilibrée
                          </p>
                          <p className="text-xs sm:text-sm text-blue-700">
                            Accédez à différents points de vue sur un même sujet
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <span role="img" aria-label="time" className="text-xl sm:text-2xl shrink-0">
                          🔄
                        </span>
                        <div>
                          <p className="font-medium text-blue-900 text-sm sm:text-base">
                            Mise en contexte
                          </p>
                          <p className="text-xs sm:text-sm text-blue-700">
                            Suivez l'évolution d'un sujet dans le temps
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Personnalisez votre fil d'actualités
              </h2>
              <p className="text-gray-600 mb-4 text-sm">
                Sélectionnez au moins 3 sources pour commencer. Vous pourrez en ajouter d'autres
                plus tard.
              </p>

              {/* Compteur de sources sélectionnées */}
              <div className="mb-4 text-sm text-center">
                <span className="font-medium">
                  {selectedSources.length} source{selectedSources.length > 1 ? 's' : ''}{' '}
                  sélectionnée{selectedSources.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Liste des sources */}
              <div className="space-y-2 mb-4 max-h-[60vh] overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 p-2">
                {recommendedSources.length > 0 ? (
                  <div className="grid gap-2">
                    {recommendedSources.map((source) => (
                      <SelectableSourceItem
                        key={source._id}
                        source={source}
                        isSelected={selectedSources.includes(source._id)}
                        onToggle={() => toggleSource(source._id)}
                        compact={true}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Aucune source disponible pour le moment
                  </p>
                )}
              </div>

              {/* Note d'information */}
              <p className="text-xs text-gray-500 text-center">
                Les sources sont présentées de manière aléatoire. Vous pourrez affiner vos choix
                plus tard depuis votre profil.
              </p>
            </>
          )}

          {/* Boutons de navigation */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-4 py-2 rounded-md font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Précédent
              </button>
            )}

            <button
              onClick={nextStep}
              className={`px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 ${
                step === 1 ? 'ml-auto' : ''
              }`}
            >
              {step === 1
                ? 'Suivant'
                : step === 2
                ? 'Suivant'
                : step === 3
                ? 'Suivant'
                : step === 4
                ? 'Suivant'
                : 'Terminer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
