import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import ArticleFilters from '../components/articles/ArticleFilters';
import ArticleList from '../components/articles/ArticleList';

/**
 * Page principale du Dashboard
 */
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { resetFilters, loadingArticles, articles } = useContext(AppContext);
  const [error, setError] = useState(null);

  // Réinitialiser les filtres au montage de la page
  useEffect(() => {
    const init = async () => {
      try {
        if (user) {
          await resetFilters();
        }
      } catch (err) {
        setError("Erreur lors de l'initialisation du dashboard");
        console.error(err);
      }
    };
    init();
  }, [user]);

  // Configurer le pull-to-refresh
  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;
    const minSwipeDistance = 100;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      touchEndY = e.changedTouches[0].clientY;
      if (window.scrollY === 0 && touchEndY - touchStartY > minSwipeDistance) {
        window.location.reload();
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []); // Pas de dépendances car ces événements ne changent pas

  if (loadingArticles) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl mb-4">Bienvenue, {user?.name}</h2>
        {/* <InterestsList /> */}
        {/* Filtres */}
        <ArticleFilters />

        {/* Liste des articles */}
        <ArticleList />
      </div>
    </div>
  );
};

export default Dashboard;
