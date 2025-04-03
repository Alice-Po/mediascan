import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

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
      case '/diversity':
        return "Ma diversité d'information";
      case '/profile':
        return 'Mon profil';
      default:
        return "Agrégateur d'actualités";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar fixe en haut pour desktop, en bas pour mobile */}
      <Navbar />

      {/* Contenu principal avec padding pour éviter le chevauchement avec la navbar */}
      <div className="flex-1 md:mt-16 mb-16 md:mb-0">
        {' '}
        {/* Ajout des marges */}
        {/* En-tête de page */}
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
            {user && <p className="text-sm text-gray-500">Bonjour, {user.name}</p>}
          </div>
        </header>
        {/* Contenu principal */}
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
