import React from 'react';
import CreateCollection from './CreateCollection';
import EditCollection from './EditCollection';

/**
 * Point d'entrée du formulaire de collection
 * Route vers le composant approprié selon le contexte (création ou modification)
 */
const CollectionForm = ({
  collectionId,
  isOnboarding,
  onSuccess,
  onError,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  // Si un ID est fourni, on est en mode édition
  if (collectionId) {
    return (
      <EditCollection
        collectionId={collectionId}
        onSuccess={onSuccess}
        onError={onError}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
      />
    );
  }

  // Sinon, on est en mode création
  return (
    <CreateCollection
      isOnboarding={isOnboarding}
      onSuccess={onSuccess}
      onError={onError}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
    />
  );
};

export default CollectionForm;
