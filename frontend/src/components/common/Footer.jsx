import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 md:hidden">
      <div className="container mx-auto px-4">
        <div className="text-center text-sm text-gray-500">
          <Link to="/statistics " className="text-primary hover:underline">
            Découvrez vos statistiques de lecture
          </Link>
          <p className="mt-1">© {new Date().getFullYear()} NewsAgg MVP</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
