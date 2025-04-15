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

// Orientations possibles pour les sources
export const ORIENTATIONS = {
  political: [
    'extrême-gauche',
    'gauche',
    'centre-gauche',
    'centre',
    'centre-droit',
    'républicain',
    'droite',
    'extrême-droite',
    'écologiste',
    'non-spécifié',
  ],
  type: [
    'mainstream',
    'alternatif',
    'indépendant',
    'magazine',
    'gratuit',
    'service public',
    'spécialisé',
    'non-spécifié',
  ],
  structure: ['institutionnel', 'indépendant', 'alternatif', 'non-spécifié'],
  scope: [
    'généraliste',
    'spécialisé',
    'investigation',
    'international',
    'économique',
    'culturel',
    'non-spécifié',
  ],
};

// Helper pour obtenir la couleur d'une orientation politique
export const getOrientationColor = (orientation) => {
  return ORIENTATIONS.political[orientation]?.color || '#808080'; // Gris par défaut
};

// Helper pour obtenir le label d'une orientation politique
export const getOrientationLabel = (orientation) => {
  return ORIENTATIONS.political[orientation]?.label || orientation;
};
