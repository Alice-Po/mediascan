import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            CONDITIONS GÉNÉRALES D'UTILISATION - MÉDIASCAN
          </h1>
          <p className="mt-2 text-sm text-gray-600">Date de dernière mise à jour : 24/04/2025</p>
        </div>

        <div className="p-6">
          {/* Table des matières */}
          <nav className="mb-8 bg-gray-50 rounded-lg border border-gray-200">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Sommaire</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[...Array(15)].map((_, i) => (
                  <li key={i}>
                    <a
                      href={`#section-${i + 1}`}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                    >
                      <span className="mr-2 text-gray-500">{i + 1}.</span>
                      {getTitle(i + 1)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Contenu */}
          <div className="prose prose-lg max-w-none">
            <section id="section-1" className="mb-8 pb-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. PRÉSENTATION DU SERVICE
              </h2>
              <p>
                MédiaScan est un agrégateur de flux d'actualités développé en tant que Minimum
                Viable Product (MVP) par Alice Poggioli, auto-entrepreneuse. Le service permet aux
                utilisateurs de consulter des flux d'actualités provenant de diverses sources et de
                visualiser différentes perspectives sur les mêmes sujets.
              </p>
            </section>

            <section id="section-2" className="mb-8 pb-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. ACCEPTATION DES CONDITIONS
              </h2>
              <p>
                En utilisant MédiaScan, vous acceptez les présentes conditions générales
                d'utilisation dans leur intégralité. Si vous n'acceptez pas ces conditions, veuillez
                ne pas utiliser le service.
              </p>
            </section>

            <section id="section-3" className="mb-8 pb-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                3. DESCRIPTION DU SERVICE
              </h2>
              <p>
                MédiaScan est un agrégateur de flux RSS et autres formats de syndication similaires
                qui permet de :
              </p>
              <ul>
                <li>Consulter des actualités provenant de multiples sources</li>
                <li>Filtrer et rechercher des contenus selon différents critères</li>
                <li>
                  Visualiser les différentes orientations politiques des sources d'information
                </li>
              </ul>
            </section>

            <section id="section-4" className="mb-8 pb-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. ÉVOLUTION DU SERVICE</h2>
              <p>
                MédiaScan est actuellement en phase de MVP (Minimum Viable Product). Des
                fonctionnalités sont susceptibles d'être ajoutées, modifiées ou supprimées en
                fonction du financement participatif et des retours utilisateurs.
              </p>
            </section>

            <section id="section-5" className="mb-8 pb-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. COMPTE UTILISATEUR</h2>
              <p>
                Actuellement, la création d'un compte sur MédiaScan est en cours de développement.
                Les modalités précises d'inscription et d'utilisation des comptes seront détaillées
                dans une version ultérieure des présentes conditions.
              </p>
            </section>

            <section id="section-6" className="mb-8 pb-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                6. COLLECTE ET UTILISATION DES DONNÉES
              </h2>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                6.1. Données personnelles
              </h3>
              <p>MédiaScan peut collecter les informations suivantes :</p>
              <ul>
                <li>Adresse email</li>
                <li>Nom (si vous choisissez de le partager)</li>
                <li>
                  Statistiques d'utilisation anonymisées : articles lus, temps passé, recherches
                  effectuées
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                6.2. Finalités de la collecte
              </h3>
              <p>Les données sont collectées dans le but de :</p>
              <ul>
                <li>Vous fournir le service</li>
                <li>Améliorer l'expérience utilisateur</li>
                <li>Établir des statistiques anonymisées sur l'utilisation du service</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                6.3. Accès à vos propres données
              </h3>
              <p>
                Toutes les données collectées vous concernant sont mises à votre disposition à des
                fins d'introspection, dans un format adapté.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                6.4. Absence de commercialisation des données
              </h3>
              <p>
                MédiaScan s'engage à ne jamais vendre, louer ou commercialiser vos données
                personnelles à des tiers.
              </p>
            </section>

            <section id="section-7" className="mb-8 pb-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. CONTENU AGRÉGÉ</h2>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                7.1. Propriété intellectuelle
              </h3>
              <p>
                MédiaScan respecte les droits de propriété intellectuelle des éditeurs et se
                conforme aux pratiques standard des agrégateurs de flux concernant le droit de
                citation et l'utilisation des contenus.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                7.2. Responsabilité du contenu
              </h3>
              <p>
                MédiaScan n'est pas responsable du contenu des sources agrégées. La responsabilité
                du contenu incombe aux éditeurs des sources originales.
              </p>
            </section>

            <section id="section-8" className="mb-8 pb-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                8. MODÈLE ÉCONOMIQUE ET FINANCEMENT
              </h2>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">8.1. Service freemium</h3>
              <p>
                MédiaScan propose actuellement un service gratuit. À terme, certaines
                fonctionnalités pourront devenir payantes (modèle freemium).
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                8.2. Financement participatif
              </h3>
              <p>
                Le développement de nouvelles fonctionnalités est financé par un modèle de
                financement participatif basé sur des promesses de dons. Les fonctionnalités
                développées via ce financement sont intégrées au code source sous licence MIT
                (OpenSource).
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">8.3. Publicité</h3>
              <p>
                MédiaScan s'efforce de ne pas recourir à la publicité. Si cela devait changer, une
                régie publicitaire interne avec des critères éthiques stricts serait mise en place.
              </p>
            </section>

            <section id="section-9" className="mb-8 pb-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                9. CONTRIBUTION DES UTILISATEURS
              </h2>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">9.1. Ajout de sources</h3>
              <p>Les utilisateurs peuvent proposer l'ajout de nouvelles sources de flux.</p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                9.2. Modération collaborative
              </h3>
              <p>
                Un système de modération collaborative concernant les sources est en cours de
                développement.
              </p>
            </section>

            <section id="section-10" className="mb-8 pb-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                10. SUPPRESSION DE COMPTE ET DE DONNÉES
              </h2>
              <p>
                À tout moment, vous pouvez supprimer votre compte et l'ensemble des données
                associées via les paramètres de votre profil. MédiaScan s'engage à ne conserver
                aucune donnée après suppression.
              </p>
            </section>

            <section id="section-11" className="mb-8 pb-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                11. PROPRIÉTÉ INTELLECTUELLE
              </h2>
              <p>
                Le code source de MédiaScan est sous licence MIT, y compris les fonctionnalités
                développées via le financement participatif.
              </p>
            </section>

            <section id="section-12" className="mb-8 pb-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                12. LIMITATION DE RESPONSABILITÉ
              </h2>
              <p>
                MédiaScan fournit le service "tel quel" et ne peut garantir l'exactitude, la
                pertinence ou l'exhaustivité des contenus agrégés. MédiaScan n'est pas responsable
                des inexactitudes ou des problèmes relatifs aux sources d'information.
              </p>
            </section>

            <section id="section-13" className="mb-8 pb-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                13. MODIFICATION DES CONDITIONS D'UTILISATION
              </h2>
              <p>
                MédiaScan se réserve le droit de modifier les présentes conditions. Les utilisateurs
                seront informés par email des modifications substantielles.
              </p>
            </section>

            <section id="section-14" className="mb-8 pb-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                14. LOI APPLICABLE ET JURIDICTION COMPÉTENTE
              </h2>
              <p>
                Les présentes conditions sont régies par le droit français. En cas de litige, les
                tribunaux français seront compétents.
              </p>
            </section>

            <section id="section-15" className="mb-8 pb-8 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">15. CONTACT</h2>
              <p>
                Pour toute question concernant ces conditions d'utilisation, vous pouvez{' '}
                <Link to="/feedback" className="text-blue-600 hover:underline">
                  nous contacter
                </Link>
                .
              </p>
            </section>

            {/* Note de bas de page */}
            <div className="mt-12 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="ml-3 italic">
                  Ces conditions générales d'utilisation sont en phase de développement, tout comme
                  le service MédiaScan. Elles seront complétées et précisées au fur et à mesure de
                  l'évolution du service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fonction helper pour obtenir les titres des sections
const getTitle = (section) => {
  const titles = {
    1: 'PRÉSENTATION DU SERVICE',
    2: 'ACCEPTATION DES CONDITIONS',
    3: 'DESCRIPTION DU SERVICE',
    4: 'ÉVOLUTION DU SERVICE',
    5: 'COMPTE UTILISATEUR',
    6: 'COLLECTE ET UTILISATION DES DONNÉES',
    7: 'CONTENU AGRÉGÉ',
    8: 'MODÈLE ÉCONOMIQUE ET FINANCEMENT',
    9: 'CONTRIBUTION DES UTILISATEURS',
    10: 'SUPPRESSION DE COMPTE ET DE DONNÉES',
    11: 'PROPRIÉTÉ INTELLECTUELLE',
    12: 'LIMITATION DE RESPONSABILITÉ',
    13: "MODIFICATION DES CONDITIONS D'UTILISATION",
    14: 'LOI APPLICABLE ET JURIDICTION COMPÉTENTE',
    15: 'CONTACT',
  };
  return titles[section];
};

export default TermsOfService;
