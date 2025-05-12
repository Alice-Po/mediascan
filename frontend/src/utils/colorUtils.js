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

/**
 * Génère une couleur de fond aléatoire mais consistante basée sur un ID
 * @param {string} id - Identifiant à utiliser pour générer la couleur
 * @returns {string} - Couleur au format hexadécimal (ex: '#E1F5FE')
 */
export const generateColorFromId = (id) => {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convertir le hash en une couleur pastel
  // Utiliser modulo et bornes pour garder dans la gamme des pastels
  const r = ((hash & 0xff) % 60) + 180; // Entre 180-240
  const g = (((hash >> 8) & 0xff) % 60) + 180; // Entre 180-240
  const b = (((hash >> 16) & 0xff) % 60) + 180; // Entre 180-240

  // Convertir en hexadécimal et retourner
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
    .toString(16)
    .padStart(2, '0')}`;
};

/**
 * Génère un nombre aléatoire mais déterministe de followers basé sur un ID
 * @param {string} id - Identifiant à utiliser pour générer le nombre
 * @returns {number} - Nombre de followers entre 1 et 1000
 */
export const generateFollowersFromId = (id) => {
  // Utiliser l'ID comme seed pour avoir un nombre constant pour le même ID
  const seed = id
    .toString()
    .split('')
    .reduce((a, b) => {
      return a + b.charCodeAt(0);
    }, 0);

  // Générer un nombre pseudo-aléatoire mais déterministe basé sur l'ID
  return Math.floor((Math.sin(seed) * 10000) % 1000) + 1;
};
