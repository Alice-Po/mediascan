import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AntennaIcon } from './icons';

// Icônes (tu pourras remplacer par des importations de bibliothèques d'icônes)
const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const SourcesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    />
  </svg>
);

const SavedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
    />
  </svg>
);

const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

// const LogoutIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-6 w-6"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//     />
//   </svg>
// );

// const AntennaIcon = () => (
//   <svg
//     className="h-6 w-6"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     {/* Base de l'antenne */}
//     <line x1="12" y1="24" x2="12" y2="16" />
//     {/* Support de l'antenne */}
//     <line x1="8" y1="16" x2="16" y2="16" />
//     {/* Antenne principale */}
//     <path d="M12 16L12 2" />
//     {/* Ondes radio (3 arcs) */}
//     <path d="M6 8C6 8 9 5 12 5C15 5 18 8 18 8" />
//     <path d="M4 4C4 4 8 1 12 1C16 1 20 4 20 4" />
//     <path d="M8 12C8 12 10 9 12 9C14 9 16 12 16 12" />
//   </svg>
// );

// Ajouter l'icône Premium
const PremiumIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

// Ajouter l'icône Collections
const CollectionsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    />
  </svg>
);

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      // Rediriger vers la page de connexion
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Déterminer si on est sur desktop ou mobile
  const isMobile = () => {
    return window.innerWidth < 768; // 768px est le breakpoint standard pour md dans Tailwind
  };

  // Navigation items (sans le bouton de déconnexion)
  const navItems = [
    { to: '/app', label: 'Accueil', icon: <HomeIcon /> },
    { to: '/collections', label: 'Collections', icon: <CollectionsIcon /> },
    { to: '/saved', label: 'Sauvegardés', icon: <SavedIcon /> },
    { to: '/profile', label: 'Profil', icon: <ProfileIcon /> },
  ];

  return (
    <>
      {/* Navigation desktop - Ajuster le z-index et le top */}
      <nav className="hidden md:block bg-white shadow-sm fixed w-full top-[44px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <NavLink to="/app" className="flex items-center">
              <div className="text-gray-800 w-8 h-8 mr-2">
                <AntennaIcon />
              </div>
              <span className="text-xl font-semibold text-gray-900">MédiaScan</span>
            </NavLink>

            <div className="flex space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary bg-primary-light bg-opacity-10'
                        : 'text-gray-700 hover:text-primary'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <NavLink
                to="/funding"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive
                      ? 'border-primary text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                Financement participatif
              </NavLink>

              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Navigation mobile */}
      <nav className="md:hidden fixed inset-x-0 bottom-0 bg-white shadow-t z-50">
        <div className="grid grid-cols-5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'
                }`
              }
            >
              <div className="h-6 w-6">{item.icon}</div>
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          ))}
          <NavLink
            to="/funding"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 transition-colors ${
                isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'
              }`
            }
          >
            <div className="h-6 w-6">
              <PremiumIcon />
            </div>
            <span className="text-xs mt-1">Soutenir </span>
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
