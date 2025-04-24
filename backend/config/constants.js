// Orientations politiques possibles
export const ORIENTATIONS = {
  political: {
    'extreme-left': { label: 'Extrême Gauche', color: '#FF0000' },
    left: { label: 'Gauche', color: '#FF6666' },
    'center-left': { label: 'Centre Gauche', color: '#FF9999' },
    center: { label: 'Centre', color: '#FFFF00' },
    'center-right': { label: 'Centre Droit', color: '#3366FF' },
    right: { label: 'Droite', color: '#3366FF' },
    'extreme-right': { label: 'Extrême Droite', color: '#000080' },
    ecologist: { label: 'Écologiste', color: '#00FF00' },
  },
};

// Liste des valeurs valides pour l'enum MongoDB
export const VALID_ORIENTATIONS = Object.keys(ORIENTATIONS.political);

// Helper pour obtenir la couleur d'une orientation politique
export const getOrientationColor = (orientation) => {
  return ORIENTATIONS.political[orientation]?.color || '#808080'; // Gris par défaut
};

// Helper pour obtenir le label d'une orientation politique
export const getOrientationLabel = (orientation) => {
  return ORIENTATIONS.political[orientation]?.label || orientation;
};
