import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { fetchAllSources } from '../../api/sourcesApi';
import { completeOnboarding } from '../../api/authApi';

/**
 * Page d'onboarding pour les nouveaux utilisateurs
 */
const Onboarding = () => {
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
        const sources = await fetchAllSources();
        setAllSources(sources);
      } catch (err) {
        setError('Erreur lors du chargement des sources');
        console.error(err);
      }
    };

    loadSources();
  }, []);

  // Toggle pour une catégorie
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      // Limiter à 10 choix maximum
      if (selectedCategories.length < 10) {
        setSelectedCategories([...selectedCategories, category]);
      }
    }
  };

  // Toggle pour une source
  const toggleSource = (sourceId) => {
    if (selectedSources.includes(sourceId)) {
      setSelectedSources(selectedSources.filter((id) => id !== sourceId));
    } else {
      setSelectedSources([...selectedSources, sourceId]);
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
      // Filtrer les sources recommandées en fonction des catégories sélectionnées
      const recommendedSourceIds = allSources
        .filter((source) =>
          source.categories.some((category) => selectedCategories.includes(category))
        )
        .map((source) => source.id);

      // Envoyer les données d'onboarding
      const userData = await completeOnboarding({
        categories: selectedCategories,
        sources: selectedSources.length > 0 ? selectedSources : recommendedSourceIds,
      });

      // Mettre à jour les données utilisateur localement
      updateUser({
        ...userData,
        onboardingCompleted: true,
      });

      // Rediriger vers le dashboard
      navigate('/');
    } catch (err) {
      setError("Erreur lors de la finalisation de l'onboarding");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les sources recommandées basées sur les catégories sélectionnées
  const recommendedSources = allSources
    .filter((source) => source.categories.some((category) => selectedCategories.includes(category)))
    .slice(0, 10); // Limiter à 10 sources recommandées

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Personnalisez votre expérience</h1>
        <p className="text-gray-600">Étape {step} sur 3</p>

        {/* Indicateur d'étapes */}
        <div className="flex justify-center mt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full mx-1 ${
                i === step ? 'bg-primary' : i < step ? 'bg-gray-400' : 'bg-gray-200'
              }`}
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
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    selectedCategories.includes(category)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                recommendedSources.map((source) => (
                  <div
                    key={source.id}
                    className="flex items-center p-2 border border-gray-200 rounded-md"
                  >
                    <input
                      type="checkbox"
                      id={`source-${source.id}`}
                      checked={selectedSources.includes(source.id)}
                      onChange={() => toggleSource(source.id)}
                      className="mr-3"
                    />
                    <label
                      htmlFor={`source-${source.id}`}
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
                ))
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
          className={`px-4 py-2 rounded-md ${
            step === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Précédent
        </button>

        <button
          onClick={nextStep}
          disabled={loading}
          className={`px-4 py-2 rounded-md ${
            loading
              ? 'bg-primary-light text-white cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
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
