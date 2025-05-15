import React, { useState } from 'react';

/**
 * Composant Accordion réutilisable
 * @param {string} title - Titre de l'accordion
 * @param {React.ReactNode} children - Contenu à afficher quand l'accordion est ouvert
 * @param {boolean} defaultOpen - État initial de l'accordion (ouvert ou fermé)
 * @param {string} className - Classes CSS additionnelles
 * @param {string} titleClassName - Classes CSS additionnelles pour le titre
 */
const Accordion = ({
  title,
  children,
  defaultOpen = false,
  className = '',
  titleClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border-b border-gray-200 py-3 ${className}`}>
      <button
        className="w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`font-medium text-sm text-gray-700 ${titleClassName}`}>{title}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <div
        className={`pt-3 transition-all duration-200 ease-in-out ${isOpen ? 'block' : 'hidden'}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
