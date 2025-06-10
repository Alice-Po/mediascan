import React, { createContext, useContext } from 'react';
import { useCollections } from '../hooks/useCollections';

// Création du contexte
const CollectionContext = createContext();

// Provider qui encapsule le hook useCollections
export const CollectionProvider = ({ children }) => {
  const collections = useCollections();
  return <CollectionContext.Provider value={collections}>{children}</CollectionContext.Provider>;
};

// Hook pour consommer le contexte
export const useCollectionContext = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollectionContext must be used within a CollectionProvider');
  }
  return context;
};

export default CollectionContext;
