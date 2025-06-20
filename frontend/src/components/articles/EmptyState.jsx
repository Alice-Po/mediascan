import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ collectionName, collectionId, isDefaultCollection = false }) => {
  return (
    <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>

        <h3 className="mt-2 text-lg font-medium text-gray-900">
          {isDefaultCollection ? 'Votre collection par défaut est vide' : 'Collection vide'}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {isDefaultCollection
            ? `"${collectionName}" est votre collection par défaut, mais elle ne contient aucune source pour le moment.`
            : `La collection "${collectionName}" ne contient aucune source avec des articles.`}
        </p>

        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-700">Vous pouvez :</p>
          <div className="space-y-3">
            {/* Bouton pour ajouter des sources */}
            <Link
              to={`/collection/${collectionId}`}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full justify-center"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Ajouter des sources à cette collection
            </Link>

            {/* Bouton pour découvrir des collections */}
            <Link
              to="/collections"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full justify-center"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              Découvrir et suivre des collections
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Vous pouvez aussi sélectionner une autre collection dans le menu latéral
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
