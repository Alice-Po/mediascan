import React, { useContext } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AppContext } from '../../context/AppContext';
import {
  AntennaIcon,
  HomeIcon,
  CollectionsIcon,
  ProfileIcon,
  PremiumIcon,
  SidebarToggleIcon,
} from './icons';

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const { isSidebarCollapsed, toggleSidebar } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === '/app';

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
    { to: '/collections', label: 'Collections', icon: <CollectionsIcon /> },
    { to: '/profile', label: 'Profil', icon: <ProfileIcon /> },
  ];

  return (
    <>
      {/* Navigation desktop - Ajuster le z-index et le top */}
      <nav className="hidden md:block bg-white shadow-sm fixed w-full top-[44px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <NavLink to="/app" className="flex items-center">
              {/* <div className="text-gray-800 w-8 h-8 mr-2">
                <AntennaIcon />
              </div> */}
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
          {/* Bouton Toggle Sidebar - uniquement visible sur le dashboard */}
          {isDashboard ? (
            <button
              onClick={toggleSidebar}
              className="flex flex-col items-center justify-center py-2 text-gray-500 hover:text-primary"
              aria-label={isSidebarCollapsed ? 'Ouvrir le menu' : 'Fermer le menu'}
            >
              <div className="h-6 w-6">
                <SidebarToggleIcon collapsed={isSidebarCollapsed} />
              </div>
              <span className="text-xs mt-1">Menu</span>
            </button>
          ) : (
            <div /> // Espace vide pour maintenir la grille
          )}

          {/* Bouton Collections */}
          <NavLink
            to="/collections"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 transition-colors ${
                isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'
              }`
            }
          >
            <div className="h-6 w-6">
              <CollectionsIcon />
            </div>
            <span className="text-xs mt-1">Collections</span>
          </NavLink>

          {/* Bouton Feed principal/Dashboard au centre */}
          <NavLink
            to="/app"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 transition-colors ${
                isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'
              }`
            }
          >
            <div className="h-7 w-7 -mt-1">
              <HomeIcon />
            </div>
            <span className="text-xs mt-1">Actualités</span>
          </NavLink>

          {/* Bouton Profil */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 transition-colors ${
                isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'
              }`
            }
          >
            <div className="h-6 w-6">
              <ProfileIcon />
            </div>
            <span className="text-xs mt-1">Profil</span>
          </NavLink>

          {/* Bouton Financement */}
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
            <span className="text-xs mt-1">Soutenir</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
