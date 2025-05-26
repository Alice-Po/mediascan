import React, { useState, useEffect, useContext } from 'react';
import { useSnackbar, SNACKBAR_TYPES } from '../../../../context/SnackbarContext';
import { updateUserProfile, uploadUserAvatar, getUserProfile } from '../../../../api/authApi';
import { UserIcon } from '../../../../components/common/icons';
import Avatar from '../../../../components/common/Avatar';
import { AuthContext } from '../../../../context/AuthContext';

const OnboardingProfile = ({ onValidationChange }) => {
  const { showSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: '',
    socialLinks: [{ url: [] }],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarLoaded, setAvatarLoaded] = useState(true);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        if (data && data.user) {
          setFormData({
            name: data.user.name || '',
            bio: data.user.bio || '',
            socialLinks:
              Array.isArray(data.user.socialLinks) && data.user.socialLinks.length > 0
                ? data.user.socialLinks
                : [{ url: '' }],
          });
        }
      } catch (err) {
        // Optionnel : gestion d'erreur
      }
    };
    fetchProfile();
  }, []);

  // Mettre à jour la validation de l'étape
  useEffect(() => {
    if (onValidationChange) {
      const isValid = formData.name.trim().length > 0;
      onValidationChange?.(isValid);
    }
  }, [formData.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialLinkChange = (index, value) => {
    const newLinks = [...formData.socialLinks];
    newLinks[index] = { url: value };
    setFormData((prev) => ({
      ...prev,
      socialLinks: newLinks,
    }));
  };

  const addSocialLink = () => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { url: [] }],
    }));
  };

  const removeSocialLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Filtrer les liens sociaux vides ou invalides
    const filteredLinks = formData.socialLinks
      .map((link) => ({ url: link.url.trim() }))
      .filter((link) => link.url && link.url.startsWith('http'));

    try {
      await updateUserProfile({
        ...formData,
        socialLinks: filteredLinks,
      });
      setProfileSaved(true);
      showSnackbar('Profil mis à jour avec succès !', SNACKBAR_TYPES.SUCCESS);
      onValidationChange?.(true);
    } catch (error) {
      setErrors(
        error.response?.data?.errors || { submit: 'Erreur lors de la mise à jour du profil' }
      );
      showSnackbar('Erreur lors de la mise à jour du profil', SNACKBAR_TYPES.ERROR);
    } finally {
      setLoading(false);
    }
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
      console.log('[Avatar] Upload terminé, avatarKey:', avatarKey, 'userId:', user?._id);
      showSnackbar('Avatar uploadé avec succès !', SNACKBAR_TYPES.SUCCESS);
    } catch (error) {
      setErrors((prev) => ({ ...prev, avatar: "Erreur lors de l'upload de l'avatar" }));
      showSnackbar("Erreur lors de l'upload de l'avatar", SNACKBAR_TYPES.ERROR);
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
          Les sources, c'est bien beau, mais...
        </h2>
        <p className="text-gray-600 mb-4">
          Ce qui nous intéresse vraiment, ce sont les compilations de sources faites par des
          curateurs. Des humains en qui on peut avoir confiance. Pas des algorithmes qui poussent du
          contenu généré par IA ou des articles écrits par des bots pour maximiser les clics et la
          pub.
        </p>
        <p className="text-gray-600 mb-4">
          Nous voulons du contenu sur des thématiques précises, éditorialisé par des humains afin de
          remettre en lumière ces petits bouts du web encore écrits par des humains. Parce que oui,
          ça existe encore !
        </p>
        <p className="text-gray-600 font-medium">
          Pour ces raisons, nous aimerions en savoir plus sur vous.{' '}
        </p>
        <br />
        <p className="text-gray-600 mb-4">
          NB : Tant que vous ne partagerez pas publiquement de collection, votre profil ne sera pas
          accessible.
        </p>
      </div>

      {profileSaved ? (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-6 rounded flex flex-col items-center">
          <span className="font-semibold text-lg mb-2">Profil enregistré avec succès !</span>
          <span>Vous pouvez passer à l'étape suivante.</span>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
                    onLoad={() => {
                      setAvatarLoaded(true);
                    }}
                    onError={() => {
                      setAvatarLoaded(true);
                      console.log(
                        '[Avatar] onError déclenché',
                        'userId:',
                        user?._id,
                        'avatarKey:',
                        avatarKey
                      );
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
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={avatarUploading}
              />
              {errors.avatar && <div className="text-red-600 text-sm mt-1">{errors.avatar}</div>}
            </div>

            {/* Nom */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Votre nom
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Votre biographie
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                maxLength={500}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Parlez-nous de vous, de vos centres d'intérêt, de ce qui vous pousse à vous informer..."
              />
              <p className="mt-1 text-sm text-gray-500">{formData.bio.length}/500 caractères</p>
            </div>

            {/* Liens sociaux */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vos liens sociaux
              </label>
              {formData.socialLinks.map((link, index) => (
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

            {errors.submit && <div className="text-red-600 text-sm">{errors.submit}</div>}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer mon profil'}
              </button>
            </div>
          </form>
          <div className="mt-8 text-center text-gray-500 text-sm">
            <strong>À venir :</strong> Nous réfléchissons à une solution forte et radicale pour
            garantir que nos utilisateurs sont bien des humains (et pas des bots).
          </div>
        </>
      )}
    </div>
  );
};

export default OnboardingProfile;
