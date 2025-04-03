import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

/**
 * Page d'inscription
 */
const Register = () => {
  const { register, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();

  // State pour le formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  // State pour les erreurs de validation
  const [errors, setErrors] = useState({});

  // State pour l'état de chargement
  const [loading, setLoading] = useState(false);

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
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

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Vous devez accepter les conditions d'utilisation";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await register(formData);
      console.log('Registration successful:', result);

      // Attendons un peu pour laisser le temps au contexte de se mettre à jour
      setTimeout(() => {
        console.log('Navigating to onboarding, user:', result.user);
        navigate('/onboarding');
      }, 100);
    } catch (err) {
      console.error("Erreur lors de l'inscription:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* En-tête */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">NewsAgg</h1>
          <h2 className="mt-6 text-xl font-bold text-gray-900">Inscription</h2>
          <p className="mt-2 text-sm text-gray-600">
            Créez un compte pour commencer à explorer les actualités
          </p>
        </div>

        {/* Formulaire */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Message d'erreur */}
          {authError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{authError}</div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            {/* Nom */}
            <div>
              <label htmlFor="name" className="sr-only">
                Nom
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className={`appearance-none rounded-t-md relative block w-full px-3 py-2 border ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                placeholder="Nom"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 mb-2">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 mb-2">{errors.email}</p>}
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 mb-2">{errors.password}</p>
              )}
            </div>

            {/* Confirmer mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none rounded-b-md relative block w-full px-3 py-2 border ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                placeholder="Confirmer le mot de passe"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Conditions d'utilisation */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                checked={formData.acceptTerms}
                onChange={handleChange}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="acceptTerms" className="font-medium text-gray-700">
                J'accepte les{' '}
                <span className="text-primary cursor-pointer">conditions d'utilisation</span> et la{' '}
                <span className="text-primary cursor-pointer">politique de confidentialité</span>
              </label>
              {errors.acceptTerms && (
                <p className="text-red-500 text-xs mt-1">{errors.acceptTerms}</p>
              )}
            </div>
          </div>

          {/* Bouton d'inscription */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? 'bg-primary-light' : 'bg-primary hover:bg-primary-dark'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
            >
              {loading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></span>
              ) : null}
              S'inscrire
            </button>
          </div>

          {/* Lien de connexion */}
          <div className="text-center text-sm">
            <p className="text-gray-600">
              Déjà un compte ?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                Connectez-vous
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
