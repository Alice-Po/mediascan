import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AntennaIcon } from '../../components/common/icons';

/**
 * Page de connexion
 */
const Login = () => {
  const { login, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();

  // State pour le formulaire
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // State pour les erreurs de validation
  const [errors, setErrors] = useState({});

  // State pour l'état de chargement
  const [loading, setLoading] = useState(false);

  // State pour l'état d'erreur
  const [error, setError] = useState(null);

  // State pour afficher le bouton de renvoi de l'email
  const [showResendButton, setShowResendButton] = useState(false);

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Effacer l'erreur lors de la saisie
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(formData);
      navigate('/app');
    } catch (error) {
      setError(error.message);
      if (error.message.includes('vérifier votre email')) {
        // Ajouter un bouton pour renvoyer l'email de vérification
        setShowResendButton(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="text-gray-800 w-12 h-12">
            <AntennaIcon />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h1>
        <h2 className="text-xl text-gray-600">Connectez-vous pour continuer</h2>
      </div>

      {/* Formulaire de connexion */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                />
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
              </div>
            </div>

            {/* Message d'erreur global */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Bouton de connexion */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className="sr-only">Connexion en cours...</span>
                    <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2" />
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </div>

            {/* Lien d'inscription */}
            <div className="text-center text-sm">
              <p className="text-gray-600">
                Pas encore de compte ?{' '}
                <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
                  Inscrivez-vous
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Note en bas de page */}
        <div className="mt-6">
          <p className="text-xs text-gray-500 text-center">
            Médiascan est un projet d'agrégateur social d'actualité français et open source .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
