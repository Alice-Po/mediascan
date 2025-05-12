import React, { useEffect, useContext } from 'react';
import { CollectionsList } from '../components/collections';
import { useCollections } from '../hooks/useCollections';
import { AuthContext } from '../context/AuthContext';

const Collections = () => {
  const { user } = useContext(AuthContext);
  const { collections, loading, loadCollections } = useCollections(user);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Mes collections</h1>
        <a
          href="/collections/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Créer une collection
        </a>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : collections.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Vous n'avez pas encore de collections
          </h3>
          <p className="text-gray-600 mb-4">
            Les collections vous permettent d'organiser vos sources comme des playlists.
          </p>
          <a
            href="/collections/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Créer ma première collection
          </a>
        </div>
      ) : (
        <CollectionsList collections={collections} />
      )}
    </div>
  );
};

export default Collections;
