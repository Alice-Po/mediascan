import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ collectionName, collectionId }) => {
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun article disponible</h3>
        <p className="mt-1 text-sm text-gray-500">
          {collectionName
            ? `Aucun article ne correspond à vos critères dans la collection "${collectionName}".`
            : 'Aucun article ne correspond à vos critères.'}
        </p>
        <div className="mt-6">
          <Link
            to={`/sources?collection=${collectionId}`}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
            Ajouter des sources
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
