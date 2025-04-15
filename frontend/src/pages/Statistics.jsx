import React, { useState, useEffect } from 'react';
import { fetchStatisticsData, fetchUserAnalytics } from '../api/analyticsApi';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

/**
 * Prépare les données pour le graphique radar
 * @param {Object} orientationBreakdown - Données brutes des orientations
 * @returns {Array} Données formatées pour le radar
 */
const prepareRadarData = (orientationBreakdown) => {
  // Ordre spécifique pour le spectre politique
  const politicalSpectrum = [
    'extrême-gauche',
    'gauche',
    'centre-gauche',
    'centre',
    'centre-droit',
    'droite',
    'extrême-droite',
    'ténèbres', // Point supplémentaire entre les extrêmes
  ];

  // Calculer le total pour les pourcentages
  const total = Object.values(orientationBreakdown).reduce((sum, count) => sum + count, 0);

  // Créer les données pour le radar
  return politicalSpectrum.map((orientation) => {
    let value = 0;
    if (orientation === 'ténèbres') {
      // Calculer la moyenne des extrêmes pour le point "ténèbres"
      value =
        ((orientationBreakdown['extrême-gauche'] || 0) +
          (orientationBreakdown['extrême-droite'] || 0)) /
        2;
    } else {
      value = orientationBreakdown[orientation] || 0;
    }

    return {
      orientation: orientation,
      value: total > 0 ? (value / total) * 100 : 0,
    };
  });
};

/**
 * Page des statistiques de lecture simplifiée
 */
const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statistics, analytics] = await Promise.all([
          fetchStatisticsData(),
          fetchUserAnalytics('30days'),
        ]);

        setStats({
          totalArticles: analytics.data.totalInteractions || 0,
          uniqueSources: statistics.data.uniqueSourcesRead || 0,
          uniqueCategories: statistics.data.uniqueCategoriesRead || 0,
          orientationBreakdown: statistics.data.political?.distribution || {},
        });
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError("Impossible de charger vos données d'analyse.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Chargement des statistiques...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Statistiques de lecture</h1>

      {/* Statistiques de base */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold">{stats.totalArticles}</div>
          <div className="text-gray-600">Articles lus</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold">{stats.uniqueSources}</div>
          <div className="text-gray-600">Sources consultées</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold">{stats.uniqueCategories}</div>
          <div className="text-gray-600">Catégories explorées</div>
        </div>
      </div>

      {/* Radar des orientations politiques */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Spectre politique des lectures</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={stats ? prepareRadarData(stats.orientationBreakdown) : []}>
              <PolarGrid
                gridType="polygon"
                stroke="#e5e7eb" // Couleur plus claire pour la grille
              />
              <PolarAngleAxis
                dataKey="orientation"
                tick={{ fill: '#666', fontSize: 12 }}
                tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                axisLine={false}
                tick={{ fill: '#666' }}
              />
              <Radar
                name="Répartition"
                dataKey="value"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.6}
                dot={{
                  // Style des points
                  fill: '#2563eb',
                  strokeWidth: 0,
                  r: 4,
                }}
                isAnimationActive={true} // Animation au chargement
                animationBegin={0}
                animationDuration={500}
                animationEasing="ease-out"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Liste détaillée des orientations */}
      <div className="bg-white p-6 rounded-lg shadow mt-8">
        <h2 className="text-xl font-semibold mb-4">Détail des orientations</h2>
        <div className="space-y-2">
          {Object.entries(stats?.orientationBreakdown || {}).map(([orientation, count]) => (
            <div key={orientation} className="flex justify-between items-center">
              <span className="capitalize">{orientation}</span>
              <span className="font-medium">{count} articles</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
