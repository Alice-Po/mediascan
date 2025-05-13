import React, { useState, useEffect } from 'react';
import { fetchPublicCollections } from '../../../../api/collectionsApi';

const Step2Bibliography = () => {
  const [publicCollections, setPublicCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPublicCollections = async () => {
      try {
        setIsLoading(true);
        const collections = await fetchPublicCollections();
        console.log('Collections publiques chargées:', collections);
        setPublicCollections(collections);
      } catch (err) {
        console.error('Erreur lors du chargement des collections publiques:', err);
        setError('Impossible de charger les collections publiques.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPublicCollections();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* En-tête avec animation */}
      <div className="text-center relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
            Bibliographies thématiques partagées
          </h2>
          <p className="text-sm sm:text-base text-indigo-100">
            Comme une playlist Spotify, mais pour vos sources d'information !
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            {/* <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-xs font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>En développement
            </span> */}
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-xs font-medium">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1.5"></span>Finançable
            </span>
          </div>
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-500 rounded-full opacity-50 blur-xl"></div>
      </div>
      {/* Présentation visuelle du concept */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full ">
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">
              Le concept en un coup d'œil
            </h3>
            <p className="text-gray-700 mb-4">
              Créer des collections de sources d'information sur n'importe quel sujet, comme vous le
              feriez avec une playlist musicale et partager les.
            </p>
          </div>
        </div>
      </div>

      {/* Collections populaires disponibles */}
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg text-center">
          Collections publiques disponibles
        </h3>

        {isLoading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {error && <div className="bg-red-50 p-4 rounded-md text-red-700 text-center">{error}</div>}

        {!isLoading && !error && publicCollections.length === 0 && (
          <div className="bg-gray-50 p-6 rounded-md text-center">
            <p className="text-gray-700">
              Aucune collection publique n'est disponible pour le moment.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Soyez le premier à créer et partager une collection !
            </p>
          </div>
        )}

        {!isLoading && !error && publicCollections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publicCollections.map((collection) => (
              <div
                key={collection._id}
                className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white mr-3"
                    style={{ backgroundColor: collection.colorHex || '#6366F1' }}
                  >
                    {collection.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{collection.name}</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>Par {collection.createdBy?.username || 'Utilisateur anonyme'}</span>
                      <span className="mx-2">•</span>
                      <span>{collection.sources?.length || 0} sources</span>
                    </div>
                  </div>
                </div>

                {collection.description && (
                  <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
                    <p className="text-gray-700 text-sm italic">"{collection.description}"</p>
                  </div>
                )}

                <button className="w-full mt-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg text-sm font-medium transition-colors">
                  Voir les détails
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Composant pour les caractéristiques
const Feature = ({ text }) => (
  <div className="flex items-center">
    <svg
      className="w-5 h-5 text-indigo-500 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span className="text-gray-700">{text}</span>
  </div>
);

// Composant pour les sources dans l'exemple
const SourceItem = ({ name, type }) => (
  <div className="flex items-center justify-between">
    <span className="font-medium text-gray-800">{name}</span>
    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{type}</span>
  </div>
);

// Composant pour les cartes de fonctionnalités
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-4 rounded-lg border border-blue-100 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
    <div className="text-blue-600 shrink-0 mt-0.5 bg-blue-50 p-2 rounded-lg">{icon}</div>
    <div>
      <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  </div>
);

// Composant pour les exemples de bibliographies
const BibliographyExample = ({ title, color, count, author }) => (
  <div
    className={`bg-white p-4 rounded-lg shadow-sm border border-${color}-100 hover:shadow-md transition-shadow`}
  >
    <div
      className={`w-8 h-8 bg-${color}-100 rounded-full flex items-center justify-center text-${color}-600 mb-3`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        ></path>
      </svg>
    </div>
    <h4 className={`font-medium text-${color}-900 mb-1`}>{title}</h4>
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500">{count} sources</span>
      <span className="text-xs font-medium text-gray-700">Par {author}</span>
    </div>
  </div>
);

// Composant pour les options de financement
const FundingOption = ({ amount, title, description, highlighted = false }) => (
  <div
    className={`rounded-lg p-4 ${
      highlighted
        ? 'bg-white text-indigo-900 shadow-lg transform scale-105'
        : 'bg-white/20 text-white'
    }`}
  >
    <div className="text-center mb-2">
      <span className={`text-2xl font-bold ${highlighted ? 'text-indigo-600' : ''}`}>{amount}</span>
    </div>
    <h4 className="font-medium text-center mb-2">{title}</h4>
    <p className={`text-sm text-center ${highlighted ? 'text-gray-700' : 'text-indigo-100'}`}>
      {description}
    </p>
  </div>
);

export default Step2Bibliography;
