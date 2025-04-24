import React from 'react';

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
                    <span className="font-medium">Extensions communes</span> : Essayez d'ajouter
                    <code className="mx-1 px-1 py-0.5 bg-gray-100 rounded">/feed</code>,
                    <code className="mx-1 px-1 py-0.5 bg-gray-100 rounded">/rss</code> ou
                    <code className="mx-1 px-1 py-0.5 bg-gray-100 rounded">/feed.xml</code>à l'URL
                    du site
                  </li>
                  <li>
                    <span className="font-medium">Inspecter le code source</span> : Cherchez
                    <code className="mx-1 px-1 py-0.5 bg-gray-100 rounded">
                      application/rss+xml
                    </code>
                    ou{' '}
                    <code className="mx-1 px-1 py-0.5 bg-gray-100 rounded">
                      application/atom+xml
                    </code>
                  </li>
                </ol>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700 mb-3">
                <strong>Besoin d'aide pour trouver un flux RSS ?</strong> Si vous ne trouvez pas le
                flux RSS, vous pouvez toujours nous contacter et nous vous aiderons à l'identifier.
              </p>
              <a
                href="/feedback"
                className="inline-flex items-center text-sm text-blue-700 hover:text-blue-800 bg-white px-3 py-1.5 rounded-lg border border-blue-100 hover:border-blue-200 transition-colors group"
              >
                <span>Contactez-nous</span>
                <svg
                  className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RssHelpModal;
