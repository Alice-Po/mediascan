import React from 'react';

const Step5Credits = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
          Accédez à tous les contenus avec les crédits MédiaScan
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Lisez les articles qui vous intéressent sans multiplier les abonnements
        </p>
      </div>

      {/* Illustration du problème */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="space-y-6">
          {/* Scénario frustrant */}
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <span role="img" aria-label="frustrated" className="text-2xl">
                😤
              </span>
              <div>
                <h3 className="font-medium text-red-900 mb-1">Situation frustrante</h3>
                <p className="text-sm text-red-700">
                  Vous tombez sur un article intéressant mais... il est payant. Vous ne voulez pas
                  prendre un abonnement complet juste pour un article !
                </p>
              </div>
            </div>
          </div>

          {/* Solution */}
          <div className="bg-emerald-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <span role="img" aria-label="solution" className="text-2xl">
                💡
              </span>
              <div>
                <h3 className="font-medium text-emerald-900 mb-1">La solution MédiaScan</h3>
                <p className="text-sm text-emerald-700">
                  Créditez votre compte et payez uniquement les articles qui vous intéressent, de
                  0,20€ à 2€ selon le contenu.
                </p>
              </div>
            </div>
          </div>

          {/* Exemple de crédit */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Exemple avec 30€ de crédit</h3>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">150</div>
                  <div className="text-sm text-gray-600">articles à 0,20€</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">15</div>
                  <div className="text-sm text-gray-600">articles à 2€</div>
                </div>
              </div>
            </div>
          </div>

          {/* Types de contenus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Presse traditionnelle</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Articles d'investigation</li>
                <li>• Analyses approfondies</li>
                <li>• Reportages exclusifs</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Créateurs indépendants</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Blogs spécialisés</li>
                <li>• Recherches académiques</li>
                <li>• Newsletters premium</li>
              </ul>
            </div>
          </div>

          {/* Note sur la répartition */}
          <div className="text-center text-sm text-gray-500">
            <p>
              85% du montant revient directement aux créateurs de contenu.
              <br />
              15% permet à MédiaScan de maintenir et améliorer le service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5Credits;
