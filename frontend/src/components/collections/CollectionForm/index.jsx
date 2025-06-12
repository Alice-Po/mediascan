import React from 'react';
import CreateCollection from './CreateCollection';
import EditCollection from './EditCollection';

/**
 * Point d'entrée du formulaire de collection
 * Route vers le composant approprié selon le contexte (création ou modification)
 */
const CollectionForm = ({ collectionId, isOnboarding, onSuccess, onError }) => {
  // Si un ID est fourni, on est en mode édition
  if (collectionId) {
    return <EditCollection collectionId={collectionId} onSuccess={onSuccess} onError={onError} />;
  }

  // Sinon, on est en mode création
  return <CreateCollection isOnboarding={isOnboarding} onSuccess={onSuccess} onError={onError} />;
};

export default CollectionForm;
