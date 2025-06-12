import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Snackbar from '../components/common/Snackbar';
import FeatureList from '../components/features/FeatureList';
import FAQ from '../components/common/FAQ';
import ContactForm from '../components/common/ContactForm';

const Funding = () => {
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showPartnershipModal, setShowPartnershipModal] = useState(false);
  const [showExperimentModal, setShowExperimentModal] = useState(false);

  // Define FAQ items for the funding page
  const faqItems = [
    {
      question: 'Est-ce que je peux annuler ma promesse de don ?',
      answer:
        'Oui, à tout moment avant que la fonctionnalité soit complètement développée et que le paiement soit demandé.',
    },
    {
      question: "Comment fonctionnera concrètement le paiement à l'article ?",
      answer:
        'Nous aimerions utiliser solution libre de micro-paiement mais le sujet est toujours en cours de discussion.',
    },
  ];

  const openFeatureModal = () => {
    setShowFeatureModal(true);
  };

  const openMembershipModal = () => {
    setShowMembershipModal(true);
  };

  const openPartnershipModal = () => {
    setShowPartnershipModal(true);
  };

  const openExperimentModal = () => {
    setShowExperimentModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ❤️‍🔥 ​Participez au développement de Médiascan
          </h1>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto mb-8">
            Votez avec votre portefeuille pour les outils qui vous manquent vraiment.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-4 pb-24">
        {/* Financement participatif */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-12">
          <p className="text-gray-700 text-lg mb-6">
            Promettez un don sans avancer d'argent. Chaque promesse oriente nos priorités de
            développement. Vous ne payez que lorsque la fonctionnalité est livrée et fonctionnelle.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 highlight-box">
            <p className="text-gray-800">
              <strong className="text-yellow-700">Offre spéciale fondateurs :</strong> Tout
              financement participatif de 50€ ou plus avant janvier 2026 vous donne accès au statut
              Premium à vie !
            </p>
          </div>

          <button
            onClick={openFeatureModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center"
          >
            FINANCER UNE FONCTIONNALITÉ
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </section>

        {/* Membre d'honneur */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">​👑​ Devenez membre d'honneur</h2>
          <p className="text-gray-700 text-lg mb-6">
            Plus qu'un simple abonnement, une place à la table des orientations stratégiques.
          </p>
          <p className="text-gray-700 mb-6">
            Pour 4,99€/mois, vous accéderez bientôt à toutes les fonctionnalités premium en
            développement, comme l'intégration de newsletters et la fonction radar personnalisée.
          </p>

          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-8 highlight-box">
            <p className="text-gray-800">
              <strong className="text-purple-700">Opportunité limitée :</strong> Les 100 premiers
              membres d'honneur obtiennent un droit de vote permanent sur les décisions stratégiques
              du projet (nouvelles fonctionnalités, choix des annonceurs, partenariats).
            </p>
          </div>

          <button
            onClick={openMembershipModal}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center"
          >
            DEVENIR MEMBRE D'HONNEUR
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </section>

        {/* Annonceur éthique */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">📢 Devenez annonceur </h2>
          <p className="text-gray-700 text-lg mb-6">
            Chez Médiascan, la publicité est un privilège, pas un droit.
          </p>
          <p className="text-gray-700 mb-6">
            Notre plateforme propose uniquement des annonces alignées avec nos valeurs et
            pertinentes pour notre communauté. Pas de ciblage comportemental, pas de manipulation
            émotionnelle.
          </p>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8 highlight-box">
            <p className="text-gray-800">
              <strong className="text-green-700">Notre engagement :</strong> Transparence totale sur
              la sélection des annonceurs, validée par notre communauté de membres d'honneur.
            </p>
          </div>

          <button
            onClick={openPartnershipModal}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center"
          >
            PROPOSER UN PARTENARIAT
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </section>

        {/* Micropaiement */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🔮 Vous êtes un média ou un créateur de contenu ?
          </h2>
          <p className="text-gray-700 text-lg mb-6">
            Nous recherchons des partenaires pour lancer une expérimentation de micropaiement à
            l'article.
          </p>
          <p className="text-gray-700 mb-6">
            Vous n'avez pas de frais à avancer, notre équipe technique s'occupe de toutes les
            implémentations techniques.
          </p>

          <button
            onClick={openExperimentModal}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center"
          >
            EXPÉRIMENTEZ AVEC NOUS
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </section>

        {/* Feature Modal */}
        {showFeatureModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Financer une fonctionnalité</h2>
                  <button
                    onClick={() => setShowFeatureModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <FeatureList />

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowFeatureModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Membership Modal */}
        {showMembershipModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-purple-700">Devenir membre d'honneur</h2>
                  <button
                    onClick={() => setShowMembershipModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <div className="bg-purple-50 p-6 rounded-lg mb-6">
                    <p className="text-lg text-gray-800 mb-3">
                      <span className="font-bold">Merci beaucoup !!!</span>
                    </p>
                    <p className="text-gray-700 mb-3">
                      Notre système de paiement est encore en développement, mais nous pouvons vous
                      réserver une place parmi les pionniers du projet.
                    </p>
                    <p className="text-gray-700">
                      Laissez-nous votre email, et vous serez prioritaire pour rejoindre les 100
                      membres d'honneur qui auront un droit de vote permanent sur les décisions
                      stratégiques de Médiascan.
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Laissez-nous vos coordonnées :
                    </h3>
                    <ContactForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Partnership Modal */}
        {showPartnershipModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-green-700">Proposer un partenariat</h2>
                  <button
                    onClick={() => setShowPartnershipModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <div className="bg-green-50 p-6 rounded-lg mb-6">
                    <p className="text-lg text-gray-800 mb-3">
                      <span className="font-bold">Devenez un annonceur </span>
                    </p>
                    <p className="text-gray-700 mb-3">
                      Notre plateforme sélectionne soigneusement ses partenariats pour garantir une
                      publicité respectueuse de nos utilisateurs et alignée avec nos valeurs.
                    </p>
                    <p className="text-gray-700">
                      Laissez-nous vos coordonnées, et nous vous contacterons pour discuter des
                      possibilités de partenariat qui correspondent à votre marque et à notre
                      communauté.
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Parlez-nous de votre entreprise :
                    </h3>
                    <ContactForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Experiment Modal */}
        {showExperimentModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-blue-700">
                    Expérimentez le micropaiement avec nous
                  </h2>
                  <button
                    onClick={() => setShowExperimentModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <div className="bg-blue-50 p-6 rounded-lg mb-6">
                    <p className="text-lg text-gray-800 mb-3">
                      <span className="font-bold">Innovons ensemble sur le micropaiement</span>
                    </p>
                    <p className="text-gray-700 mb-3">
                      Nous cherchons des médias et créateurs de contenu pionniers pour tester notre
                      solution de micropaiement à l'article, sans frais d'implémentation pour vous.
                    </p>
                    <p className="text-gray-700 mb-3">
                      Notre approche est collaborative et ouverte : la solution se construira avec
                      vous, en fonction de vos besoins et retours d'expérience.
                    </p>
                    <p className="text-gray-700">
                      Vous bénéficierez d'un accompagnement personnalisé par notre équipe technique
                      et d'une visibilité privilégiée auprès de notre communauté d'utilisateurs.
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Rejoignez les premiers expérimentateurs :
                    </h3>
                    <ContactForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <FAQ
            items={faqItems}
            title="Questions fréquentes sur notre modèle économique"
            itemClassName="border-b border-gray-200 pb-4 mb-6"
          />
        </section>
      </div>

      <Footer />
      <Snackbar />
    </div>
  );
};

export default Funding;
