import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="app-layout">
      {/* Ici, vous pouvez ajouter votre navigation, header, etc. */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
