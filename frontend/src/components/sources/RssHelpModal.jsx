import React from 'react';
import PremiumBanner from '../premium/PremiumBanner';
const RssHelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Comprendre les flux RSS</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4 text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Qu'est-ce qu'un flux RSS ?</h4>
              <p>
                Un flux RSS est un format standardisé qui permet de suivre automatiquement les mises
                à jour d'un site web. C'est comme un fil d'actualité brut qui contient les derniers
                articles publiés.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Comment trouver l'URL d'un flux RSS ?
              </h4>
              <div className="space-y-2">
                <p>Il existe plusieurs méthodes :</p>
                <ol className="list-decimal ml-4 space-y-2">
                  <li>
                    <span className="font-medium">Chercher l'icône RSS</span> : Souvent représentée
                    par ce symbole 🛜 ou{' '}
                    <span className="px-1 py-0.5 bg-orange-100 text-orange-700 rounded">RSS</span>
                  </li>
                  <li>
                    <span className="font-medium">Utiliser une extension de navigateur</span> : Des
                    extensions peuvent automatiquement détecter les flux RSS disponibles sur un site
                    web.
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                        <img
                          src="https://www.mozilla.org/favicon.ico"
                          alt="Firefox"
                          className="w-5 h-5"
                        />
                        <a
                          href="https://addons.mozilla.org/fr/firefox/addon/get-rss-feed-url/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Get RSS Feed URL pour Firefox
                        </a>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                        <img
                          src="https://www.google.com/chrome/static/images/chrome-logo.svg"
                          alt="Chrome"
                          className="w-5 h-5"
                        />
                        <a
                          href="https://chromewebstore.google.com/detail/rss-feed-finder/gneplfjjnfmbgimbgonejfoaiphdfkcp"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          RSS Feed Finder pour Chrome
                        </a>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Ces extensions révèlent tous les flux disponibles sur une page web, y
                        compris pour les chaînes YouTube, permettant de copier facilement leur URL.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <br></br>
          {/* Bannière Premium - Détection RSS */}
          <PremiumBanner
            className="mb-6"
            variant="coming"
            title="Fini la recherche manuelle des flux RSS !"
            description="Bientôt, vous n'aurez plus qu'à entrer l'URL du site web et nous détecterons automatiquement le flux RSS correspondant."
            linkText="En savoir plus sur la détection intelligente de flux RSS"
          />
        </div>
      </div>
    </div>
  );
};

export default RssHelpModal;
