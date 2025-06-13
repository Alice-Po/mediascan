import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ContactForm from '../components/common/ContactForm';
import Footer from '../components/common/Footer';
import Accordion from '../components/common/Accordion';
import FAQ from '../components/common/FAQ';
import {
  ChevronDownIcon,
  UserGroupIcon,
  LightBulbIcon,
  UsersIcon,
  LightningIcon,
  ScaleIcon,
  ShieldLockIcon,
  ArrowRightIcon,
} from '../components/common/icons';

// Feature Item Component
const FeatureItem = ({ icon, title, description }) => (
  <div className="flex gap-4 items-start group hover:transform hover:translate-y-[-2px] transition-all duration-300">
    <div className="text-2xl text-blue-500 mt-1 group-hover:text-blue-600 transition-colors">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

// Hero Section Component
const HeroSection = ({ isVisible, showScrollHint, scrollToContent }) => (
  <section
    className={`py-20 md:py-28 px-4 transition-all duration-1000 ${
      isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
    }`}
  >
    <div className="container mx-auto max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Médiascan
        </h1>
        <h2 className="text-2xl md:text-3xl text-blue-700 font-semibold mb-8 leading-relaxed">
          Agrégateur d'actualités à curation humaine
        </h2>
        <h3 className="text-xl md:text-2xl text-gray-700 font-medium mb-6 leading-relaxed">
          Prenez le contrôle de votre fil d'actualité
        </h3>

        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
          Construisez vos propres fils d'actualité en sélectionnant les sources qui correspondent à
          vos centres d'intérêt pour suivre toute l'actualité qui vous intéressent, en un seul
          endroit.
        </p>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
          La plateforme propose également des <strong>collections publiques</strong> créées par
          d'autres utilisateurs, permettant de suivre des fils d'actualité{' '}
          <strong>éditorialisés par des personnes reconnues dans leur domaine d'expertise</strong>.
        </p>

        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
          Médiascan est <strong>français et open source</strong>
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <Link
            to="/register"
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Créer un compte
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-blue-600"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>

    {/* Scroll Indicator */}
    <div
      className={`flex flex-col items-center justify-center py-6 transition-all duration-500 ${
        showScrollHint ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
      }`}
    >
      <p className="text-blue-600 font-medium mb-3">Découvrez-en plus sur Médiascan</p>
      <button
        onClick={scrollToContent}
        className="flex flex-col items-center text-blue-500 hover:text-blue-700 transition-all duration-300 focus:outline-none transform hover:scale-110"
        aria-label="Défiler vers le bas"
      >
        <ChevronDownIcon className="w-8 h-8" />
      </button>
    </div>
  </section>
);

// Frustrations Section Component
const FrustrationsSection = () => (
  <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-8 shadow-lg transform hover:shadow-xl transition-all duration-300">
    <h3 className="text-2xl font-semibold text-gray-900 mb-8 leading-tight">
      Vous en avez marre de...
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="flex gap-4 items-start">
        <div className="text-2xl flex-shrink-0">📱</div>
        <div>
          <h4 className="font-medium text-gray-900">Perdre du temps sur les réseaux</h4>
          <p className="text-gray-600">
            Scroller sans fin sur Twitter, Reddit ou LinkedIn pour tomber sur 10% d'info utile noyée
            dans le bruit ambiant
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        <div className="text-2xl flex-shrink-0">🤖</div>
        <div>
          <h4 className="font-medium text-gray-900">
            Se sentir enfermé dans une bulle informationnelle
          </h4>
          <p className="text-gray-600">
            Ne plus comprendre pourquoi on vous montre tel contenu plutôt qu'un autre, sans contrôle
            sur votre fil d'actualité
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        <div className="text-2xl flex-shrink-0">🔍</div>
        <div>
          <h4 className="font-medium text-gray-900">Chercher l'aiguille dans la botte de foin</h4>
          <p className="text-gray-600">
            Passer plus de temps à chercher l'information qu'à la lire et la comprendre
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        <div className="text-2xl flex-shrink-0">🎭</div>
        <div>
          <h4 className="font-medium text-gray-900">Subir la manipulation</h4>
          <p className="text-gray-600">
            Être exposé à de la désinformation, des bots et des contenus générés par IA de mauvaise
            qualité
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        <div className="text-2xl flex-shrink-0">⚡</div>
        <div>
          <h4 className="font-medium text-gray-900">L'accélération permanente</h4>
          <p className="text-gray-600">
            Avoir l'impression de courir après l'actualité et de toujours rester dans la
            superficialité
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Notre Approche Section Component
const NotreApprocheSection = () => (
  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-8 shadow-lg">
    <h2 className="text-3xl font-semibold text-center mb-12">
      Notre approche : <span className="text-blue-600">Suivez toutes vos sources préférées</span> en
      un seul endroit
    </h2>

    <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
      <div className="space-y-6">
        <div className="bg-white/60 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4">
            <span className="text-2xl">📱</span>
            <div>
              <h3 className="font-medium text-gray-900">Créer vos fils d'actualités sur mesure</h3>
              <p className="text-sm text-gray-600 mt-1">
                Personnalisez votre flux selon vos centres d'intérêt
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4">
            <span className="text-2xl">🤝</span>
            <div>
              <h3 className="font-medium text-gray-900">
                Partager les avec vos collègue ou vos amis
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Créez une communauté autour de vos intérêts
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4">
            <span className="text-2xl">👥</span>
            <div>
              <h3 className="font-medium text-gray-900">Suivez ceux de personnes respectées</h3>
              <p className="text-sm text-gray-600 mt-1">
                Accédez à des contenus sélectionnés par des experts
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4">
            <span className="text-2xl">⭐</span>
            <div>
              <h3 className="font-medium text-gray-900">
                Devenez une personnalité curatrice reconnue
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Partagez votre expertise et gagnez en visibilité
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="bg-white/40 rounded-xl overflow-hidden shadow-lg ">
        <picture>
          <source media="(min-width: 768px)" srcSet="illu-mediascan-desktop.png" />
          <source media="(max-width: 767px)" srcSet="illu-mediascan-smartphone.png" />
          <img
            src="illu-mediascan-desktop.png"
            alt="Interface Médiascan"
            className="w-full object-contain rounded-lg transform hover:scale-105 transition-transform duration-300"
          />
        </picture>
      </div> */}
    </div>
  </div>
);

// Comment ça marche Section Component
const CommentCaMarcheSection = () => (
  <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-8 shadow-lg transform hover:shadow-xl transition-all duration-300">
    <h2 className="text-2xl font-semibold text-gray-900 mb-8 leading-tight">Comment ça marche ?</h2>

    <div className="space-y-12 mb-12">
      <div className="flex gap-6">
        <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl font-bold text-green-700">
          1
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Découvrez et suivez les collections public de vos curateurs préférés
          </h3>
          <p className="text-gray-600">
            <strong>
              Les collections sont des selections de sources qui génère un fils d'actualité
              thématique
            </strong>
          </p>
          <p className="text-gray-600">
            Découvrez les collections créées par des personnes dont vous appréciez le regard et la
            sélection autour d'une thématique: "Tech éthique", "Actualités positives", "Économie
            décryptée"...
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl font-bold text-green-700">
          2
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Créez vos propres collections
          </h3>
          <p className="text-gray-600">
            <strong>
              Vous pouvez créer vos propres collections en sélectionnant les sources qui vous
              intéressent
            </strong>
          </p>
          <p className="text-gray-600">
            Une source peut être un articles, newsletters, vidéos, comptes de réseaux sociaux ou
            podcasts...
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl font-bold text-green-700">
          3
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Plonger dans les sujets</h3>
          <p className="text-gray-600">
            Selon si vous êtes au travail ou dans votre canapé, déprimé ou exalté, changer de
            collection selon votre envie, votre humeur, votre curiosité. Vous avez les clefs pour
            aller directement explorer le sujet qui vous intérésse en vous basant sur l'expertise
            des autres.
          </p>
        </div>
      </div>
    </div>

    {/* Exemple concret */}
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300">
      <h3 className="flex items-center gap-2 text-2xl font-semibold text-gray-900 mb-6">
        <span className="text-2xl">💡</span>
        Exemple concret
      </h3>
      <p className="text-gray-700 mb-8">
        Marie, journaliste spécialisée en cybersécurité, crée sa collection "Cyber pour tous". Dans
        sa sélection, vous retrouvez :
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="flex gap-3">
          <div className="text-xl">📰</div>
          <div>
            <h4 className="font-medium text-gray-900">Articles de presse</h4>
            <p className="text-gray-600">Le Monde Informatique, ZDNet...</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="text-xl">📧</div>
          <div>
            <h4 className="font-medium text-gray-900">Newsletters</h4>
            <p className="text-gray-600">CERT-FR, Cyberguerre...</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="text-xl">🎥</div>
          <div>
            <h4 className="font-medium text-gray-900">Chaînes YouTube</h4>
            <p className="text-gray-600">Cookie connecté, Underscore_...</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="text-xl">💬</div>
          <div>
            <h4 className="font-medium text-gray-900">Comptes experts</h4>
            <p className="text-gray-600">@fs0c131y, @blueteamsec...</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="text-xl">📊</div>
          <div>
            <h4 className="font-medium text-gray-900">Blogs spécialisés</h4>
            <p className="text-gray-600">ANSSI, blog.malwarebytes.com...</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="text-xl">🔗</div>
          <div>
            <h4 className="font-medium text-gray-900">Subreddits</h4>
            <p className="text-gray-600">r/cybersecurity, r/netsec...</p>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-12">
        Si vous vous intéressez au sujet, vous n'avez qu'à suivre sa collection pour recevoir le
        meilleur de tous ces contenus dans un seul endroit, sans le bruit.
      </p>
    </div>
  </div>
);

// Credits Section Component
const CreditsSection = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300">
    <div className="max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="flex items-start gap-4 mb-8">
        <div className="text-2xl flex-shrink-0">💭</div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Une réflexion en cours : le soutien aux créateurs
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Le modèle économique actuel de l'information en ligne pose question : multiplication des
            abonnements, précarité des créateurs, course au clic... L'accélération des usage des
            agents conversationnelles unilisant l'ia accentue les difficultés financières des
            créateurs. Nous réfléchissons à des alternatives.
          </p>
        </div>
      </div>

      {/* Le concept */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-xl">🎯</span>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Une piste : les micro-paiements</h4>
            <p className="text-gray-600">
              Et si nous pouvions payer uniquement pour les contenus qui nous intéressent vraiment ?
              Un système de crédits permettrait de rémunérer directement les créateurs tout en
              offrant plus de flexibilité aux lecteurs.
            </p>
            <div className="mt-3 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg inline-block">
              Prix envisagés : 0,20€ à 2€ selon la profondeur du contenu
            </div>
          </div>
        </div>
      </div>

      {/* Participez */}
      <div className="text-center text-gray-600">
        <p className="max-w-2xl mx-auto text-sm">
          Cette réflexion est en cours et nous n'avons pas toutes les réponses. Si ce sujet vous
          intéresse, n'hésitez pas à nous partager vos idées.
        </p>
      </div>
    </div>
  </div>
);

// FAQ Items
const FAQ_ITEMS = [
  {
    question: 'Comment est financé Médiascan ?',
    answer:
      "Nous allons mettre en place un abonnement payant pour avoir accés à certaines fonctionalités comme l'ajout de newsletter, les alertes ou les recherches  approfondies",
  },
  {
    question: 'Est-ce que Médiascan va mettre en place de la publicité ?',
    answer:
      "Dans la version gratuit, il est possible que nous optons pour de la publicité. Ceci dit, vous ne trouverez jamais de publicité frauduleuse pour des panneaux solaires ou des appareils auditifs révolutionnaires sur notre plateforme, la régie publicitaire étant gouvernée par la communauté d'abonnés premium.",
  },
  {
    question: "Est ce que MédiaScan intégre des outils d'IA ?",
    answer:
      "Absolument. Nous ne pouvons pas se défendre d'un monde complexe avec des outils simples. Nous refusons un dilemme entre un refus dogmatique qui nous condamnerait à la marginalité, ou une fascination aveugle qui sacrifierait vos intérêts sur l'autel de l'innovation. Notre communauté d'abonné premium sera arbitre des choix que nous ferons en la matière. Notre ambition n'est pas de créer un outil de niche pour quelques initiés, mais une solution accessible ce qui necessite d'être à la hauteur des standards et attentes élevés du grand public.",
  },
];

// WhyMediascan Section Component
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
        des médias, modèles économiques basés sur l'engagement émotionnel, bulles informationnelles
        et algorithmes optimisés pour la publicité plutôt que pour la qualité informationnelle.
      </p>
      <p className="text-gray-700 mb-6">
        Selon{' '}
        <a
          href="https://larevuedesmedias.ina.fr/tendances-consommation-medias-stats-confiance-reseaux-sociaux-influenceurs-reuters-2023"
          target="_blank"
          rel="noopener noreferrer"
        >
          une étude Reuters de 2023
        </a>
        , seulement 30% des Français disent faire confiance aux médias traditionnels, tandis que les
        plateformes numériques continuent de promouvoir le contenu qui génère le plus d'engagement,
        généralement le plus clivant.
      </p>
      <p className="text-gray-700 mb-6">
        Un nouveau défi émerge : de plus en plus de personnes se tournent vers les agents
        conversationnels pour s'informer sur des sujets précis. Cette pratique, bien que pratique,
        met en péril le modèle économique des créateurs de contenu dont le travail est aspiré par
        ces systèmes, tout en nous privant de la richesse des perspectives multiples.
      </p>
      <p className="text-gray-700 mb-6">
        <strong>
          Médiascan est une réflexion continue pour garder de la confiance et du plaisir dans notre
          parcours informationnel.
        </strong>
      </p>
      <p className="text-gray-700 mb-6">
        Le service fonctionne comme une{' '}
        <strong>bibliothèque de revues éditorialisée par des personnes</strong> en qui vous avez
        confiance. C'est plus qu'une façon de s'informer : c'est une invitation à s'étonner, à
        élargir ses horizons, à ouvrir le champ de perspectives en rendant accessible au plus grand
        nombre la découverte de sources pépites, habituellement réservées aux initiés ou aux
        professionnels.
      </p>
    </div>
  </div>
);

// WhoWeAre Section Component
const WhoWeAre = () => (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 shadow-lg transform hover:shadow-xl transition-all duration-300">
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-8 leading-tight">Qui sommes-nous ?</h2>
    </div>

    {/* Fondatrice section */}
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Photo avec bordure arrondie */}
        <div className="flex-shrink-0 mb-4 md:mb-0 transform hover:scale-105 transition-all duration-300">
          <img
            src="/_alice-poggioli-comp.DDy5gSTJ_ZROOdi_webp.png"
            alt="Alice Poggioli, fondatrice de Médiascan"
            className="w-48 h-48 object-cover rounded-full border-4 border-white shadow-xl hover:shadow-2xl transition-all duration-300"
          />
        </div>

        {/* Biographie */}
        <div className="flex-1">
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Je suis développeuse web et animatrice communautaire. J'ai fais trois années sur le
              terrain à faire de la médiation numérique dans le bocage ornais. J'ai vu comment
              l'information transforme les gens - ou les laisse sur le carreau.
            </p>
            <p>
              L'IA et les réseaux sociaux complexifient notre rapport à l'information : entre outils
              professionnels inaccessibles et contenus gratuits de faible qualité, l'hygiène
              informationnelle devient un luxe. Je crois pourtant qu'un public émergent acceptera de
              payer modestement pour une information de qualité, curée humainement.
            </p>
            <p>
              Médiascan s'inscrit dans cette vision : construire ensemble un outil de veille qui
              répond simplement au besoin d'être bien informé, avec franchise, intelligence
              collective et indépendance.
            </p>
            <p>
              Je recherche des partenariats pour faire évoluer Médiascan là où il sera le plus utile
              et répondra à de vrais besoins utilisateurs. L'idée : créer quelque chose de si
              pertinent que la validation du concept se confirme par l'engouement plutôt que par
              l'effort commercial. Avec un souci de pragmatisme économique, ce projet open source
              est ouvert à toutes collaborations. Contactez-moi par mail pour en discuter.
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

// ContactFormSection Component
const ContactFormSection = () => (
  <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-8 shadow-lg transform hover:shadow-xl transition-all duration-300">
    <h2 className="text-2xl font-semibold text-gray-900 mb-8 leading-tight">Contactez-nous</h2>
    <p className="text-gray-600 mb-8">
      Vous avez des questions, des suggestions ou souhaitez en savoir plus sur Médiascan ? N'hésitez
      pas à nous contacter via le formulaire ci-dessous.
    </p>
    <ContactForm />
  </div>
);

// FAQSection Component
const FAQSection = () => (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 shadow-lg transform hover:shadow-xl transition-all duration-300">
    <FAQ items={FAQ_ITEMS} />
  </div>
);

// Main LandingPage Component
const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const contactRef = useRef(null);
  const whatRef = useRef(null);
  const whyRef = useRef(null);
  const howRef = useRef(null);
  const supportRef = useRef(null);
  const teamRef = useRef(null);
  const faqRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

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

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContent = () => {
    if (whatRef && whatRef.current) {
      whatRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-blue-100/20">
      {/* Hero Section */}
      <HeroSection
        isVisible={isVisible}
        showScrollHint={showScrollHint}
        scrollToContent={scrollToContent}
      />

      {/* Divider */}
      <div className="w-full max-w-6xl mx-auto border-t border-blue-100 my-16"></div>

      {/* Main Content Sections */}
      <div className="container mx-auto max-w-6xl px-4 space-y-20">
        <FrustrationsSection />
        <NotreApprocheSection />
        <CommentCaMarcheSection />
        <CreditsSection />
        <section
          ref={whyRef}
          className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 shadow-lg transform hover:shadow-xl transition-all duration-300"
        >
          <WhyMediascan />
        </section>
        <section ref={contactRef} id="contact">
          <ContactFormSection />
        </section>
        <section ref={teamRef}>
          <WhoWeAre />
        </section>
        <section ref={faqRef}>
          <FAQSection />
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
