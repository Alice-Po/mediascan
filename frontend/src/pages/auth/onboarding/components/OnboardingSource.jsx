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
import SourcesCatalog from '../../../../components/sources/SourcesCatalog';
import { useSources } from '../../../../hooks/useSources';
import FAQ from '../../../../components/common/FAQ';

const OnboardingSource = ({ onValidationChange }) => {
  const [showRssHelp, setShowRssHelp] = useState(false);
  const [showAddSource, setShowAddSource] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [hasAddedSource, setHasAddedSource] = useState(false);
  const { createSource } = useSources();

  // Mettre à jour la validation de l'étape
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange?.(hasAddedSource);
    }
  }, [hasAddedSource]);

  const sources = [
    {
      icon: RssIcon,
      title: 'Vos articles de presse',
      description: "Suivez l'actualité de vos journaux et magazines préférés en temps réel",
    },

    // {
    //   icon: GlobeIcon,
    //   title: 'Réseaux sociaux',
    //   description: 'Ne manquez plus les publications importantes de vos comptes favoris',
    // },
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
      const response = await createSource(sourceData);
      console.log('Source ajoutée:', response);
      setShowAddSource(false);
      setHasAddedSource(true);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la source:", error);
      setFormErrors({
        submit: error.message || "Une erreur est survenue lors de l'ajout de la source",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
          Médiascan est un aggrégateur de flux d'information.
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Nous allons beaucoup vous parler de <strong>sources</strong>. Une source, c'est pour nous
          un flux d'informations qui correspond aux mise à jours d'un service web (comme de nouveaux
          articles, vidéos ou podcasts).
        </p>
        <br />
        <p className="text-sm sm:text-base text-gray-600">
          {' '}
          Pour l'instant nous utilisons une technologie vieille et efficace : les flux RSS (Really
          Simple Syndication) mais d'autres technologies existent et seront prochainement
          implémentées.
        </p>
      </div>

      {/* Explication principale */}
      <div className="bg-blue-50 rounded-xl p-4 sm:p-6 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-3 text-base sm:text-lg">
          Où puis-je trouver des flux qui m'intéressent ?
        </h3>
        <p className="text-gray-700 mb-4">
          Le moyen le plus simple est d'installer une extension pour détecter les flux rss, vous
          rendre sur la page web d'un flux qui vous intéresse et récupérer l'adresse du flux qui
          vous intéresse.
        </p>

        <p className="text-gray-700 mb-4">Voici deux extensions que nous vous recommandons :</p>

        <div className="mt-2 space-y-2">
          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
            <img src="https://www.mozilla.org/favicon.ico" alt="Firefox" className="w-5 h-5" />
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
        </div>
      </div>

      {/* FAQ RSS */}
      <FAQ
        title="À propos des flux RSS"
        items={[
          {
            question: 'Quels types de flux peut ainsi être agrégés ?',
            answer: (
              <>
                <p className="text-gray-700 mb-4">
                  Actualités, blogs, podcasts, documentation technique, réseaux sociaux, offre
                  d'emploi, données météo, flux financiers, alertes légales, données météo, forum...
                </p>
                <p className="text-gray-700">
                  L'intégration des newsletters arrivent prochainement !
                </p>
              </>
            ),
          },
          {
            question: 'Est ce que tout les sites web ou application peuvent être agrégés ?',
            answer: (
              <>
                <p className="text-gray-700 mb-4">
                  La présence d'un flux RSS dépend principalement de la stratégie commerciale du
                  site - les plateformes qui monétisent via la publicité ou les données utilisateurs
                  (comme Facebook, Instagram) évitent volontairement le RSS car cela contournerait
                  leurs revenus. À l'inverse, les blogs, sites d'actualité et plateformes axées
                  contenu l'adoptent pour fidéliser leur audience. La plupart des technologies de
                  création de contenu l'implémente par défaut comme wordpress. Enfin, c'est souvent
                  une question de priorité - beaucoup de sites pourraient techniquement proposer du
                  RSS mais ne le font pas par méconnaissance de l'intérêt utilisateur ou par manque
                  de ressources dédiées.
                </p>
              </>
            ),
          },
        ]}
        className="mt-8"
      />

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm">
        <div className="text-center">
          {!hasAddedSource ? (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Prêt à commencer ?</h3>
              <p className="text-gray-700 mb-6">
                Ajoutez votre première source d'information pour passer à l'étape suivante
              </p>
              <button
                onClick={() => setShowAddSource(true)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Ajouter une source
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Parfait ! Votre première source est ajoutée
              </h3>
              <p className="text-gray-700 mb-6">
                Vous pouvez vous baladez à travers le catalogue des sources déjà renseignées par les
                utilisateurs
              </p>
              <button
                onClick={() => setShowCatalog(true)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Explorer le catalogue
              </button>
            </>
          )}
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
              hideCollectionSection={true}
            />
          </div>
        </div>
      )}

      {showCatalog && (
        <SourcesCatalog
          isOpen={showCatalog}
          onClose={() => setShowCatalog(false)}
          isOnboarding={true}
        />
      )}
    </div>
  );
};

export default OnboardingSource;
