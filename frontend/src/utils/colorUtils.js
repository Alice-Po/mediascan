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

// Orientations possibles pour les sources avec leurs couleurs associées
export const ORIENTATIONS = {
  'extreme-left': { label: 'Extrême Gauche', color: '#FF0000' },
  left: { label: 'Gauche', color: '#FF6666' },
  'center-left': { label: 'Centre Gauche', color: '#FF9999' },
  center: { label: 'Centre', color: '#FFFF00' },
  'center-right': { label: 'Centre Droit', color: '#99CCFF' },
  right: { label: 'Droite', color: '#3366FF' },
  'extreme-right': { label: 'Extrême Droite', color: '#000080' },
  ecologist: { label: 'Écologiste', color: '#00FF00' },
};

/**
 * Génère une couleur de fond cohérente et distincte basée sur un label
 * Cette fonction remplace generateColorFromId pour être plus explicite
 * @param {string} label - Label à utiliser pour générer la couleur
 * @returns {string} - Couleur au format hexadécimal
 */
export const generateColorFromLabel = (label) => {
  if (!label) return '#808080'; // Gris par défaut si pas de label

  // Simple hash function pour convertir le texte en nombre
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Utiliser le hash pour générer une teinte HSL (entre 0 et 360 degrés)
  // Cela donne une meilleure distribution de couleurs perceptuellement distinctes
  const hue = hash % 360;

  // Utiliser une saturation et une luminosité fixes pour des couleurs agréables
  // mais pas trop intenses
  const saturation = 65; // Pourcentage
  const lightness = 65; // Pourcentage

  // Retourner la couleur au format HSL convertie en hexadécimal
  return hslToHex(hue, saturation, lightness);
};

// Maintenir l'ancienne fonction pour la compatibilité
export const generateColorFromId = (id) => {
  // Si aucun ID n'est fourni, générer une couleur aléatoire
  if (!id) {
    return (
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')
    );
  }

  // Utiliser l'ID pour générer une couleur stable
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, '0');
  }

  return color;
};

/**
 * Obtient la couleur associée à une orientation
 * Si l'orientation est prédéfinie dans ORIENTATIONS, renvoie sa couleur
 * Sinon, génère une couleur cohérente à partir du label
 * @param {string} orientation - Le label de l'orientation
 * @returns {string} La couleur hexadécimale associée
 */
export const getOrientationColor = (orientation) => {
  if (!orientation) return '#808080'; // Gris par défaut si pas d'orientation

  // Vérifier si l'orientation est dans les orientations prédéfinies
  if (ORIENTATIONS[orientation]) {
    return ORIENTATIONS[orientation].color;
  }

  // Sinon, générer une couleur cohérente à partir du label
  return generateColorFromLabel(orientation);
};

/**
 * Obtient le label d'affichage d'une orientation
 * Si l'orientation est prédéfinie dans ORIENTATIONS, renvoie son label traduit
 * Sinon, renvoie le label tel quel
 * @param {string} orientation - Le label de l'orientation
 * @returns {string} Le label d'affichage
 */
export const getOrientationLabel = (orientation) => {
  if (!orientation) return 'Non définie';

  // Vérifier si l'orientation est dans les orientations prédéfinies
  if (ORIENTATIONS[orientation]) {
    return ORIENTATIONS[orientation].label;
  }

  // Sinon, retourner le label tel quel
  return orientation;
};

/**
 * Convertit une couleur HSL en format hexadécimal
 * @param {number} h - Teinte (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Luminosité (0-100)
 * @returns {string} - Couleur au format hexadécimal
 */
const hslToHex = (h, s, l) => {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r, g, b;

  if (0 <= h && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (60 <= h && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (120 <= h && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (180 <= h && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (240 <= h && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  // S'assurer que les valeurs sont positives et entre 0-255
  r = Math.max(0, Math.min(255, Math.round((r + m) * 255)));
  g = Math.max(0, Math.min(255, Math.round((g + m) * 255)));
  b = Math.max(0, Math.min(255, Math.round((b + m) * 255)));

  // Convertir en hexadécimal
  const rHex = r.toString(16).padStart(2, '0');
  const gHex = g.toString(16).padStart(2, '0');
  const bHex = b.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
};

/**
 * Génère un nombre fictif de followers basé sur l'ID
 * Utilisé uniquement pour la démo/UI
 */
export const generateFollowersFromId = (id) => {
  if (!id) return '0';

  // Utiliser l'ID pour générer un nombre stable mais fictif
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Faire en sorte que le nombre soit positif et pas trop grand
  const followers = Math.abs(hash % 200);

  return followers.toString();
};
