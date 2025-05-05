import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Pour générer des IDs uniques

const SnackbarContext = createContext();

// Types de snackbar
export const SNACKBAR_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

export const SnackbarProvider = ({ children }) => {
  const [snackbars, setSnackbars] = useState([]);

  // Ajouter une nouvelle snackbar
  const showSnackbar = useCallback((message, type = SNACKBAR_TYPES.INFO, duration = 5000) => {
    const id = uuidv4();

    setSnackbars((prev) => [...prev, { id, message, type, duration }]);

    // Supprimer automatiquement après la durée spécifiée
    setTimeout(() => {
      setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== id));
    }, duration);

    return id;
  }, []);

  // Supprimer une snackbar spécifique
  const hideSnackbar = useCallback((id) => {
    setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== id));
  }, []);

  return (
    <SnackbarContext.Provider value={{ snackbars, showSnackbar, hideSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error("useSnackbar doit être utilisé à l'intérieur d'un SnackbarProvider");
  }

  return context;
};
