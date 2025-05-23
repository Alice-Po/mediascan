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
      case '/app':
        return "Fil d'actualités";
      case '/statistics':
        return 'Statistiques de lecture';
      case '/profile':
        return 'Mon profil';
      default:
        return "Agrégateur d'actualités";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ms:pt-[104px]">
      <Navbar />
      <main className="container mx-auto px-4 md:max-w-6xl mt-25 ">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
