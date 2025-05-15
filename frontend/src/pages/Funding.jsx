import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/common/Footer';
import FeatureList from '../components/features/FeatureList';
import FAQ from '../components/common/FAQ';

const Funding = () => {
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
        'Nous aimerions utiliser GNU Taler, solution libre de micro-paiement soutenu par NGI mais le sujet est toujours en cours de discussion.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Participez au développement de Médiascan
          </h1>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto mb-12">
            Votez avec votre portefeuille pour les fonctionnalités qui vous intéressent
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-4 pb-24">
        <div className="border-t border-gray-200 my-8"></div>

        {/* Modèle économique */}
        <section className="bg-white px-4 py-0 md:p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Un modèle économique transparent et éthique
          </h2>
          <p className="text-gray-700 mb-6">
            Médiascan est un projet qui repose sur des valeurs d'
            <strong>indépendance</strong>, de <strong>transparence</strong> et d'
            <strong>éthique</strong>. Notre modèle économique est conçu pour garantir ces valeurs
            tout en assurant la pérennité du service.
          </p>
          <div className="border-t border-gray-200 my-8"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Comment fonctionne notre financement participatif ?
          </h2>
          <p className="text-gray-700 mb-6 font-medium">
            Votez avec votre portefeuille pour les fonctionnalités que vous souhaitez voir
            développées.
          </p>
          <ol className="space-y-4 mb-6">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium shrink-0 mt-0.5">
                1
              </div>
              <p className="text-gray-700">
                <strong>Faites une promesse de don</strong> pour les fonctionnalités qui vous
                intéressent
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium shrink-0 mt-0.5">
                2
              </div>
              <p className="text-gray-700">
                <strong>Aucun prélèvement immédiat</strong> - votre promesse est un vote qui nous
                aide à prioriser
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium shrink-0 mt-0.5">
                3
              </div>
              <p className="text-gray-700">
                <strong>Paiement uniquement à la livraison</strong> - vous ne payez que lorsque la
                fonctionnalité est développée et fonctionnelle
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium shrink-0 mt-0.5">
                4
              </div>
              <p className="text-gray-700">
                <strong>Transparence totale</strong> sur l'avancement des développements
              </p>
            </li>
          </ol>
          <p className="text-gray-700">
            Notre approche vous donne un pouvoir direct sur l'évolution de Médiascan tout en nous
            imposant une obligation de résultat.
          </p>
        </section>

        {/* Vision économique */}
        <div className="border-t border-gray-200 my-8"></div>

        <section className="bg-white p-0 md:p-8  mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Notre vision économique à long terme
          </h2>
          <p className="text-gray-700 mb-8">
            Médiascan s'appuie sur trois piliers complémentaires :
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 relative">
              <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-md transform rotate-3">
                Bientôt disponible
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Paiement à l'article</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>
                    <strong>80% reviennent aux créateurs de contenu</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>
                    <strong>20% financent Médiascan</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Accédez aux articles sans multiplier les abonnements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Soutenez directement le journalisme de qualité</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-6 relative">
              <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-md transform rotate-3">
                Bientôt disponible
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                2. Publicité éthique et non ciblée
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>
                    <strong>Pas d'exploitation de vos données personnelles</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>
                    <strong>Pas de pistage publicitaire</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>
                    <strong>Contenu publicitaire en lien avec notre mission</strong> uniquement
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Notre propre régie publicitaire avec nos propres règles éthiques</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 relative">
              <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-md transform rotate-3">
                Bientôt disponible
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Abonnements premium</h3>
              <ul className="space-y-2 opacity-75">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>
                    <strong>Version basique à 4,99€/mois</strong> : fonctionnalités avancées
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>
                    <strong>Version complète à 9,99€/mois</strong> : inclut 5€ de crédits cumulables
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Soutien régulier au projet avec avantages exclusifs</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Fonctionnalités à financer */}
        <div className="border-t border-gray-200 my-8"></div>

        <section className="bg-white px-4 py-0 md:p-8 mb-12">
          <FeatureList />
        </section>

        {/* FAQ - Utilisation du composant réutilisable */}
        <div className="border-t border-gray-200 my-8"></div>
        <section className="bg-white p-4 md:p-8">
          <FAQ
            items={faqItems}
            title="Questions fréquentes sur notre modèle économique"
            itemClassName="border-b border-gray-200 pb-4 mb-6"
          />
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Funding;
