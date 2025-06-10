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
          Pour retrouver le goût de s'informer
        </h2>
        <h3 className="text-xl md:text-2xl text-gray-700 font-medium mb-6 leading-relaxed">
          L'information de qualité, sélectionnée par des experts passionnés.
        </h3>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Fini les algorithmes opaques et la surinformation. Découvrez un agrégateur français
          transparent où des curateurs humains sélectionnent pour vous les meilleures sources
          d'information.
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
      Vous aussi, vous en avez marre de...
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
  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-8 shadow-lg transform hover:shadow-xl transition-all duration-300">
    <h2 className="text-2xl font-semibold text-gray-900 mb-8 leading-tight">
      Notre approche : Des experts passionnés créent des sélections thématiques que vous pouvez
      suivre.
    </h2>
    <p className="text-gray-700 mb-8">Comme une playlist musicale, mais pour l'information.</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div className="flex gap-4 items-start">
        <div className="text-2xl flex-shrink-0">🎯</div>
        <div>
          <h4 className="font-medium text-gray-900">Curation humaine</h4>
          <p className="text-gray-600">
            Des journalistes, experts et passionnés sélectionnent les meilleures sources sur leur
            domaine
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        <div className="text-2xl flex-shrink-0">🇫🇷</div>
        <div>
          <h4 className="font-medium text-gray-900">Français et indépendant</h4>
          <p className="text-gray-600">Créé en France, financé par les utilisateurs</p>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        <div className="text-2xl flex-shrink-0">🔓</div>
        <div>
          <h4 className="font-medium text-gray-900">Transparent et ouvert</h4>
          <p className="text-gray-600">Code open source ouvert à la contribution.</p>
        </div>
      </div>
    </div>
  </div>
);

// Comment ça marche Section Component
const CommentCaMarcheSection = () => (
  <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-8 shadow-lg transform hover:shadow-xl transition-all duration-300">
    <h2 className="text-2xl font-semibold text-gray-900 mb-8 leading-tight">Comment ça marche ?</h2>
    <p className="text-gray-700 mb-8">
      C'est aussi simple que de suivre une chaîne YouTube ou un compte Twitter
    </p>

    <div className="space-y-12 mb-12">
      <div className="flex gap-6">
        <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl font-bold text-green-700">
          1
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Explorez les sélections</h3>
          <p className="text-gray-600">
            Découvrez les collections créées par des experts : "Tech éthique", "Climat sans
            catastrophisme", "Économie décryptée"... Chaque collection rassemble articles,
            newsletters, vidéos YouTube, comptes Twitter et podcasts sur un thème.
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl font-bold text-green-700">
          2
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Suivez les collections public de vos curateurs préférés
          </h3>
          <p className="text-gray-600">
            Choisissez les collections des experts dont vous appréciez le regard et la sélection.
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
            Plonger dans les fils d'actualité de vos curateurs de confiance. Changer de collection
            selon votre envie, votre humeur, votre curiosité.
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

      {/* Illustration */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl overflow-hidden shadow-lg p-6">
        <div className="max-w-4xl mx-auto">
          <img
            src="illu-mediascan-desktop.png"
            alt="Interface Médiascan sur desktop"
            className="w-full max-w-2xl mx-auto hidden md:block object-contain"
          />
          <img
            src="illu-mediascan-smartphone.png"
            alt="Interface Médiascan sur mobile"
            className="w-full max-w-xs mx-auto md:hidden object-contain"
          />
        </div>
      </div>
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
            abonnements, précarité des créateurs, course au clic... Nous réfléchissons à des
            alternatives.
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
    question: 'Est-ce que Médiascan va mettre en place de la publicité sur sa version gratuite ?',
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
        , plus de 65% des Français expriment leur méfiance envers les médias traditionnels, tandis
        que les plateformes numériques continuent de promouvoir le contenu qui génère le plus
        d'engagement, généralement le plus clivant.
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
        Notre service fonctionne comme une{' '}
        <strong>bibliothèque de revues éditorialisée par des personnes</strong> en qui vous avez
        confiance. C'est plus qu'une façon de s'informer : c'est une invitation à s'étonner, à
        élargir ses horizons, un divertissement qui augmente votre champ de perspectives. Nous
        rendons accessible au plus grand nombre la configuration de ses flux d'information et la
        découverte de sources pépites, habituellement réservées aux initiés ou aux professionnels.
      </p>
    </div>
  </div>
);

// WhoWeAre Section Component
const WhoWeAre = () => (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 shadow-lg transform hover:shadow-xl transition-all duration-300">
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-8 leading-tight">Qui sommes-nous ?</h2>
      <p className="text-gray-700 mb-6">
        Médiascan est un projet français, open source, indépendant et collaboratif.
      </p>
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
              Je suis développeuse web, animatrice communautaire et créatrice de Médiascan. J'ai
              fais trois années sur le terrain à faire de la médiation numérique dans le bocage
              ornais. J'ai vu comment l'information transforme les gens - ou les laisse sur le
              carreau.
            </p>
            <p>
              Chaque soir, je scroll l'actualité noyée dans un flux mainstream qui m'ennuie ou
              m'agace. L'information de qualité se raréfie et cela m'angoisse.
            </p>
            <p>Comment pourrais-je rendre mes compétences utiles à cette problématique ?</p>
            <p>
              Je développe Médiascan de A à Z - design, code, stratégie - portée par la conviction
              qu'il y a une place dans le marché francais pour un outil de veille à la fois sérieux,
              souverain et grand public.
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
      <div className="container mx-auto max-w-6xl px-4 space-y-20 py-16">
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
