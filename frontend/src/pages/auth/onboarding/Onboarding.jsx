import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { fetchAllSources } from '../../../api/sourcesApi';
import { completeOnboarding } from '../../../api/authApi';

import Step1Introduction from './components/Introduction';
import PublicCollections from './components/PublicCollections';
import CreateCollection from './components/CreateCollection';
import AddSourcesToCollection from './components/AddSourcesToCollection';
import UpcomingFeatures from './components/UpcomingFeatures';
import Conclusion from './components/Conclusion';
import OnboardingSource from './components/OnboardingSource';
import { useCallback } from 'react';
const Onboarding = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const titleRef = React.useRef(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allSources, setAllSources] = useState([]);

  // Gestion de la validation des étapes
  const [stepValidation, setStepValidation] = useState({
    1: true, // Introduction est toujours valide
    2: true, // OnboardingSource est toujours valide
    3: false, // PublicCollections requiert au moins une collection suivie
    4: false, // CreateCollection requiert la création d'une collection
    5: true, // UpcomingFeatures est toujours valide
    6: true, // Conclusion est toujours valide
  });

  // Vérifier si l'étape actuelle est valide
  const isCurrentStepValid = () => {
    return stepValidation[step];
  };

  // Mettre à jour l'état de validation d'une étape
  const handleStepValidation = useCallback((stepNumber, isValid) => {
    setStepValidation((prev) => ({
      ...prev,
      [stepNumber]: isValid,
    }));
  }, []);

  // Rediriger si l'onboarding est déjà complété
  useEffect(() => {
    if (user?.onboardingCompleted) {
      navigate('/app');
    }
  }, [user, navigate]);

  // Charger les sources disponibles
  useEffect(() => {
    const loadSources = async () => {
      try {
        setLoading(true);
        const sources = await fetchAllSources();
        // S'assurer que sources est un tableau
        setAllSources(Array.isArray(sources) ? sources : sources.data || []);
      } catch (err) {
        console.error('Erreur lors du chargement des sources:', err);
        setError('Erreur lors du chargement des sources');
        setAllSources([]); // En cas d'erreur, initialiser avec un tableau vide
      } finally {
        setLoading(false);
      }
    };

    loadSources();
  }, []);

  // Terminer le processus d'onboarding
  const completeOnboardingProcess = async () => {
    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        sources: [], // Simplified data, sources are now added in step 4
      };

      const userData = await completeOnboarding(dataToSend);

      if (userData.user) {
        updateUser({
          ...user,
          ...userData.user,
          onboardingCompleted: true,
        });
      }

      navigate('/app');
    } catch (err) {
      console.error('Erreur:', err);
      setError("Erreur lors de la finalisation de l'onboarding");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    // Vérifier que l'étape actuelle est valide avant de continuer
    if (!isCurrentStepValid()) {
      // Ne pas afficher d'erreur ici car chaque composant d'étape affiche déjà son propre message de validation
      return;
    }

    if (step === 6) {
      await completeOnboardingProcess();
    } else {
      setStep((prev) => prev + 1);
      // Scroll doux vers le titre après le changement d'étape
      setTimeout(() => {
        titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    setTimeout(() => {
      titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const renderStep = () => {
    // No need for special loading handling for Conclusion component
    if (loading && step < 6) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <Step1Introduction onValidationChange={(isValid) => handleStepValidation(1, isValid)} />
        );
      case 2:
        return (
          <OnboardingSource onValidationChange={(isValid) => handleStepValidation(2, isValid)} />
        );
      case 3:
        return (
          <PublicCollections onValidationChange={(isValid) => handleStepValidation(3, isValid)} />
        );
      case 4:
        return (
          <CreateCollection
            allSources={allSources}
            onValidationChange={(isValid) => handleStepValidation(4, isValid)}
          />
        );
      case 5:
        return (
          <UpcomingFeatures onValidationChange={(isValid) => handleStepValidation(5, isValid)} />
        );
      case 6:
        return <Conclusion onValidationChange={(isValid) => handleStepValidation(6, isValid)} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8" ref={titleRef}>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Bienvenue sur MédiaScan</h1>
          {/* <p className="text-gray-600">Étape {step} sur 6</p> */}

          {/* Indicateur d'étapes */}
          <div className="flex justify-center mt-4 space-x-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
        <div className="bg-white rounded-xl shadow-sm md:p-6">
          {renderStep()}

          {/* Boutons de navigation */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-4 py-2 rounded-md font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                disabled={loading}
              >
                Précédent
              </button>
            )}

            <button
              onClick={nextStep}
              className={`px-4 py-2 rounded-md font-medium ${
                isCurrentStepValid()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-300 text-white cursor-not-allowed'
              } ${step === 1 ? 'ml-auto' : ''}`}
              disabled={loading || !isCurrentStepValid()}
            >
              {step === 6 ? 'Terminer' : step === 1 ? 'Commencer' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
