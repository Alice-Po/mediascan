import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ContactForm from '../components/common/ContactForm';
import Footer from '../components/common/Footer';
import Accordion from '../components/common/Accordion';
import FAQ from '../components/common/FAQ';
// Feature Item Component
const FeatureItem = ({ icon, title, description }) => (
  <div className="flex gap-4 items-start">
    <div className="text-2xl text-blue-500 mt-1">{icon}</div>
    <div>
      <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  // Définir contactRef ici, au niveau du composant principal
  const contactRef = useRef(null);

  // Références pour le scroll
  const whatRef = useRef(null);
  const whyRef = useRef(null);
  const howRef = useRef(null);
  const supportRef = useRef(null);
  const teamRef = useRef(null);
  const faqRef = useRef(null);

  // Animation d'entrée
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fonction pour scroller vers une section
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn("La référence n'existe pas ou n'est pas encore attachée à un élément DOM");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section
        className={`py-16 md:py-24 px-4 transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Médiascan</h1>
            <h2 className="text-xl md:text-2xl text-blue-700 font-medium mb-8">
              Ici on respecte votre intelligence, votre attention et vos données
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Médiascan est un agrégateur social d'actualités open source français qui vous permet
              d'explorer l'information qui vous interesse sous toutes ses perspectives et en toute
              transparence.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Créer un compte gratuit
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Se connecter
              </Link>
            </div>
          </div>

          {/* Images */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12">
            <div className="hidden md:block w-full max-w-2xl">
              <img
                src="/illu-mediascan-desktop.png"
                alt="Médiascan sur ordinateur"
                className="w-full h-auto rounded-lg "
              />
            </div>
            <div className="md:hidden w-full max-w-xs">
              <img
                src="/illu-mediascan-smartphone.png"
                alt="Médiascan sur smartphone"
                className="w-full h-auto rounded-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full max-w-6xl mx-auto border-t border-gray-200 my-8"></div>

      {/* Sections qui se suivent */}
      <div className="container mx-auto max-w-6xl px-4 space-y-24 py-12">
        {/* Section: Qu'est-ce que Médiascan */}
        <section ref={whatRef} className="bg-white rounded-xl p-6 md:p-8">
          <WhatIsMediascan />
        </section>

        {/* Section: Pourquoi Médiascan */}
        <section ref={whyRef} className="bg-white rounded-xl  p-6 md:p-8">
          <WhyMediascan />
        </section>

        {/* Section: Nous soutenir */}
        <section ref={supportRef} className="bg-white rounded-xl  p-6 md:p-8">
          <SupportUs contactRef={contactRef} scrollToSection={scrollToSection} />
        </section>

        {/* Section: Contact */}
        <section ref={contactRef} id="contact" className="bg-white rounded-xl  p-6 md:p-8">
          <ContactFormSection />
        </section>

        {/* Section: Qui sommes-nous */}
        <section ref={teamRef} className="bg-white rounded-xl  p-6 md:p-8">
          <WhoWeAre />
        </section>

        {/* Section: FAQ */}
        <section ref={faqRef} className="bg-white rounded-xl  p-6 md:p-8">
          <FAQSection />
        </section>
      </div>

      <Footer />
    </div>
  );
};

// Gardez tous vos composants de section existants
const WhatIsMediascan = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Qu'est-ce que Médiascan ?</h2>
      <p className="text-gray-700 mb-6">
        Médiascan est une application qui réunit en un seul endroit :
      </p>

      <ul className="space-y-2 mb-8">
        <li className="flex items-center gap-2">
          <span className="text-blue-500">✓</span>
          <span>Vos articles de presse</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="text-blue-500">✓</span>
          <span>Vos infolettres</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="text-blue-500">✓</span>
          <span>Les comptes de réseaux sociaux qui vous intéréssent</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="text-blue-500">✓</span>
          <span>Les dernières vidéos de vos chaines YouTube</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="text-blue-500">✓</span>
          <span>Les derniers billets de vos blogs préférés</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="text-blue-500">✓</span>
          <span>Et peut-être encore d'autres choses</span>
        </li>
      </ul>

      {/* Principes clés mis en évidence */}
      <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500 my-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Nos principes fondamentaux</h3>

        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="hidden sm:block bg-blue-100 p-2 rounded-full flex-shrink-0">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Recommandation humaine</h4>
              <p className="text-gray-700">
                Notre approche est centrée sur la recommandation humaine. Les sources sont
                regroupées dans des collections éditorialisées par des pairs plutôt que sur des
                tendances algorithmiques induites par des clics.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="hidden sm:block bg-blue-100 p-2 rounded-full flex-shrink-0">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Qualité plutôt que quantité</h4>
              <p className="text-gray-700">
                Nous privilégions la qualité plutôt que la quantité. Dans un feed avec différentes
                sources, nous donnons plus de visibilité à celles qui publient moins souvent, car
                celui qui parle peu a tendance à dire des choses plus intéressantes.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="hidden sm:block bg-blue-100 p-2 rounded-full flex-shrink-0">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Intelligence collective</h4>
              <p className="text-gray-700">
                Nous cherchons prudemment la sagesse de la foule : le catalogue de sources est
                piloté par la communauté et enrichi de métadonnées (financement, parti pris,
                contexte éditorial) pour permettre une modération éclairée. Même si la foule peut se
                tromper, la légitimité naît du dialogue et de la contestation, et non de la voix de
                l'autorité.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <div className="md:hidden">
        <img
          src="/illu-mediascan-smartphone.png"
          alt="Médiascan sur smartphone"
          className="w-full h-auto rounded-lg "
        />
      </div>
      <div className="hidden md:block">
        <img
          src="/illu-mediascan-desktop.png"
          alt="Médiascan sur ordinateur"
          className="w-full h-auto rounded-lg "
        />
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Les fonctionalités à venir :</h3>

        <div className="space-y-4">
          <FeatureItem
            icon="💰"
            title="Des crédits pour lire des articles payants"
            description="À l'unité sans abonnement"
          />
          <FeatureItem
            icon="🔍"
            title="Une fonction 'radar'"
            description="Pour créer des alertes comme le Bon Coin sur les sujets qui vous intéressent"
          />

          <FeatureItem
            icon="🌐"
            title="Couverture médiatique complète"
            description="Explorer un sujet à travers plusieurs sources"
          />
          <FeatureItem
            icon="🇫🇷"
            title="Traduction automatique de contenu"
            description="Lire des articles dans votre langue maternelle"
          />
          <FeatureItem
            icon="⚙️"
            title="Mode découverte et suggestion"
            description="Garder la main sur votre algorithme de recommandation"
          />
        </div>

        <p className="text-gray-600 italic">
          Disponible sur le web, avec des versions Android et iOS en développement.
        </p>
      </div>
    </div>
  </div>
);

const WhyMediascan = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Pourquoi Médiascan ?</h2>
      <p className="text-gray-700 mb-6">
        <strong>
          Parce que nous ne sommes pas condamnés à choisir entre rester ignorants ou être manipulés.
        </strong>
      </p>
      <p className="text-gray-700 mb-6">
        Le web d'aujourd'hui nous pousse vers l'information qui nous met en colère plutôt que celle
        qui nous éclaire. Les algorithmes nous enferment dans des bulles où tous pensent comme nous,
        pendant que l'IA génère du contenu calibré pour capter notre attention, pas pour nourrir
        notre réflexion.
      </p>
      <p className="text-gray-700 mb-6">
        Médiascan est né d'un constat simple : pour naviguer dans un monde façonné par des
        intelligences artificielles,{' '}
        <strong>
          nous avons besoin d'outils qui fasse la place à notre intelligence humaine, pas qui la
          remplacent.
        </strong>
      </p>
      <p className="text-gray-700 mb-6">
        Nous redonnons le pouvoir aux relations humaines dans votre parcours d'information.{' '}
        <strong>
          Car la confiance ne se calcule pas avec des algorithmes, elle se bâtit entre personnes.
        </strong>
      </p>
      <p className="text-gray-700 mb-6">
        Si vous êtes fatigué de vous sentir manipulé par votre fil d'actualités ou dépassé par la
        polarisation des débats, Médiascan est fait pour vous.{' '}
        <strong>Reprenez le contrôle sur ce qui mérite votre attention.</strong>
      </p>
    </div>

    <div className="bg-green-50 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Médiascan propose une alternative fondée sur :
      </h3>

      <div className="space-y-6">
        <div className="flex gap-4 items-start">
          <div className="bg-green-100 p-2 rounded-full">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">La transparence technique</h4>
            <p className="text-gray-600">Code open source et algorithmes explicables</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="bg-green-100 p-2 rounded-full">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">L'indépendance</h4>
            <p className="text-gray-600">
              Résistance aux pressions commerciales, développement guidé par les besoins réels
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="bg-green-100 p-2 rounded-full">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Le pluralisme intellectuel</h4>
            <p className="text-gray-600">Diversité des perspectives, refus du dogmatisme</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="bg-green-100 p-2 rounded-full">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">L'humanisme informationnel</h4>
            <p className="text-gray-600">
              L'information comme plaisir, respect de votre intelligence
            </p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center font-medium text-gray-900">
        Notre objectif est de vous aider à comprendre le monde dans sa complexité, pas à le
        simplifier.
      </p>
    </div>
  </div>
);

const SupportUs = ({ contactRef, scrollToSection }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Comment nous soutenir ?</h2>
        <p className="text-gray-700 mb-6">
          Médiascan se développe grâce à votre soutien. Voici comment vous pouvez nous aider :
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Financement participatif</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>
                <strong>Faites des promesses de dons</strong> pour les fonctionnalités qui vous
                semblent prioritaires
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>
                <strong>Payez uniquement</strong> une fois la fonctionnalité développée et
                opérationnelle
              </span>
            </li>
          </ul>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">
            <a href="/funding" target="_blank">
              Explorer les fonctionalités
            </a>
          </button>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Vous êtes un média ou un blogueur ?
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>
                <strong>Contactez-nous</strong> pour participer aux premières expériementations
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>
                <strong>80% reviennent aux créateurs</strong> de contenus et{' '}
                <strong>20% financent Médiascan</strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>
                <strong>L'équipe technique de Médiascan cherche des partenaires</strong> pour tester
                une implémentation de{' '}
                <a
                  href="https://www.taler.net/fr/index.html"
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  GNU Taler
                </a>
                , solution libre de micro-paiement soutenu par NGI.
              </span>
            </li>
          </ul>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
            onClick={() => scrollToSection(contactRef)}
          >
            Contactez-nous
          </button>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 relative">
          {/* Badge "Bientôt disponible" */}
          <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-md transform rotate-3">
            Bientôt disponible
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Optez pour un abonnement premium
          </h3>
          <p>
            Devenez membre premium soutenir le developpement du projet et participer aux grandes
            décisions du projet.
          </p>
          <br />

          <ul className="space-y-2 opacity-75">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>
                <strong>4,99€/mois</strong> pour l'accès aux fonctionnalités avancées
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>
                <strong>9,99€/mois</strong> dont 5€ de crédits cumulables pour lire des articles
                payants
              </span>
            </li>
          </ul>

          {/* Message explicatif */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md text-sm text-yellow-800">
            <p className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Les abonnements premium seront disponibles lors du lancement officiel de Médiascan,
              prévu pour le dernier trimestre 2025.
            </p>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Faites-nous des retours</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>
                Faites découvrir notre projet à votre entourage, enquêter sur ses besoins et
                faites-nous des retours
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>Faites remonter des bugs ou des suggestions</span>
            </li>
          </ul>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
            onClick={() => scrollToSection(contactRef)}
          >
            Envoie-nous un message
          </button>
        </div>
      </div>
    </div>
  );
};

const WhoWeAre = () => (
  <div className="">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 ">Qui sommes-nous ?</h2>
      <p className="text-gray-700 mb-6">
        Médiascan est un projet français, open source, indépendant et collaboratif.
      </p>
    </div>

    {/* Fondatrice section */}
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Photo avec bordure arrondie */}
        <div className="flex-shrink-0 mb-4 md:mb-0">
          <img
            src="/_alice-poggioli-comp.DDy5gSTJ_ZROOdi_webp.png"
            alt="Alice Poggioli, fondatrice de Médiascan"
            className="w-48 h-48 object-cover rounded-full border-4 border-white shadow-lg"
          />
        </div>

        {/* Biographie */}
        <div className="flex-1">
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Je suis développeuse web, animatrice communautaire et créatrice de Médiascan. J'ai
              fais trois années sur le terrain à faire de la médiation numérique dans le bocage
              ornais. J'ai vu comment l'information transforme les gens - ou les laisse sur le
              carreau.
            </p>
            <p>
              Chaque soir, je scroll l'actualité numérique noyée dans un flux mainstream qui
              m'ennuie ou m'énerve. L'information de qualité se raréfie et ça m'angoisse.
            </p>
            <p>
              J'ai failli échanger mon clavier contre une bêche, déconnecter pour de bon, choisir la
              simplicité.
            </p>
            <p>
              Mais j'ai choisi de rester dans la partie. Je développe Médiascan de A à Z - design,
              code, stratégie - portée par une conviction : nous méritons mieux que ce qu'on nous
              sert.
            </p>
            <p>
              Médiascan est mon invitation à ne pas abandonner la compréhension du monde. À choisir
              l'humilité plutôt que les certitudes. À accepter la complexité plutôt que les
              simplifications toxiques.
            </p>
            <p>
              Ce ne sera pas une révolution. Juste un moyen d'offrir une petite bouée à ceux qui,
              comme moi, refusent de se noyer dans le bruit ou de s'isoler sur la rive.
            </p>
            <p>
              <strong>Alice Poggioli</strong>
              <span className="text-gray-500 text-sm">, fondatrice</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ContactFormSection = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Contactez-nous</h2>
    <p className="text-gray-600 mb-8">
      Vous avez des questions, des suggestions ou souhaitez en savoir plus sur Médiascan ? N'hésitez
      pas à nous contacter via le formulaire ci-dessous.
    </p>
    <ContactForm />
  </div>
);

// Place this outside of components, near other constants
const FAQ_ITEMS = [
  {
    question: 'Est-ce que Médiascan va mettre en place de la publicité sur sa version gratuite ?',
    answer:
      "Trés certainement. Ceci dit, vous ne trouverez jamais de publicité frauduleuse pour des panneaux solaires ou des appareils auditifs révolutionnaires sur notre plateforme, la régie publicitaire étant gouvernée par la communauté d'abonnés premium.",
  },
  {
    question: "Est ce que MédiaScan intégre des outils d'IA ?",
    answer:
      "Absolument. Nous ne pouvons pas se défendre d'un monde complexe avec des outils simples. Nous refusons un dilemme entre un refus dogmatique qui nous condamnerait à la marginalité, ou une fascination aveugle qui sacrifierait vos intérêts sur l'autel de l'innovation. Notre communauté d'abonné premium sera arbitre des choix que nous ferons en la matière. Notre ambition n'est pas de créer un outil de niche pour quelques initiés, mais une solution accessible ce qui necessite d'être à la hauteur des standards et attentes élevés du grand public.",
  },
];

// Remove the old FAQ component and replace with:
const FAQSection = () => (
  <div className="">
    <FAQ items={FAQ_ITEMS} />
  </div>
);

export default LandingPage;
