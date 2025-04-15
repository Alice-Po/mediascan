// Catégories disponibles pour les sources et les intérêts utilisateurs
export const CATEGORIES = [
  'politique',
  'économie',
  'société',
  'international',
  'culture',
  'sciences',
  'technologie',
  'environnement',
  'sport',
  'santé',
];

// Orientations possibles pour les sources avec leurs couleurs associées
export const ORIENTATIONS = {
  political: {
    'extrême-gauche': { label: 'Extrême Gauche', color: '#FF0000' }, // Rouge vif
    gauche: { label: 'Gauche', color: '#FF6666' }, // Rouge clair
    'centre-gauche': { label: 'Centre Gauche', color: '#FF9999' }, // Rose
    centre: { label: 'Centre', color: '#FFFF00' }, // Jaune
    'centre-droit': { label: 'Centre Droit', color: '#99FF99' }, // Bleu clair
    républicain: { label: 'Républicain', color: '#3366FF' }, // Bleu
    droite: { label: 'Droite', color: '#66FF66' }, // Bleu
    'extrême-droite': { label: 'Extrême Droite', color: '#000080' }, // Bleu marine
    écologiste: { label: 'Écologiste', color: '#00FF00' }, // Vert vif
  },
};

// Helper pour obtenir la couleur d'une orientation politique
export const getOrientationColor = (orientation) => {
  return ORIENTATIONS.political[orientation]?.color || '#808080'; // Gris par défaut
};

// Helper pour obtenir le label d'une orientation politique
export const getOrientationLabel = (orientation) => {
  return ORIENTATIONS.political[orientation]?.label || orientation;
};
