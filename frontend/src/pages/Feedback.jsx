import React from 'react';
import ContactForm from '../components/common/ContactForm';

const Feedback = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Votre avis compte</h1>
          <p className="text-lg text-gray-600">
            Nous sommes en version alpha et vos retours sont précieux pour améliorer l'application.
          </p>
        </div>

        {/* Section principale */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid gap-8 md:grid-cols-2 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">🐛 Signaler un bug</h3>
              <p className="text-sm text-blue-800">
                Décrivez le problème rencontré et les étapes pour le reproduire.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">💡 Suggérer une amélioration</h3>
              <p className="text-sm text-purple-800">
                Partagez vos idées pour rendre MédiaScan encore plus utile.
              </p>
            </div>
          </div>

          {/* Formulaire stylisé */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Votre adresse mail
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="exemple@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Votre message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Décrivez votre retour d'expérience, bug rencontré ou suggestion d'amélioration..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors duration-200"
              >
                Envoyer mon retour
              </button>
            </div>
          </div>
        </div>

        {/* Section FAQ ou Informations supplémentaires */}
        {/* <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">🚀 Prochaines fonctionnalités</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Intégration des newsletters</li>
              <li>• Radar de veille personnalisé</li>
              <li>• Sources illimitées</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">📬 Nous contacter</h3>
            <p className="text-sm text-gray-600">
              Pour toute autre demande, vous pouvez nous contacter directement à{' '}
              <a href="mailto:contact@mediascan.fr" className="text-primary hover:underline">
                contact@mediascan.fr
              </a>
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Feedback;
