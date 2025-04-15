import React, { useState, useEffect } from 'react';
import { fetchStatisticsData, fetchUserAnalytics, resetAnalytics } from '../api/analyticsApi';
import {
  Radar,
  RadarChart,
  PieChart,
  BarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import InformationAnalytics from '../components/analytics/InformationAnalytics';
/**
 * Page des statistiques de lecture
 */
const Statistics = () => {
  // State pour les données
  const [statisticsData, setStatisticsData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [period, setPeriod] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resetConfirm, setResetConfirm] = useState(false);

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statistics, analytics] = await Promise.all([
          fetchStatisticsData(),
          fetchUserAnalytics(period),
        ]);
        setStatisticsData(statistics);
        setAnalyticsData(analytics);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError("Impossible de charger vos données d'analyse.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [period]);

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
      const data = await fetchStatisticsData();
      setStatisticsData(data);

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
  const prepareRadarData = (data) => {
    if (!data) return [];

    return [
      {
        subject: 'Politique',
        A: data.political.score * 100,
        fullMark: 100,
      },
      {
        subject: 'Type',
        A: data.type.score * 100,
        fullMark: 100,
      },
      {
        subject: 'Structure',
        A: data.structure.score * 100,
        fullMark: 100,
      },
      {
        subject: 'Portée',
        A: data.scope.score * 100,
        fullMark: 100,
      },
    ];
  };

  // Calculer le score global
  const calculateOverallScore = () => {
    if (!statisticsData) return 0;

    const scores = [
      statisticsData.political.score,
      statisticsData.type.score,
      statisticsData.structure.score,
      statisticsData.scope.score,
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
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-4">Statistiques de lecture</h1>
        <p className="text-gray-600">
          Découvrez et analysez vos habitudes de consommation d'information à travers différentes
          dimensions.
        </p>
      </div>

      {/* Sélecteur de période */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Période d'analyse</h2>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border rounded p-2"
          >
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
            <option value="90days">90 derniers jours</option>
          </select>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold">{analyticsData?.totalInteractions || 0}</div>
            <div className="text-sm text-gray-500">Articles consultés</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold">{statisticsData?.uniqueSourcesRead || 0}</div>
            <div className="text-sm text-gray-500">Sources différentes</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold">{statisticsData?.uniqueCategoriesRead || 0}</div>
            <div className="text-sm text-gray-500">Catégories explorées</div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Graphique radar de statistiques */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Répartition des lectures</h2>
          <ResponsiveRadarChart data={prepareRadarData(statisticsData)} />
        </div>

        {/* Distribution des orientations */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Répartition des sources</h2>
          <div className="h-64">
            <PieChart data={analyticsData?.orientationStats?.political} />
          </div>
        </div>

        {/* Catégories consultées */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Catégories consultées</h2>
          <div className="h-64">
            <BarChart data={analyticsData?.categoryBreakdown} />
          </div>
        </div>

        {/* Types de médias */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Types de médias</h2>
          <div className="h-64">
            <PieChart data={analyticsData?.orientationStats?.type} />
          </div>
        </div>
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
      <InformationAnalytics />
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
          <Radar
            name="Statistiques"
            dataKey="A"
            stroke="#0066cc"
            fill="#0066cc"
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Statistics;
