import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { SavedArticlesProvider } from './context/SavedArticlesContext';
import { DefaultCollectionProvider } from './context/DefaultCollectionContext';
import AppRoutes from './routes/index';
import { SnackbarProvider } from './context/SnackbarContext';
import Snackbar from './components/common/Snackbar';
import { CollectionProvider } from './context/CollectionContext';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <SavedArticlesProvider>
          <DefaultCollectionProvider>
            <Router>
              <SnackbarProvider>
                <CollectionProvider>
                  <AppRoutes />
                  <Snackbar />
                </CollectionProvider>
              </SnackbarProvider>
            </Router>
          </DefaultCollectionProvider>
        </SavedArticlesProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
