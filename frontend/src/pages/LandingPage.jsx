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
  const [showScrollHint, setShowScrollHint] = useState(true);

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

    // Masquer l'indicateur de défilement après un certain défilement
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollHint(false);
      } else {
        setShowScrollHint(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fonction pour scroller vers une section
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn("La référence n'existe pas ou n'est pas encore attachée à un élément DOM");
    }
  };

  // Fonction pour scroller vers la section "Qu'est-ce que Médiascan"
  const scrollToContent = () => {
    if (whatRef && whatRef.current) {
      whatRef.current.scrollIntoView({ behavior: 'smooth' });
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
        </div>
      </section>

      {/* Indicateur de défilement */}
      <div
        className={`flex flex-col items-center justify-center py-4 transition-opacity duration-500 ${
          showScrollHint ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="text-blue-600 font-medium mb-2">Découvrez-en plus sur Médiascan</p>
        <button
          onClick={scrollToContent}
          className="flex flex-col items-center text-blue-500 hover:text-blue-700 transition-colors focus:outline-none"
          aria-label="Défiler vers le bas"
        >
          <svg
            className="w-8 h-8 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </button>
      </div>

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
          <span>Les dernières vidéos de vos chaines préférées</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="text-blue-500">✓</span>
          <span>Les derniers billets de vos blogs préférés</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="text-blue-500">✓</span>
          <span>Les derniers posts de vos forums </span>
        </li>
        <li className="flex items-center gap-2">
          <span className="text-blue-500">✓</span>
          <span>Et tellement encore </span>
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
              <h4 className="font-bold text-gray-900">Flux éditorialisés par des pairs</h4>
              <p className="text-gray-700">
                Les sources sont regroupées dans des collections éditorialisées par des pairs plutôt
                que des régies publicitaires. Switcher de collections selon votre mood. Faites
                confiance à vos connaissances pour faire les compilations les plus pertinentes
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
              <h4 className="font-bold text-gray-900">Transparence algorithmique</h4>
              <p className="text-gray-700">
                Nos algorithmes seront toujours explicables, justifiés et au service de la
                lisibilité de l'information.
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
                Les utilisateurs guident les évolutions de la plateforme mais aussi son contenu. Par
                exemple, le catalogue de sources et leur métadonnées (orientation, partis pris,
                contexte éditorial) est agrémenté par notre communauté et non par des bots.
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
            icon="🌐"
            title="Couverture médiatique complète"
            description="Explorer un sujet à travers plusieurs sources"
          />
          <FeatureItem
            icon="🇫🇷"
            title="Traduction automatique de contenus"
            description="Lire des articles dans votre langue maternelle"
          />
          <FeatureItem
            icon="⚙️"
            title="Mode découverte et suggestion"
            description="Garder la main sur votre algorithme de recommandation"
          />
        </div>

        <p className="text-gray-600 italic">
          Disponible sur le web. Les versions Android et iOS arrivent prochainement.
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
          Parce que l'accès à une information diversifiée et de qualité est un défi qui existe
          depuis longtemps.
        </strong>
      </p>
      <p className="text-gray-700 mb-6">
        Le paysage médiatique actuel présente des défis structurels bien documentés : concentration
        des médias, modèles économiques basés sur l'engagement émotionnel, et algorithmes optimisés
        pour la publicité plutôt que pour la qualité informationnelle.
      </p>
      <p className="text-gray-700 mb-6">
        Selon une étude Reuters de 2023, plus de 65% des Français expriment leur méfiance envers les
        médias traditionnels, tandis que les plateformes numériques continuent de promouvoir le
        contenu qui génère le plus d'engagement, généralement le plus clivant.
      </p>
      <p className="text-gray-700 mb-6">
        Médiascan propose une approche différente : remettre le contrôle entre vos mains, en vous
        permettant de découvrir et partager des collections de sources sélectionnées par des humains
        en qui vous avez confiance.
      </p>
      <p className="text-gray-700 mb-6">
        Plutôt que des algorithmes opaques qui décident pour vous, nous privilégions les{' '}
        <strong>recommandations humaines complétées par des outils transparents.</strong>
      </p>
      <p className="text-gray-700 mb-6">
        Si vous cherchez à élargir vos horizons informationnels tout en gardant un regard critique,
        Médiascan peut vous y aider.{' '}
        <strong>
          La diversité des perspectives n'est pas un luxe, c'est une nécessité pour comprendre notre
          monde complexe.
        </strong>
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
              Notre graal est un modèle économique basé sur les abonnements des utilisateurs.
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
            <h4 className="font-medium text-gray-900">Le plaisir d'apprendre</h4>
            <p className="text-gray-600">Fluidité et et stimulation de la curiosité</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const WhoWeAre = () => (
  <div className="">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 ">Qui sommes-nous ?</h2>
      <p className="text-gray-700 mb-6">
        Médiascan est un projet français, open source, indépendant et collaboratif.
      </p>
    </div>

    {/* Fondatrice section */}
    <div className="bg-gradient-to-r  rounded-xl p-6 md:p-8">
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
              Chaque soir, je scroll l'actualité noyée dans un flux mainstream qui m'ennuie ou
              m'agace. L'information de qualité se raréfie et cela m'angoisse.
            </p>
            <p>Qu'est ce que je pourrais faire de bien dans le monde avec mes compétences ?</p>
            <p>
              Je développe Médiascan de A à Z - design, code, stratégie - portée par la conviction
              qu'il y a une place dans le marché francais pour un outil de veille à la fois sérieux,
              souverain et grand public .
            </p>
            <p>
              Médiascan est mon invitation à ne pas abandonner la compréhension du monde. À choisir
              l'humilité plutôt que les certitudes. À accepter la complexité plutôt que les
              simplifications toxiques.
            </p>
            <p>
              Cela ne va pas changer le monde mais j'espère juste qu'il pourra offrir une petite
              bouée à ceux qui, comme moi, refusent de se noyer dans le bruit ou de s'isoler sur la
              rive.
            </p>
            <p>
              <strong>Alice Poggioli</strong>
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
