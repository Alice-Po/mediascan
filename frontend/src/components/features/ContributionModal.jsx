import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ContributionModal = ({ isOpen, onClose, feature, amount }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThanks, setShowThanks] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: amount || '',
    paymentMethod: 'card',
    saveInfo: true,
  });

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user.displayName || prevData.name,
        email: user.email || prevData.email,
        amount: amount || prevData.amount,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        amount: amount || prevData.amount,
      }));
    }
  }, [user, amount, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/xwpokrvp', {
        method: 'POST',
        body: new FormData(e.target),
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setShowThanks(true);
        setTimeout(() => {
          window.location.href = '/premium';
        }, 3000);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (!isOpen) return null;

  if (showThanks) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Merci pour votre contribution !
            </h3>
            <p className="text-gray-600">
              Votre soutien est précieux pour le développement de cette fonctionnalité. Nous vous
              recontacterons dès que l'objectif sera atteint.
            </p>
          </div>
          <div className="animate-pulse text-sm text-gray-500">
            Redirection dans quelques secondes...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">Contribuer au développement</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors rounded-full hover:bg-gray-100 p-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Votre contribution nous aide à développer les fonctionnalités que vous souhaitez
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-8 py-6 space-y-6">
            <input type="hidden" name="feature" value={feature} />
            <input type="hidden" name="targetAmount" value={amount} />

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Sophie Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="vous@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant de votre contribution
                </label>

                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { value: 10, label: null },
                    { value: 50, label: null },
                    { value: 100, label: null },
                    { value: 500, label: null },
                    { value: 1000, label: null },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        const input = document.querySelector('input[name="amount"]');
                        if (input) input.value = value;
                      }}
                      className="flex-none px-3 py-1.5 border-2 border-gray-200 rounded-lg hover:border-purple-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition-all text-center group relative"
                    >
                      <span className="text-gray-900 font-medium group-hover:text-purple-600">
                        {value}€
                      </span>
                      {label && (
                        <div className="absolute -top-2 -right-2">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            ✨
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500">€</span>
                  </div>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="1"
                    className="pl-8 pr-4 py-3 w-full border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="Montant personnalisé"
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-500">
                  Contribution minimum de 50€ pour devenir membre premium à vie
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optionnel)
                </label>
                <textarea
                  name="message"
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Vos attentes ou suggestions pour cette fonctionnalité..."
                ></textarea>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="newsletter"
                    className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 transition-all cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                    Je souhaite recevoir les actualités sur l'avancement du projet
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 bg-gray-50 rounded-b-2xl border-t border-gray-100">
            <div className="space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-purple-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 
                  ${
                    isSubmitting
                      ? 'opacity-75 cursor-not-allowed'
                      : 'hover:bg-purple-700 hover:shadow-lg hover:-translate-y-0.5'
                  }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Envoi en cours...
                  </span>
                ) : (
                  'Confirmer ma promesse de don'
                )}
              </button>
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                En confirmant, vous acceptez d'être recontacté lorsque{' '}
                <strong>la fonctionnalité sera développée</strong> pour finaliser votre
                contribution.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributionModal;
