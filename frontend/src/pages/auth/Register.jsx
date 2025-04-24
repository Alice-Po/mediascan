import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

/**
 * Page d'inscription
 */
const Register = () => {
  const { register } = useContext(AuthContext);
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

  // State pour l'erreur générale
  const [error, setError] = useState(null);

  // State pour l'état de chargement
  const [loading, setLoading] = useState(false);

  // State pour le message de succès
  const [success, setSuccess] = useState(false);

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
    console.log('Validation du formulaire...'); // Log de debug
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

    console.log('Erreurs de validation:', newErrors); // Log de debug
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    console.log('Début de soumission du formulaire'); // Log de debug
    e.preventDefault();

    console.log('FormData avant validation:', formData); // Log de debug

    if (!validateForm()) {
      console.log('Validation échouée'); // Log de debug
      return;
    }

    console.log('Validation réussie, début inscription'); // Log de debug
    setLoading(true);
    setError(null);

    try {
      console.log("Tentative d'inscription avec:", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      console.log('Résultat inscription:', result);
      setSuccess(true);
    } catch (err) {
      console.error('Erreur inscription:', err);
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  // Ajout du message de succès dans le rendu
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Bandeau d'information */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100 p-3 text-center fixed top-0 right-0 left-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2 text-sm text-blue-800">
              <span role="img" aria-label="construction" className="hidden sm:inline">
                🏗️
              </span>
              <p>
                <span className="font-semibold">Version alpha</span> - Il est possible que vous
                rencontriez des bugs. Vos retours sont les bienvenus !
                <a
                  href="/feedback"
                  className="ml-2 text-blue-600 hover:text-blue-800 underline hidden sm:inline"
                >
                  Partagez votre expérience
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-md w-full space-y-8 text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Inscription réussie !</h2>
          <div className="mt-4 text-gray-600">
            <p>Un email de vérification a été envoyé à votre adresse.</p>
            <p className="mt-2">
              Veuillez vérifier votre boîte de réception et cliquer sur le lien pour activer votre
              compte.
            </p>
          </div>
          <div className="mt-6">
            <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
              Retour à la page de connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* En-tête */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">MédiaScan</h1>
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">Inscription</h2>
          <p className="mt-2 text-sm text-gray-600">Créez votre compte pour commencer</p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative"
            role="alert"
          >
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Nom */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom"
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600" id="name-error">
                  {errors.name}
                </p>
              )}
            </div>
          </div>

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
                placeholder="exemple@email.com"
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {errors.email}
                </p>
              )}
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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600" id="password-error">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          {/* Confirmation du mot de passe */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600" id="confirmPassword-error">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Conditions d'utilisation */}
          <div className="flex items-center">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
              J'accepte les{' '}
              <Link
                to="/terms-of-service"
                className="text-primary hover:text-primary-dark underline"
              >
                conditions d'utilisation
              </Link>
            </label>
          </div>
          {errors.acceptTerms && <p className="mt-2 text-sm text-red-600">{errors.acceptTerms}</p>}

          {/* Bouton d'inscription */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="sr-only">Inscription en cours...</span>
                  <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2" />
                </>
              ) : (
                "S'inscrire"
              )}
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
