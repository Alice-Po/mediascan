/**
 * Détermine si une couleur est claire ou foncée
 * @param {string} hexColor - Couleur au format hexadécimal (ex: '#FFFFFF')
 * @returns {boolean} true si la couleur est claire, false si elle est foncée
 */
export const isLightColor = (hexColor) => {
  // Convertir la couleur hex en RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculer la luminosité (formule standard)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5;
};
