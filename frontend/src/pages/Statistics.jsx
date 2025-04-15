import React, { useState, useEffect } from 'react';
import { fetchStatisticsData, fetchUserAnalytics } from '../api/analyticsApi';

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

      {/* Répartition des orientations politiques */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Répartition des orientations</h2>
        <div className="space-y-2">
          {Object.entries(stats.orientationBreakdown).map(([orientation, count]) => (
            <div key={orientation} className="flex justify-between items-center">
              <span className="capitalize">{orientation}</span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
