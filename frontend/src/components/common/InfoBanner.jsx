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
            <a
              href="/feedback"
              className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white/50 hover:bg-white/80 text-blue-700 hover:text-blue-800 rounded-full transition-all duration-200 group"
            >
              <span>Vos retours sont les bienvenus</span>
              <svg
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoBanner;
