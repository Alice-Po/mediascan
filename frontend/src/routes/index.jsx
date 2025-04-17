import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages
import Dashboard from '../pages/Dashboard';
import Sources from '../pages/Sources';
import Saved from '../pages/Saved';
import Statistics from '../pages/Statistics';
import Profile from '../pages/Profile';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Onboarding from '../pages/auth/Onboarding';
import VerifyEmail from '../pages/auth/VerifyEmail';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Routes protégées */}
      <Route element={<AuthLayout />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sources" element={<Sources />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/statistics" element={<Statistics />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
