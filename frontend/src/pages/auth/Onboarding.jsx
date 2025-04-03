import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { fetchAllSources } from '../../api/sourcesApi';
import { completeOnboarding } from '../../api/authApi';

/**
 * Page d'onboarding pour les nouveaux utilisateurs
 */
const Onboarding = () => {
  console.log('Onboarding component rendering');

  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // State pour suivre les étapes de l'onboarding
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State pour les données du formulaire
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);

  // Données disponibles
  const [allSources, setAllSources] = useState([]);

  // Liste de catégories disponibles
  const categories = [
    'politique',
    'économie',
    'international',
    'société',
    'culture',
    'sport',
    'sciences',
    'tech',
    'environnement',
    'santé',
  ];

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
        console.log('Fetching sources...');
        const sources = await fetchAllSources();
        console.log('Received sources:', sources);
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

  useEffect(() => {
    console.log('Onboarding mounted with user:', user);
  }, []);

  // Toggle pour une catégorie
  const toggleCategory = (category) => {
    console.log('Toggle catégorie:', category);
    console.log('Catégories actuelles:', selectedCategories);

    if (selectedCategories.includes(category)) {
      const newCategories = selectedCategories.filter((c) => c !== category);
      console.log('Nouvelles catégories après suppression:', newCategories);
      setSelectedCategories(newCategories);
    } else {
      if (selectedCategories.length < 10) {
        const newCategories = [...selectedCategories, category];
        console.log('Nouvelles catégories après ajout:', newCategories);
        setSelectedCategories(newCategories);
      }
    }
  };

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
    // Validation pour chaque étape
    if (step === 1 && selectedCategories.length === 0) {
      setError('Veuillez sélectionner au moins une catégorie');
      return;
    }

    if (step < 3) {
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
        selectedCategories,
        selectedSources,
        recommendedSources: recommendedSources.map((s) => ({
          id: s._id,
          name: s.name,
          categories: s.categories,
        })),
      });

      const sourcesToSend =
        selectedSources.length > 0 ? selectedSources : recommendedSources.map((s) => s._id);

      const dataToSend = {
        categories: selectedCategories,
        sources: sourcesToSend,
      };

      console.log('Données à envoyer au serveur:', dataToSend);

      const userData = await completeOnboarding(dataToSend);
      console.log('Réponse du serveur:', userData);

      // Vérifier que les données sont bien dans la réponse
      if (userData.user) {
        console.log('Données utilisateur mises à jour:', {
          interests: userData.user.interests,
          activeSources: userData.user.activeSources,
        });
      }

      updateUser({
        ...user,
        ...userData.user,
        onboardingCompleted: true,
      });

      navigate('/');
    } catch (err) {
      console.error('Erreur complète:', err);
      console.error("Détails de l'erreur:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError("Erreur lors de la finalisation de l'onboarding");
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les sources recommandées basées sur les catégories sélectionnées
  const recommendedSources = Array.isArray(allSources)
    ? allSources
        .filter((source) =>
          source.categories.some((category) => selectedCategories.includes(category))
        )
        .slice(0, 10)
    : [];

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Personnalisez votre expérience</h1>
        <p className="text-gray-600">Étape {step} sur 3</p>

        {/* Indicateur d'étapes */}
        <div className="flex justify-center mt-4 space-x-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                i === step
                  ? 'bg-blue-600 scale-110' // Point actif
                  : i < step
                  ? 'bg-blue-400' // Points passés
                  : 'bg-gray-300' // Points à venir
              }`}
              aria-label={`Étape ${i}`}
              role="progressbar"
              aria-current={i === step ? 'step' : undefined}
            />
          ))}
        </div>
      </div>

      {/* Message d'erreur */}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}

      {/* Contenu de l'étape */}
      <div className="bg-white rounded-lg shadow-md p-5 mb-4">
        {step === 1 && (
          <>
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Quelles thématiques vous intéressent ?
            </h2>
            <p className="text-gray-600 mb-4">
              Sélectionnez jusqu'à 10 thématiques qui vous intéressent.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-primary-dark text-red hover:bg-primary-darker'
                      : 'bg-red-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-500">
              {selectedCategories.length}/10 thématiques sélectionnées
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Choisissez vos sources préférées
            </h2>
            <p className="text-gray-600 mb-4">
              Voici quelques sources recommandées basées sur vos intérêts.
            </p>

            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {recommendedSources.length > 0 ? (
                recommendedSources.map((source) => {
                  console.log('Rendering source:', source);
                  return (
                    <div
                      key={source._id}
                      className="flex items-center p-2 border border-gray-200 rounded-md"
                    >
                      <input
                        type="checkbox"
                        id={`source-${source._id}`}
                        checked={selectedSources.includes(source._id)}
                        onChange={() => toggleSource(source._id)}
                        className="mr-3"
                      />
                      <label
                        htmlFor={`source-${source._id}`}
                        className="flex items-center flex-grow cursor-pointer"
                      >
                        {source.faviconUrl && (
                          <img src={source.faviconUrl} alt="" className="w-5 h-5 mr-2" />
                        )}
                        <div>
                          <div className="font-medium">{source.name}</div>
                          <div className="text-xs text-gray-500">
                            {source.categories.slice(0, 3).join(', ')}
                            {source.categories.length > 3 && '...'}
                          </div>
                        </div>
                      </label>

                      <div className="ml-auto text-xs">
                        <span
                          className={`px-2 py-1 rounded-full ${
                            source.orientation.political === 'gauche'
                              ? 'bg-red-100 text-red-700'
                              : source.orientation.political === 'centre'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {source.orientation.political}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Sélectionnez des thématiques pour voir des recommandations
                </p>
              )}
            </div>

            <p className="text-sm text-gray-500">
              Vous pourrez ajouter d'autres sources plus tard.
            </p>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-lg font-medium text-gray-800 mb-4">Vous êtes prêt !</h2>
            <p className="text-gray-600 mb-6">
              Félicitations ! Vous avez configuré votre expérience personnalisée. Vous allez
              maintenant découvrir des actualités en fonction de vos préférences.
            </p>

            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Résumé de vos choix</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Thématiques :</strong> {selectedCategories.join(', ')}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Sources :</strong> {selectedSources.length} sélectionnées
                <br />
                {/* Debug info */}
                <span className="text-xs text-gray-400">
                  IDs sélectionnés : {JSON.stringify(selectedSources)}
                </span>
              </p>
            </div>

            <p className="text-sm text-gray-500">
              Vous pourrez modifier ces paramètres à tout moment dans votre profil.
            </p>
          </>
        )}
      </div>

      {/* Boutons de navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className={`px-4 py-2 rounded-md font-medium ${
            step === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400'
          }`}
        >
          Précédent
        </button>

        <button
          onClick={nextStep}
          disabled={loading}
          className={`px-4 py-2 rounded-md font-medium ${
            loading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400'
          }`}
          aria-busy={loading}
        >
          {step < 3 ? 'Suivant' : 'Terminer'}
          {loading && (
            <span className="ml-2 inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-white"></span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
