import React from 'react';
import { Outlet } from 'react-router-dom';
import InfoBanner from '../components/common/InfoBanner';

const PublicAuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <InfoBanner />
      <div className="pt-16">
        {' '}
        {/* Ajouter un padding-top pour compenser l'InfoBanner */}
        <Outlet />
      </div>
    </div>
  );
};

export default PublicAuthLayout;
