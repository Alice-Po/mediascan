import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import PublicAuthLayout from '../layouts/PublicAuthLayout';

// Pages
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Onboarding from '../pages/auth/onboarding/Onboarding';
import VerifyEmail from '../pages/auth/VerifyEmail';
import Feedback from '../pages/Feedback';
import TermsOfService from '../pages/TermsOfService';
import Funding from '../pages/Funding';
import LandingPage from '../pages/LandingPage';
import Collections from '../pages/Collections';
import CollectionForm from '../pages/CollectionForm';
import CollectionDetail from '../pages/CollectionDetail';
// import ForgotPassword from '../pages/auth/ForgotPassword';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Routes publiques */}
      <Route element={<PublicAuthLayout />}>
        <Route path="/login" element={user ? <Navigate to="/app" replace /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        <Route element={<MainLayout />}>
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/funding" element={<Funding />} />
        </Route>
      </Route>

      {/* Routes protégées */}
      <Route element={<AuthLayout />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<MainLayout />}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/new" element={<CollectionForm />} />
          <Route path="/collections/edit/:id" element={<CollectionForm />} />
          <Route path="/collections/:id" element={<CollectionDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
