import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import InfoBanner from '../components/common/InfoBanner';

const MainLayout = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Déterminer le titre de la page en fonction du chemin actuel
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return "Fil d'actualités";
      case '/sources':
        return 'Mes sources';
      case '/saved':
        return 'Articles sauvegardés';
      case '/statistics':
        return 'Statistiques de lecture';
      case '/profile':
        return 'Mon profil';
      default:
        return "Agrégateur d'actualités";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      <InfoBanner />
      <Navbar />
      <div className="flex-1 md:mt-[7rem] mb-16 md:mb-0">
        {' '}
        <main className="container mx-auto px-4 py-6">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
