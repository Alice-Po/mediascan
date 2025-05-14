import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { SavedArticlesProvider } from './context/SavedArticlesContext';
import AppRoutes from './routes/index';
import { SnackbarProvider } from './context/SnackbarContext';
import Snackbar from './components/common/Snackbar';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <SavedArticlesProvider>
          <Router>
            <SnackbarProvider>
              <AppRoutes />
              <Snackbar />
            </SnackbarProvider>
          </Router>
        </SavedArticlesProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
