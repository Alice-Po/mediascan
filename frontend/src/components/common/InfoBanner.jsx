import React from 'react';

const InfoBanner = ({ className = '' }) => {
  return (
    <div
      className={`bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100 p-3 text-center fixed top-0 right-0 left-0 z-50 ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 text-sm text-blue-800">
          <span role="img" aria-label="construction" className="hidden sm:inline">
            🏗️
          </span>
          <p>
            <span className="font-semibold">Version alpha</span> - Il est possible que vous
            rencontriez des bugs.
            <a href="/feedback" className="ml-2 text-blue-600 hover:text-blue-800 underline ">
              Vos retours sont les bienvenus !
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoBanner;
