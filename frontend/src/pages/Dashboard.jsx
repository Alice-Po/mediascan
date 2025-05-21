import React, { useContext, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import Sidebar from '../components/sidebar/Sidebar';
import ArticleList from '../components/articles/ArticleList';

/**
 * Page principale du Dashboard
 */
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { filters, setFilters, resetFilters } = useContext(AppContext);
  const [searchParams] = useSearchParams();

  // Référence pour suivre le paramètre collection déjà appliqué
  const appliedCollectionRef = useRef(null);

  // Récupérer les paramètres d'URL et appliquer les filtres correspondants
  useEffect(() => {
    if (user) {
      const collectionId = searchParams.get('collection');
      const sourceId = searchParams.get('source');

      if (collectionId && appliedCollectionRef.current !== collectionId) {
        appliedCollectionRef.current = collectionId;
        setFilters((prev) => ({
          ...prev,
          collection: collectionId,
        }));
        if (sourceId) {
          setTimeout(() => {
            setFilters((prev) => ({
              ...prev,
              sources: [sourceId],
            }));
          }, 100);
        }
      } else if (!collectionId && appliedCollectionRef.current) {
        appliedCollectionRef.current = null;
        resetFilters();
      }
    }
  }, [user, searchParams, setFilters, resetFilters]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Layout responsive avec sidebar à l'extrême gauche sur desktop */}
      <div className="flex flex-col md:flex-row max-w-screen-2xl mx-auto">
        {/* Sidebar de filtres (à l'extrême gauche sur desktop) */}
        <div className="w-full md:w-auto md:min-h-screen">
          <div className="p-4 md:p-0">
            <Sidebar />
          </div>
        </div>

        {/* Contenu principal (feed) avec largeur maximale pour améliorer la lisibilité sur grands écrans */}
        <div
          className={`flex-1 p-3 sm:p-6 ${
            false ? 'md:ml-[60px]' : 'md:ml-[320px]'
          } md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] mx-auto transition-all duration-300 ease-in-out`}
        >
          <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
            <ArticleList filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
