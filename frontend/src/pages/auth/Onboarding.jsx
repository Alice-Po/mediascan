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

  // Réduire à 2 étapes au lieu de 3
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

  // Passer à l'étape suivante
  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1);
      setError(null);
    } else {
      completeOnboardingProcess();
    }
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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Bienvenue sur MédiaScan</h1>
          <p className="text-gray-600">Étape {step} sur 2</p>

          {/* Indicateur d'étapes */}
          <div className="flex justify-center mt-4 space-x-2">
            {[1, 2].map((i) => (
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

        {/* Contenu de l'étape */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Vous venez de trouver mieux que Google News
                </h2>
                <span className="text-gray-600">(enfin... on y travaille !)</span>
                <br />
                <br />
                <p className="text-gray-600">
                  Vous arrivez au tout début de l'aventure Médiascan ! Pour l'instant, c'est un
                  simple agrégateur d'actualités avec ses petits bugs. Mais c'est aussi le moment
                  idéal pour façonner son avenir et profiter des meilleures conditions pour devenir
                  membre premium.
                </p>
              </div>

              {/* Ce que vous pouvez faire dès maintenant */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">
                  Ce que vous pouvez faire dès maintenant
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span role="img" aria-label="rss" className="text-xl">
                        📰
                      </span>
                      <p className="text-sm text-blue-800">
                        Centraliser vos sources d'information préférées via leurs flux RSS
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span role="img" aria-label="organize" className="text-xl">
                        🗂️
                      </span>
                      <p className="text-sm text-purple-800">
                        Consulter et filtrer votre fil d'actualités à votre façon
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span role="img" aria-label="share" className="text-xl">
                        🤝
                      </span>
                      <p className="text-sm text-green-800">
                        Participer au financement des futures fonctionnalités qui vous tiennent à
                        cœur
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span role="img" aria-label="feedback" className="text-xl">
                        💡
                      </span>
                      <p className="text-sm text-yellow-800">
                        Nous aider à améliorer l'outil en signalant bugs et suggestions
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Le Médiascan de demain */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Le Médiascan de demain</h3>
                <p className="text-gray-600 mb-4">
                  L'avenir de l'information en ligne est incertain, mais une chose est sûre : nous
                  ne voulons pas dépendre d'investisseurs qui nous pousseraient à monétiser votre
                  attention à tout prix. C'est pourquoi nous développons Médiascan différemment.
                </p>
                <p className="text-gray-600 mb-4">
                  En tant que premiers utilisateurs, vous avez un pouvoir unique : celui d'orienter
                  le développement de Médiascan selon vos besoins réels. Chaque nouvelle
                  fonctionnalité sera développée grâce au financement participatif, et deviendra
                  ensuite accessible via un abonnement premium.
                </p>
                <p className="text-gray-600 font-medium">
                  🌟 Offre early adopter : En participant au financement maintenant, vous devenez
                  premium à vie !
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-700 mt-4">
                  <span role="img" aria-label="build" className="text-base">
                    🏗️
                  </span>
                  <span className="font-medium">
                    <a href="/premium" target="_blank" rel="noopener noreferrer">
                      Découvrir les fonctionnalités en cours de financement
                    </a>
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Personnalisez votre fil d'actualités
              </h2>
              <p className="text-gray-600 mb-6">
                Sélectionnez les sources que vous souhaitez suivre. Vous pourrez modifier vos choix
                à tout moment.
              </p>

              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                {recommendedSources.length > 0 ? (
                  recommendedSources.map((source) => (
                    <SelectableSourceItem
                      key={source._id}
                      source={source}
                      isSelected={selectedSources.includes(source._id)}
                      onToggle={() => toggleSource(source._id)}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Aucune source disponible pour le moment
                  </p>
                )}
              </div>

              <p className="text-sm text-gray-500">
                Les sources qui vous sont proposées sont aléatoires pour l'instant. Vous pourrez
                ajouter d'autres sources plus tard.
              </p>
            </>
          )}
        </div>

        {/* Boutons de navigation */}
        <div className="flex justify-between">
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
            {step === 1 ? 'Commencer' : 'Terminer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
