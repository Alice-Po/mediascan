import React from 'react';
import PropTypes from 'prop-types';
import Accordion from './Accordion';

/**
 * Composant FAQ réutilisable
 * Affiche une liste de questions-réponses dans un format accordéon
 *
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.items - Liste des items FAQ avec titre et contenu
 * @param {string} props.title - Titre de la section FAQ (optionnel)
 * @param {string} props.description - Description de la section FAQ (optionnel)
 * @param {string} props.className - Classes CSS additionnelles pour le conteneur
 * @param {string} props.itemClassName - Classes CSS additionnelles pour chaque item
 */
const FAQ = ({
  items,
  title = 'Foire aux questions',
  description,
  className = '',
  itemClassName = 'border-b-0 bg-white rounded-lg shadow-sm p-4 hover:bg-gray-50 transition',
}) => {
  return (
    <div className={className}>
      {title && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
          {description && <p className="text-gray-600 mb-6">{description}</p>}
        </div>
      )}

      <div className="space-y-2">
        {items.map((item, index) => (
          <Accordion
            key={index}
            title={item.question}
            titleClassName="text-lg font-semibold text-gray-900"
            className={itemClassName}
          >
            <div className="text-gray-700 px-2">
              {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
            </div>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

FAQ.propTypes = {
  /** Liste des items FAQ avec titre et contenu */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    })
  ).isRequired,
  /** Titre de la section FAQ */
  title: PropTypes.string,
  /** Description de la section FAQ */
  description: PropTypes.string,
  /** Classes CSS additionnelles pour le conteneur */
  className: PropTypes.string,
  /** Classes CSS additionnelles pour chaque item */
  itemClassName: PropTypes.string,
};

export default FAQ;
