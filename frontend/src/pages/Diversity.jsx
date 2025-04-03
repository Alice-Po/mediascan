import React, { useState, useEffect } from 'react';
import { fetchDiversityData, resetAnalytics } from '../api/analyticsApi';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * Page de la dimension pédagogique (diversité d'information)
 */
const Diversity = () => {
  // State pour les données de diversité
  const [diversityData, setDiversityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resetConfirm, setResetConfirm] = useState(false);

  // Charger les données de diversité
  useEffect(() => {
    const loadDiversityData = async () => {
      try {
        setLoading(true);
        const data = await fetchDiversityData();
        setDiversityData(data);
      } catch (err) {
        console.error('Erreur lors du chargement des données de diversité:', err);
        setError("Impossible de charger vos données de diversité d'information.");
      } finally {
        setLoading(false);
      }
    };

    loadDiversityData();
  }, []);

  // Réinitialiser les données analytiques
  const handleReset = async () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      return;
    }

    try {
      setLoading(true);
      await resetAnalytics();

      // Recharger les données après réinitialisation
      const data = await fetchDiversityData();
      setDiversityData(data);

      setResetConfirm(false);
    } catch (err) {
      console.error('Erreur lors de la réinitialisation des données:', err);
      setError('Impossible de réinitialiser vos données.');
    } finally {
      setLoading(false);
    }
  };

  // Annuler la réinitialisation
  const cancelReset = () => {
    setResetConfirm(false);
  };

  // Préparer les données pour le graphique radar
  const prepareRadarData = () => {
    if (!diversityData) return [];

    return [
      {
        subject: 'Politique',
        A: diversityData.political.score * 100,
        fullMark: 100,
      },
      {
        subject: 'Type',
        A: diversityData.type.score * 100,
        fullMark: 100,
      },
      {
        subject: 'Structure',
        A: diversityData.structure.score * 100,
        fullMark: 100,
      },
      {
        subject: 'Portée',
        A: diversityData.scope.score * 100,
        fullMark: 100,
      },
    ];
  };

  // Calculer le score global de diversité
  const calculateOverallScore = () => {
    if (!diversityData) return 0;

    const scores = [
      diversityData.political.score,
      diversityData.type.score,
      diversityData.structure.score,
      diversityData.scope.score,
    ];

    return (scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100;
  };

  // Afficher un message de chargement
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Afficher un message d'erreur
  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>;
  }

  return (
    <div className="diversity-page space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-medium text-gray-800 mb-2">Ma diversité d'information</h2>
        <p className="text-gray-600 text-sm">
          Découvrez votre niveau de diversité d'information à travers différentes dimensions. Cela
          vous permet de prendre conscience de votre consommation médiatique et de l'équilibrer.
        </p>
      </div>

      {/* Graphique de diversité */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-md font-medium text-gray-800 mb-4">Profil de diversité</h3>

        {!diversityData || diversityData.totalArticlesRead === 0 ? (
          <div className="text-center py-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-gray-500 mb-2">Pas encore assez de données.</p>
            <p className="text-gray-400 text-sm">
              Consultez des articles pour obtenir une analyse de votre diversité d'information.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Graphique radar */}
            <div className="flex justify-center items-center">
              <ResponsiveRadarChart data={prepareRadarData()} />
            </div>

            {/* Statistiques */}
            <div className="space-y-4">
              {/* Score global */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Score global de diversité
                </h4>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-3 mr-2">
                    <div
                      className="bg-primary h-3 rounded-full"
                      style={{ width: `${calculateOverallScore()}%` }}
                    ></div>
                  </div>
                  <span className="text-lg font-bold text-primary">
                    {Math.round(calculateOverallScore())}%
                  </span>
                </div>
              </div>

              {/* Statistiques de lecture */}
              <div className="p-4 border border-gray-200 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Statistiques</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-sm text-gray-600">Articles lus:</span>
                    <span className="font-medium">{diversityData.totalArticlesRead}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm text-gray-600">Sources consultées:</span>
                    <span className="font-medium">{diversityData.uniqueSourcesRead}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm text-gray-600">Catégories explorées:</span>
                    <span className="font-medium">{diversityData.uniqueCategoriesRead}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Explications méthodologiques */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-md font-medium text-gray-800 mb-4">
          Comment nous classifions les sources
        </h3>

        <div className="space-y-4">
          <div className="border-l-4 border-primary pl-3">
            <h4 className="font-medium">Orientation politique</h4>
            <p className="text-sm text-gray-600 mt-1">
              Positionne les sources sur l'axe gauche-centre-droite selon leur ligne éditoriale. Un
              score élevé indique que vous consultez des sources variées sur le spectre politique.
            </p>
          </div>

          <div className="border-l-4 border-primary pl-3">
            <h4 className="font-medium">Type de média</h4>
            <p className="text-sm text-gray-600 mt-1">
              Distingue entre les médias mainstream et alternatifs. Un score élevé indique un
              équilibre entre ces deux types de sources.
            </p>
          </div>

          <div className="border-l-4 border-primary pl-3">
            <h4 className="font-medium">Structure</h4>
            <p className="text-sm text-gray-600 mt-1">
              Différencie les médias institutionnels des médias indépendants. Un score élevé indique
              que vous consultez ces deux catégories.
            </p>
          </div>

          <div className="border-l-4 border-primary pl-3">
            <h4 className="font-medium">Portée</h4>
            <p className="text-sm text-gray-600 mt-1">
              Distingue entre les sources généralistes et spécialisées. Un score élevé indique que
              vous consultez à la fois des médias couvrant l'actualité générale et des médias
              spécialisés dans certains domaines.
            </p>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>
            Note: Cette classification est simplifiée et ne prétend pas être exhaustive ou
            scientifique. Elle vise simplement à offrir une première approche de la diversité de vos
            sources d'information.
          </p>
        </div>
      </div>

      {/* Section "À découvrir" */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-md font-medium text-gray-800 mb-4">À découvrir</h3>

        <div className="bg-gray-50 p-6 rounded-md text-center">
          <div className="mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">Bientôt disponible</h4>
          <p className="text-gray-600 mb-4">
            Nous travaillons sur un système de suggestions personnalisées pour vous aider à
            diversifier vos sources d'information.
          </p>
          <button className="px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors">
            M'alerter quand c'est prêt
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-md font-medium text-gray-800 mb-4">Gestion des données</h3>

        <p className="text-sm text-gray-600 mb-4">
          Vous pouvez réinitialiser vos données analytiques à tout moment. Cela supprimera
          l'historique de vos consultations d'articles mais conservera vos préférences.
        </p>

        {resetConfirm ? (
          <div className="bg-red-50 p-4 rounded-md mb-4">
            <p className="text-red-700 font-medium mb-2">
              Êtes-vous sûr de vouloir réinitialiser vos données ?
            </p>
            <p className="text-sm text-red-600 mb-4">Cette action est irréversible.</p>
            <div className="flex space-x-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirmer la réinitialisation
              </button>
              <button
                onClick={cancelReset}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
          >
            Réinitialiser mes données analytiques
          </button>
        )}
      </div>
    </div>
  );
};

// Composant de graphique radar responsive
const ResponsiveRadarChart = ({ data }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="Diversité" dataKey="A" stroke="#0066cc" fill="#0066cc" fillOpacity={0.6} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Diversity;
