import React, { useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ArticleFilters from '../components/articles/ArticleFilters';
import ArticleList from '../components/articles/ArticleList';

/**
 * Page principale du Dashboard
 */
const Dashboard = () => {
  const { resetFilters } = useContext(AppContext);

  // Réinitialiser les filtres au montage de la page
  useEffect(() => {
    resetFilters();
  }, [resetFilters]);

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

      // Si on est au sommet de la page et qu'on tire vers le bas
      if (window.scrollY === 0 && touchEndY - touchStartY > minSwipeDistance) {
        window.location.reload();
      }
    };

    // Ajouter les écouteurs d'événements
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    // Nettoyer les écouteurs
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="dashboard">
      {/* Filtres */}
      <ArticleFilters />

      {/* Liste des articles */}
      <ArticleList />
    </div>
  );
};

export default Dashboard;
