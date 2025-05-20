import React, { useEffect, useState } from 'react';
import {
  MailIcon,
  GlobeIcon,
  LightningIcon,
  DocumentTextIcon,
  RssIcon,
  ForumIcon,
} from '../../../../components/common/icons';
import RssHelpModal from '../../../../components/sources/RssHelpModal';
import AddSourceForm from '../../../../components/sources/AddSourceForm';
import SourceCatalog from '../../../../components/sources/SourceCatalog';

const OnboardingSource = ({ onValidationChange }) => {
  const [showRssHelp, setShowRssHelp] = useState(false);
  const [showAddSource, setShowAddSource] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Cette étape est toujours valide
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(true);
    }
  }, []);

  const sources = [
    {
      icon: RssIcon,
      title: 'Vos articles de presse',
      description: "Suivez l'actualité de vos journaux et magazines préférés en temps réel",
    },
    {
      icon: MailIcon,
      title: 'Vos infolettres',
      description: 'Centralisez toutes vos newsletters dans un seul endroit',
    },
    {
      icon: GlobeIcon,
      title: 'Réseaux sociaux',
      description: 'Ne manquez plus les publications importantes de vos comptes favoris',
    },
    {
      icon: LightningIcon,
      title: 'Chaînes vidéo',
      description: 'Restez informé des dernières vidéos de vos créateurs préférés',
    },
    {
      icon: DocumentTextIcon,
      title: 'Blogs',
      description: 'Suivez les derniers articles de vos blogs favoris',
    },
    {
      icon: ForumIcon,
      title: 'Forums',
      description: 'Gardez un œil sur les discussions qui vous intéressent',
    },
  ];

  const handleSubmitSource = async (sourceData) => {
    setLoading(true);
    try {
      // Simuler un délai de traitement
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Source ajoutée:', sourceData);
      setShowAddSource(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la source:", error);
      setFormErrors({ submit: "Une erreur est survenue lors de l'ajout de la source" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
          Qu'est-ce qu'une source d'actualité ?
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Une source, c'est un flux d'informations qui correspond aux mise à jours d'un service web
          (comme de nouveaux articles, vidéos ou podcasts).
        </p>
        <p className="text-sm sm:text-base text-gray-600">
          Nous nous appuyons sur une technologie trés vieille : les flux RSS, qui signifie signifie
          "Really Simple Syndication" (Syndication Vraiment Simple) (entre autre).
        </p>
      </div>

      {/* Explication principale */}
      <div className="bg-blue-50 rounded-xl p-4 sm:p-6 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-3 text-base sm:text-lg">
          Médiascan est un aggrégateur de flux.
        </h3>
        <p className="text-gray-700 mb-4">
          Médiascan vous permet de centraliser toutes vos sources d'information préférées en un seul
          endroit. Plus besoin de naviguer entre différents sites ou applications.
        </p>
      </div>

      {/* Liste des types de sources */}
      <div className="grid gap-4 sm:grid-cols-2">
        {sources.map((source, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-blue-200 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="text-blue-600 shrink-0 mt-1">
                <source.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">{source.title}</h4>
                <p className="text-sm text-gray-600">{source.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note de conclusion */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 shadow-sm">
        <p className="text-gray-700 text-sm sm:text-base">
          <strong>Le saviez-vous ?</strong> Vous pouvez ajouter autant de sources que vous le
          souhaitez et les organiser selon vos préférences. Médiascan s'occupe de tout mettre à jour
          automatiquement !
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={() => setShowCatalog(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Explorer le catalogue
          </button>
          <button
            onClick={() => setShowAddSource(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ajouter une source
          </button>
        </div>
      </div>

      {/* Modales */}
      <RssHelpModal isOpen={showRssHelp} onClose={() => setShowRssHelp(false)} />

      {showAddSource && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <AddSourceForm
              onSubmit={handleSubmitSource}
              onCancel={() => setShowAddSource(false)}
              loading={loading}
              formErrors={formErrors}
              collections={[{ _id: 'default', name: 'Collection par défaut', isDefault: true }]}
            />
          </div>
        </div>
      )}

      {showCatalog && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <h3 className="text-lg sm:text-xl font-medium">Catalogue des sources</h3>
              <button
                onClick={() => setShowCatalog(false)}
                className="text-white/80 hover:text-white"
                aria-label="Fermer"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <SourceCatalog
                onAddToCollection={() => {}}
                collectionSources={[]}
                userCollections={[
                  { _id: 'default', name: 'Collection par défaut', isDefault: true },
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingSource;
