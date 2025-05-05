import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { fetchAllSources } from '../../../api/sourcesApi';
import { completeOnboarding } from '../../../api/authApi';

import Step1Introduction from './components/Step1Introduction';
import Step2Bibliography from './components/Step2Bibliography';
import Step3Radar from './components/Step3Radar';
import Step4Coverage from './components/Step4Coverage';
import Step5Sources from './components/Step5Sources';
import Step5Credits from './components/Step5Credits';

const Onboarding = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const titleRef = React.useRef(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSources, setSelectedSources] = useState([]);
  const [allSources, setAllSources] = useState([]);

  // Rediriger si l'onboarding est déjà complété
  useEffect(() => {
    if (user?.onboardingCompleted) {
      navigate('/');
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

  const toggleSource = (sourceId) => {
    setSelectedSources((prev) => {
      if (prev.includes(sourceId)) {
        return prev.filter((id) => id !== sourceId);
      }
      return [...prev, sourceId];
    });
  };

  // Terminer le processus d'onboarding
  const completeOnboardingProcess = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('État final avant envoi:', {
        selectedSources,
        // recommendedSources: recommendedSources.map((s) => ({
        //   id: s._id,
        //   name: s.name,
        // })),
      });

      const dataToSend = {
        sources: selectedSources,
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

  const nextStep = async () => {
    if (step === 6) {
      if (selectedSources.length < 3) {
        setError('Veuillez sélectionner au moins 3 sources pour continuer.');
        return;
      }
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
    // Ne pas rendre Step5Sources si les sources ne sont pas encore chargées
    if (step === 6 && loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (step) {
      case 1:
        return <Step1Introduction />;
      case 2:
        return <Step2Bibliography />;
      case 3:
        return <Step3Radar />;
      case 4:
        return <Step4Coverage />;
      case 5:
        return <Step5Credits />;
      case 6:
        return (
          <Step5Sources
            selectedSources={selectedSources}
            allSources={allSources}
            onToggleSource={toggleSource}
          />
        );
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
          <p className="text-gray-600">Étape {step} sur 6</p>

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
        <div className="bg-white rounded-xl shadow-sm p-6">
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
              className={`px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 ${
                step === 1 ? 'ml-auto' : ''
              }`}
              disabled={loading}
            >
              {step === 6 ? 'Terminer' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
