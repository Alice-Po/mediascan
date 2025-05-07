import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ContributionModal from '../components/common/ContributionModal';
import Footer from '../components/common/Footer';
import FeatureList from '../components/features/FeatureList';

const Funding = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(0);

  const openModal = (feature, amount) => {
    setSelectedFeature(feature);
    setSelectedAmount(amount);
    setModalOpen(true);
  };

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
              {/* <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md text-sm text-yellow-800">
                <p className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Disponible lors du lancement officiel, prévu pour le dernier trimestre 2025.
                </p>
              </div> */}
            </div>
          </div>
        </section>

        {/* Fonctionnalités à financer */}
        <div className="border-t border-gray-200 my-8"></div>

        <section className="bg-white px-4 py-0 md:p-8 mb-12">
          <FeatureList openContributionModal={openModal} />
        </section>

        {/* Call to Action */}
        {/* <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 md:p-8 text-white shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Comment soutenir Médiascan aujourd'hui ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <button
                onClick={() => openModal('Médiascan', 10)}
                className="text-lg font-medium hover:underline mb-2 flex flex-col items-center justify-center w-full h-full"
              >
                <span className="text-3xl mb-2">🤝</span>
                <span>Faire une promesse de don</span>
              </button>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <Link
                to="/register"
                className="text-lg font-medium hover:underline mb-2 flex flex-col items-center justify-center w-full h-full"
              >
                <span className="text-3xl mb-2">🚀</span>
                <span>Créer un compte et tester</span>
              </Link>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <a
                href="#"
                className="text-lg font-medium hover:underline mb-2 flex flex-col items-center justify-center w-full h-full"
                onClick={(e) => {
                  e.preventDefault();
                  navigator
                    .share({
                      title: "Médiascan - Redécouvrez le plaisir de l'information",
                      text: "Découvrez Médiascan, un agrégateur d'actualités qui vous permet d'explorer l'information sous toutes ses perspectives.",
                      url: window.location.origin,
                    })
                    .catch(() => {
                      alert('Copiez ce lien et partagez-le : ' + window.location.origin);
                    });
                }}
              >
                <span className="text-3xl mb-2">📣</span>
                <span>Partager le projet</span>
              </a>
            </div>
          </div>
        </section> */}

        {/* FAQ */}
        <div className="border-t border-gray-200 my-8"></div>
        <section className="bg-white p-4 md:p-8 ">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Questions fréquentes sur notre modèle économique
          </h2>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Que se passe-t-il si l'objectif de financement n'est pas atteint pour une
                fonctionnalité ?
              </h3>
              <p className="text-gray-700">
                Les promesses ne sont pas prélevées. Nous continuons à collecter des promesses
                jusqu'à atteindre l'objectif ou redéfinissons nos priorités.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Comment garantissez-vous que les fonctionnalités seront développées comme promis ?
              </h3>
              <p className="text-gray-700">
                Nous communiquons régulièrement sur l'avancement des développements et ne prélevons
                les fonds que lorsque la fonctionnalité est livrée et testée.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Comment sont déterminés les objectifs de financement ?
              </h3>
              <p className="text-gray-700">
                Ils correspondent aux coûts réels de développement, incluant le temps de travail des
                développeurs, les tests, et la maintenance.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Est-ce que je peux annuler ma promesse de don ?
              </h3>
              <p className="text-gray-700">
                Oui, à tout moment avant que la fonctionnalité soit complètement développée et que
                le paiement soit demandé.
              </p>
            </div>

            <div className="border-b border-gray-200 ">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Comment fonctionnera concrètement le paiement à l'article ?
              </h3>
              <p className="text-gray-700">
                Vous chargez des crédits dans votre porte-monnaie virtuel et décidez quand les
                utiliser. Un système de micropaiement simple et transparent, sans engagement.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* Modal de contribution */}
      <ContributionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        feature={selectedFeature}
        amount={selectedAmount}
      />
    </div>
  );
};

// Composant pour les cartes de fonctionnalités
const FeatureCard = ({ title, goal, current, description, icon, color, openModal }) => {
  const progress = (current / goal) * 100;
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const progressBarClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    indigo: 'bg-indigo-500',
    amber: 'bg-amber-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${colorClasses[color]}`}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">Objectif : {goal.toLocaleString()}€</p>
          </div>
        </div>

        <p className="text-gray-700 mb-6">{description}</p>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{current.toLocaleString()}€ collectés</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${progressBarClasses[color]}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[5, 10, 20, 50, 100].map((amount) => (
            <button
              key={amount}
              onClick={() => openModal(title, amount)}
              className={`px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50`}
            >
              {amount}€
            </button>
          ))}
          <button
            onClick={() => openModal(title, 0)}
            className={`px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50`}
          >
            Autre
          </button>
        </div>
      </div>
    </div>
  );
};

export default Funding;
