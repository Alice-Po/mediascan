import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import AppRoutes from './routes/index';
import { SnackbarProvider } from './contexts/SnackbarContext';
import Snackbar from './components/common/Snackbar';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <SnackbarProvider>
            <AppRoutes />
            <Snackbar />
          </SnackbarProvider>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
