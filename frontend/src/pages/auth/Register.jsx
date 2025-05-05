import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AntennaIcon } from '../../components/common/icons';

/**
 * Page d'inscription
 */
const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // State pour le formulaire
  const [formData, setFormData] = useState({
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
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Effacer l'erreur lors de la saisie
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    console.log('Validation du formulaire...'); // Log de debug
    const newErrors = {};

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
        email: formData.email,
        password: formData.password,
      });

      const result = await register({
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
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <span role="img" aria-label="warning" className="mr-2">
                  ⚠️
                </span>
                N'oubliez pas de vérifier votre dossier spam si vous ne trouvez pas l'email !
              </p>
            </div>
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
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="text-gray-800 w-12 h-12">
            <AntennaIcon />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenue sur Médiascan</h1>
        <h2 className="text-xl text-gray-600">Retrouvez le plaisir de vous informer.</h2>
      </div>

      {/* Formulaire d'inscription */}
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
                onChange={handleChange}
                checked={formData.acceptTerms}
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
            {errors.acceptTerms && (
              <p className="mt-2 text-sm text-red-600">{errors.acceptTerms}</p>
            )}

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

        {/* Note en bas de page */}
        <div className="mt-6">
          <p className="text-xs text-gray-500 text-center">
            Médiascan est un projet open source financé par sa communauté, sans investisseurs
            externes ni publicité. Votre soutien est notre seul moteur.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
