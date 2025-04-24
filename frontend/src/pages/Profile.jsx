import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, deleteAccount } from '../api/authApi';
import { resetAnalytics } from '../api/analyticsApi';
import { CATEGORIES } from '../constants';

/**
 * Page de profil utilisateur
 */
const Profile = () => {
  const { user, updateUser, logout } = useContext(AuthContext);

  // State pour les données de profil
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    interests: user?.interests || [],
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Séparer les états d'édition
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingInterests, setIsEditingInterests] = useState(false);

  // State pour les confirmations
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // State pour les erreurs et le chargement
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Ajouter un useEffect pour gérer le timer du message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000); // Le message disparaît après 3 secondes

      return () => clearTimeout(timer);
    }
  }, [message]);

  // Charger les données de profil complètes
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile();
        console.log('Profile data loaded:', response);

        // Extraire l'objet user de la réponse
        const userData = response.user;

        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          interests: userData.interests || [],
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } catch (err) {
        console.error('Erreur lors du chargement du profil:', err);
        setErrors({ general: 'Impossible de charger votre profil.' });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });

    // Effacer les erreurs lors de la saisie
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

    if (!profileData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (profileData.newPassword) {
      if (!profileData.currentPassword) {
        newErrors.currentPassword = 'Le mot de passe actuel est requis pour le changement';
      }

      if (profileData.newPassword.length < 6) {
        newErrors.newPassword = 'Le nouveau mot de passe doit contenir au moins 6 caractères';
      }

      if (profileData.newPassword !== profileData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gérer la sélection/désélection d'une thématique
  const handleInterestToggle = (category) => {
    const updatedInterests = profileData.interests.includes(category)
      ? profileData.interests.filter((i) => i !== category)
      : [...profileData.interests, category];

    setProfileData((prev) => ({
      ...prev,
      interests: updatedInterests,
    }));
  };

  // Modifier handleSubmit pour inclure les intérêts
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      const updateData = {
        name: profileData.name,
        interests: profileData.interests,
      };

      if (profileData.newPassword) {
        updateData.currentPassword = profileData.currentPassword;
        updateData.newPassword = profileData.newPassword;
      }

      const updatedProfile = await updateUserProfile(updateData);
      updateUser(updatedProfile);
      setIsEditingProfile(false);
      setIsEditingInterests(false);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Erreur lors de la mise à jour du profil',
      });
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser les données analytiques
  const handleResetAnalytics = async () => {
    setLoading(true);

    try {
      await resetAnalytics();
      setMessage({ type: 'success', text: 'Données analytiques réinitialisées avec succès!' });
      setShowResetConfirm(false);
    } catch (err) {
      console.error('Erreur lors de la réinitialisation des données:', err);
      setMessage({ type: 'error', text: 'Impossible de réinitialiser vos données analytiques.' });
    } finally {
      setLoading(false);
    }
  };

  // Supprimer le compte
  const handleDeleteAccount = async () => {
    setLoading(true);

    try {
      await deleteAccount();
      logout(); // Déconnecte l'utilisateur et redirige vers la page de connexion
    } catch (err) {
      console.error('Erreur lors de la suppression du compte:', err);
      setMessage({ type: 'error', text: 'Impossible de supprimer votre compte.' });
      setLoading(false);
    }
  };

  // Afficher un message de chargement
  if (loading && !profileData.name) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Message de notification */}
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profil utilisateur */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">Profil</h2>
          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="text-sm text-primary hover:text-primary-dark"
            >
              Modifier
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Nom */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                disabled={!isEditingProfile}
                className={`w-full px-3 py-2 border ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } rounded-md ${
                  !isEditingProfile ? 'bg-gray-50' : 'bg-white'
                } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email (non modifiable) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié.</p>
            </div>

            {/* Section de changement de mot de passe (visibles uniquement en mode édition) */}
            {isEditingProfile && (
              <div className="space-y-4">
                <div className="mb-3">
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={profileData.currentPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  />
                  {errors.currentPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
                  )}
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={profileData.newPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.newPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={profileData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            {isEditingProfile && (
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md text-white ${
                    loading ? 'bg-primary-light' : 'bg-primary hover:bg-primary-dark'
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></span>
                  ) : null}
                  Enregistrer
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Ajouter la section des thématiques d'intérêt
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">Thématiques d'intérêt</h2>
          {!isEditingInterests && (
            <button
              onClick={() => setIsEditingInterests(true)}
              className="text-sm text-primary hover:text-primary-dark"
            >
              Modifier
            </button>
          )}
        </div>

        {isEditingInterests ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map((category) => (
                <label
                  key={category}
                  className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors
                    ${
                      profileData.interests.includes(category)
                        ? 'bg-primary-light border-primary text-primary'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={profileData.interests.includes(category)}
                    onChange={() => handleInterestToggle(category)}
                    className="hidden"
                  />
                  <span className="text-sm capitalize">{category}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsEditingInterests(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary-dark"
              >
                Enregistrer
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profileData.interests.length > 0 ? (
              profileData.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-primary-light text-primary text-sm rounded-full capitalize"
                >
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Aucune thématique sélectionnée</p>
            )}
          </div>
        )}
      </div> */}

      {/* Paramètres de confidentialité */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Paramètres de confidentialité</h2>

        <div className="space-y-4">
          {/* Réinitialisation des données analytiques */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-md font-medium text-gray-700 mb-2">Données analytiques</h3>
            <p className="text-sm text-gray-600 mb-3">
              Réinitialisez vos données analytiques pour effacer l'historique de vos consultations
              d'articles. Vos préférences et sources seront conservées.
            </p>

            {showResetConfirm ? (
              <div className="bg-yellow-50 p-3 rounded-md mb-3">
                <p className="text-sm text-yellow-700 mb-2">
                  Êtes-vous sûr de vouloir réinitialiser vos données analytiques? Cette action est
                  irréversible.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleResetAnalytics}
                    disabled={loading}
                    className={`px-3 py-1 text-xs rounded-md bg-yellow-500 text-white hover:bg-yellow-600 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    Confirmer
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={loading}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Réinitialiser mes données analytiques
              </button>
            )}
          </div>

          {/* Export des données (RGPD) */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-md font-medium text-gray-700 mb-2">Exporter mes données</h3>
            <p className="text-sm text-gray-600 mb-3">
              Téléchargez une copie de toutes vos données personnelles au format JSON.
            </p>
            <button
              onClick={() => {
                /* Implémentation future */
              }}
              className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Exporter mes données
            </button>
          </div>

          {/* Suppression de compte */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Supprimer mon compte</h3>
            <p className="text-sm text-gray-600 mb-3">
              La suppression de votre compte est définitive et entraînera la perte de toutes vos
              données.
            </p>

            {showDeleteConfirm ? (
              <div className="bg-red-50 p-3 rounded-md mb-3">
                <p className="text-sm text-red-700 mb-2">
                  Êtes-vous absolument sûr de vouloir supprimer votre compte? Cette action est
                  irréversible et toutes vos données seront perdues.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className={`px-3 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-700 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <span className="inline-block animate-spin rounded-full h-3 w-3 border-t-2 border-white mr-1"></span>
                    ) : null}
                    Supprimer définitivement
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={loading}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
              >
                Supprimer mon compte
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Informations sur la version */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-medium text-gray-800 mb-2">À propos</h2>
        <p className="text-sm text-gray-600 mb-1">MédiaScanon MVP 1.0.0</p>
        <p className="text-sm text-gray-500">Vous utilisez actuellement la version gratuite.</p>
      </div>
    </div>
  );
};

export default Profile;
