/**
 * Formate une date en temps relatif (ex: "il y a 2 heures")
 * @param {string|Date} date - La date à formater
 * @returns {string} La date formatée en temps relatif
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  if (diffInSeconds < 60) return "à l'instant";

  const minutes = Math.floor(diffInSeconds / 60);
  if (diffInSeconds < 3600) {
    return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  const hours = Math.floor(diffInSeconds / 3600);
  if (diffInSeconds < 86400) {
    return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  }

  const days = Math.floor(diffInSeconds / 86400);
  if (diffInSeconds < 604800) {
    return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  }

  return new Date(date).toLocaleDateString('fr-FR');
};
