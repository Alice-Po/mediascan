import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="text-center text-sm text-gray-500">
          <div className="space-x-4">
            {/* <Link to="/statistics" className="text-primary hover:underline">
              Découvrez vos statistiques de lecture
            </Link> */}
            <Link to="/terms-of-service" className="text-primary hover:underline">
              Conditions d'utilisation
            </Link>
            <Link to="/feedback" className="text-primary hover:underline">
              Contactez-nous
            </Link>
          </div>
          <p className="mt-1">© {new Date().getFullYear()} MédiaScan</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
