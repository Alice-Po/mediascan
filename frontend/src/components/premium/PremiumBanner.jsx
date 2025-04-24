import React from 'react';
import PropTypes from 'prop-types';

const VARIANTS = {
  reflection: {
    label: 'En réflexion',
    gradient: 'from-blue-50 to-purple-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
    link: 'text-blue-700 hover:text-blue-900',
  },
  coming: {
    label: 'Bientôt disponible',
    gradient: 'from-purple-50 to-indigo-50',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-800',
    link: 'text-purple-700 hover:text-purple-900',
  },
};

const PremiumBanner = ({
  title,
  description,
  linkText,
  className = '',
  variant = 'reflection',
}) => {
  const styles = VARIANTS[variant];

  return (
    <div
      className={`bg-gradient-to-r ${styles.gradient} rounded-lg border-2 border-dashed ${styles.border} overflow-hidden ${className}`}
    >
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${styles.badge}`}>
            {styles.label}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <a
          href="/premium"
          className={`inline-flex items-center gap-2 text-sm font-medium ${styles.link} group`}
        >
          <span>{linkText}</span>
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

PremiumBanner.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['reflection', 'coming']),
};

export default PremiumBanner;
