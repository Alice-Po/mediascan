import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ContactForm from '../components/common/ContactForm';
import Footer from '../components/common/Footer';
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
              Redécouvrez le plaisir de l'information
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Médiascan est un agrégateur d'actualités qui vous permet d'explorer l'information sous
              toutes ses perspectives, en toute transparence et sans algorithmes manipulateurs.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Créer un compte gratuit
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

        {/* Section: Comment tester */}
        <section ref={howRef} className="bg-white rounded-xl  p-6 md:p-8">
          <HowToTest />
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
          <FAQ />
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
        <h3 className="text-xl font-semibold text-gray-900">
          Notre plateforme vous offrira à terme :
        </h3>

        <div className="space-y-4">
          <FeatureItem
            icon="📚"
            title="Un catalogue enrichi collectivement"
            description="Description transparente des sources (orientation, financement, ligne éditoriale)"
          />

          <FeatureItem
            icon="💰"
            title="Des crédits pour lire des articles payants"
            description="À l'unité sans abonnement"
          />

          <FeatureItem
            icon="🎵"
            title="Des bibliographies thématiques"
            description="Créées par des passionnés, comme des playlists Spotify pour l'information"
          />

          <FeatureItem
            icon="🔍"
            title="Une fonction 'radar'"
            description="Pour créer des alertes comme le Bon Coin sur les sujets qui vous intéressent"
          />

          <FeatureItem
            icon="🌐"
            title="Une application open source et collaborative"
            description="Garantissant une transparence algorithmique totale"
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
        <strong>Le web est devenu toxique pour notre rapport à l'information.</strong>
      </p>
      <p className="text-gray-700 mb-6">
        Les <strong>algorithmes opaques</strong> favorisent{' '}
        <strong>l'émotion plutôt que la pertinence</strong>, creusant les{' '}
        <strong>divisions sociales</strong> et affaiblissant notre{' '}
        <strong>capacité d'empathie</strong>.
      </p>
      <p className="text-gray-700 mb-6">
        <strong>Nous jugeons "fous" ceux que nous ne comprenons pas</strong> simplement parce que
        nos sources d'information diffèrent.
      </p>
      <p className="text-gray-700 mb-6">
        <strong>Être bien informé devient paradoxalement plus difficile</strong> malgré l'abondance
        de contenus.
      </p>
      <p className="text-gray-700 mb-6">
        <strong>Les divergences d'opinions se transforment en fractures sociales</strong>, terrain
        fertile pour les ingérences étrangères.
      </p>
    </div>

    <div className="bg-blue-50 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Médiascan propose une alternative fondée sur :
      </h3>

      <div className="space-y-6">
        <div className="flex gap-4 items-start">
          <div className="bg-blue-100 p-2 rounded-full">
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
          <div className="bg-blue-100 p-2 rounded-full">
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
          <div className="bg-blue-100 p-2 rounded-full">
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
          <div className="bg-blue-100 p-2 rounded-full">
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

const HowToTest = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Comment tester Médiascan ?</h2>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <ol className="space-y-6">
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                1
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Inscrivez-vous gratuitement</h3>
                <p className="text-gray-600">sur notre plateforme web</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                2
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Explorez notre catalogue</h3>
                <p className="text-gray-600">de sources d'information variées</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                3
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  Configurer votre premier fils d'actualité
                </h3>
                <p className="text-gray-600">
                  en selectionnant ou en ajoutant vos sources d'information préférées
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <p className="text-center text-gray-600">
            La version web est déjà disponible. Les applications mobiles sont en cours de
            développement.
          </p>
        </div>
      </div>
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
  <div className="space-y-8">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Qui sommes-nous ?</h2>
      <p className="text-gray-700 mb-6">
        Médiascan est un projet français, indépendant et collaboratif qui défend une vision éthique
        de l'information numérique.
      </p>
    </div>

    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Notre équipe de passionnés travaille pour :
      </h3>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <p className="text-gray-700">Développer un outil qui respecte votre intelligence</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <p className="text-gray-700">Promouvoir la diversité des points de vue</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <p className="text-gray-700">Soutenir un journalisme de qualité économiquement viable</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-700">
            Créer une alternative aux géants technologiques qui exploitent vos données
          </p>
        </div>
      </div>
    </div>

    {/* Footer CTA */}
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 px-4 mt-24">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold mb-6">Tester Médiascan</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Créer un compte gratuit
          </Link>
        </div>
      </div>
    </section>
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

const FAQ = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Foire aux questions</h2>
    </div>

    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Est-ce que Médiascan utilise mes données personnelles ?
        </h3>
        <p className="text-gray-700">
          Non. Notre code est open source et nous ne collectons que les données strictement
          nécessaires au fonctionnement du service.
        </p>
      </div>

      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Comment sont sélectionnées les sources ?
        </h3>
        <p className="text-gray-700">
          Le catalogue est enrichi collectivement. Chaque source est décrite par la personne qui
          l'ajoute (orientation, financement, ligne éditoriale).
        </p>
      </div>

      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Puis-je proposer de nouvelles sources ?
        </h3>
        <p className="text-gray-700">
          Absolument ! Médiascan est un projet collaboratif qui s'enrichit grâce aux contributions
          de sa communauté. Nous réflechissons à un système de modération collaboratif.
        </p>
      </div>

      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Comment fonctionne le paiement à l'article ?
        </h3>
        <p className="text-gray-700">
          La fonctionalités est encore en réfléxion. Nous envisageons une approche de connexion
          unique à tous les média partenaires avec un SSO Médiascan pour une expérience utilisateur
          fluide. Nous sommes en train d'étudier la solution libre{' '}
          <a
            href="https://www.taler.net/fr/index.html"
            target="_blank"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            GNU Taler
          </a>{' '}
          qui permettrait de réduire drastiquement les frais de transaction des applications
          américaines dominantes comme Stripes
        </p>
      </div>

      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Quand les applications mobiles seront-elles disponibles ?
        </h3>
        <p className="text-gray-700">
          Le développement est en cours. Le calendrier dépend du succès de notre campagne de
          financement participatif.
        </p>
      </div>
    </div>
  </div>
);

export default LandingPage;
