import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, deleteAccount, uploadUserAvatar } from '../api/authApi';
import { resetAnalytics } from '../api/analyticsApi';
import UserAnalytics from '../components/analytics/UserAnalytics';
import Avatar from '../components/common/Avatar';

/**
 * Page de profil utilisateur
 */
const Profile = () => {
  const { user, updateUser, logout } = useContext(AuthContext);

  // State pour les données de profil
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    interests: user?.interests || [],
    socialLinks: user?.socialLinks || [{ url: '' }],
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // State pour l'avatar
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarLoaded, setAvatarLoaded] = useState(true);
  const [avatarKey, setAvatarKey] = useState(Date.now());

  // Séparer les états d'édition
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingInterests, setIsEditingInterests] = useState(false);

  // State pour les confirmations
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // State pour les erreurs et le chargement
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const passwordFormRef = useRef(null);

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

        // Extraire l'objet user de la réponse
        const userData = response.user;

        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          bio: userData.bio || '',
          interests: userData.interests || [],
          socialLinks: userData.socialLinks || [{ url: '' }],
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

  // Gérer les changements des liens sociaux
  const handleSocialLinkChange = (index, value) => {
    const newLinks = [...profileData.socialLinks];
    newLinks[index] = { url: value };
    setProfileData((prev) => ({
      ...prev,
      socialLinks: newLinks,
    }));
  };

  // Ajouter un lien social
  const addSocialLink = () => {
    setProfileData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { url: '' }],
    }));
  };

  // Supprimer un lien social
  const removeSocialLink = (index) => {
    setProfileData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  // Gestion de l'upload d'avatar
  const handleAvatarFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    setErrors((prev) => ({ ...prev, avatar: undefined }));
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarLoaded(true);
    try {
      await uploadUserAvatar(file, localStorage.getItem('token'));
      setAvatarPreview(null);
      setAvatarLoaded(false);
      setAvatarKey(Date.now());
      setMessage({ type: 'success', text: 'Avatar mis à jour avec succès !' });
    } catch (error) {
      setErrors((prev) => ({ ...prev, avatar: "Erreur lors de l'upload de l'avatar" }));
      setMessage({ type: 'error', text: "Erreur lors de l'upload de l'avatar" });
    } finally {
      setAvatarUploading(false);
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
      // Filtrer les liens sociaux vides ou invalides
      const filteredLinks = profileData.socialLinks
        .map((link) => ({ url: link.url.trim() }))
        .filter((link) => link.url && link.url.startsWith('http'));

      const updateData = {
        name: profileData.name,
        bio: profileData.bio,
        interests: profileData.interests,
      };

      // N'inclure les liens sociaux que s'il y en a
      if (filteredLinks.length > 0) {
        updateData.socialLinks = filteredLinks;
      }

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

  const handleLogout = async () => {
    await logout();
  };

  // Fonction pour gérer l'ouverture du formulaire de mot de passe
  const handleOpenPasswordForm = () => {
    setIsEditingPassword(true);
    // Scroll vers le formulaire après un court délai pour laisser le temps au DOM de se mettre à jour
    setTimeout(() => {
      passwordFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
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
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h2 className="text-lg font-medium text-gray-800">Profil</h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {!isEditingProfile && (
                <>
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={handleOpenPasswordForm}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Changer le mot de passe
                  </button>
                </>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
                  Votre avatar
                </label>
                <div className="relative w-24 h-24 mb-4">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Aperçu avatar"
                      className="w-full h-full rounded-full object-cover border-2 border-blue-400"
                    />
                  ) : (
                    <Avatar
                      key={avatarKey}
                      userId={user?._id}
                      size={96}
                      cacheBust={avatarKey}
                      avatarUrl={user?.avatar}
                      avatarType={user?.avatarType}
                      onLoad={() => {
                        setAvatarLoaded(true);
                      }}
                      onError={() => {
                        setAvatarLoaded(true);
                      }}
                      style={{ display: avatarLoaded ? 'block' : 'none' }}
                    />
                  )}
                  {(avatarUploading || !avatarLoaded) && !avatarPreview && (
                    <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center rounded-full">
                      <span className="text-xs text-gray-600">Chargement...</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={avatarUploading}
                />
                {errors.avatar && <div className="text-red-600 text-sm mt-1">{errors.avatar}</div>}
              </div>

              {/* Nom */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom ou pseudo
                </label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  />
                ) : (
                  <div className="w-full px-3 py-2 text-gray-900">{profileData.name}</div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Ce nom sera visible quand vous partagerez des collections publiques. Nous vous
                  encourageons à mettre votre véritable identité.
                </p>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email (non modifiable) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="w-full px-3 py-2 text-gray-900">{profileData.email}</div>
                <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié.</p>
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                {isEditingProfile ? (
                  <textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    rows={4}
                    maxLength={500}
                    className={`w-full px-3 py-2 border ${
                      errors.bio ? 'border-red-300' : 'border-gray-300'
                    } rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="Parlez-nous de vous, de vos centres d'intérêt, de ce qui vous pousse à vous informer..."
                  />
                ) : (
                  <div className="w-full px-3 py-2 text-gray-900 whitespace-pre-wrap">
                    {profileData.bio}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {profileData.bio.length}/500 caractères
                </p>
                {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
              </div>

              {/* Liens sociaux */}
              {isEditingProfile && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vos liens sociaux
                  </label>
                  {profileData.socialLinks.map((link, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                        placeholder="URL de votre profil social"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeSocialLink(index)}
                          className="px-3 py-2 text-red-600 hover:text-red-800"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Ajouter un lien social
                  </button>
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
                      loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
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

        {/* Formulaire de changement de mot de passe */}
        {isEditingPassword && (
          <div ref={passwordFormRef} className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Modifier le mot de passe</h3>
              <button
                onClick={() => setIsEditingPassword(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Annuler
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
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
                    } rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  />
                  {errors.currentPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
                  )}
                </div>

                <div>
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
                    } rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
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
                    } rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditingPassword(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={loading}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-md text-white ${
                      loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></span>
                    ) : null}
                    Enregistrer
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Section statistiques */}
        {/* <div className="mb-8">
          <UserAnalytics />
      </div> */}

        {/* Paramètres de confidentialité */}
        <div className="bg-white rounded-lg shadow-sm p-6">
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

        {/* Ajout du bouton de déconnexion */}
        <div className="mt-4 sm:mt-8 border-t border-gray-200 pt-4 sm:pt-8 pb-15 sm:pb-20 flex justify-center sm:justify-start min-h-20">
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
