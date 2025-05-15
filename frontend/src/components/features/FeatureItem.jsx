import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ContributionModal from './ContributionModal';
import {
  MailIcon,
  SearchIcon,
  PlusCircleIcon,
  UsersIcon,
  GlobeIcon,
  ArchiveIcon,
  InfoIcon,
  GitHubIcon,
} from '../common/icons';

// Liste des couleurs disponibles pour l'alternance
const COLORS = [
  {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700',
    progress: 'bg-blue-600',
  },
  {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    button: 'bg-purple-600 hover:bg-purple-700',
    progress: 'bg-purple-600',
  },
  {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    button: 'bg-emerald-600 hover:bg-emerald-700',
    progress: 'bg-emerald-600',
  },
  {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    button: 'bg-amber-600 hover:bg-amber-700',
    progress: 'bg-amber-600',
  },
  {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    button: 'bg-indigo-600 hover:bg-indigo-700',
    progress: 'bg-indigo-600',
  },
  {
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    button: 'bg-pink-600 hover:bg-pink-700',
    progress: 'bg-pink-600',
  },
];

/**
 * Renvoie l'icône correspondant au nom d'icône
 * @param {string} iconName - Nom de l'icône
 * @returns {JSX.Element} - Composant d'icône
 */
const getIconComponent = (iconName) => {
  switch (iconName) {
    case 'mail':
      return <MailIcon className="w-6 h-6" />;
    case 'search':
      return <SearchIcon className="w-6 h-6" />;
    case 'plus-circle':
      return <PlusCircleIcon className="w-6 h-6" />;
    case 'users':
      return <UsersIcon className="w-6 h-6" />;
    case 'globe':
      return <GlobeIcon className="w-6 h-6" />;
    case 'archive':
      return <ArchiveIcon className="w-6 h-6" />;
    default:
      return <InfoIcon className="w-6 h-6" />;
  }
};

/**
 * Composant réutilisable pour afficher une fonctionnalité dans la liste
 *
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.feature - Informations sur la fonctionnalité
 * @param {Function} props.onDetailClick - Fonction appelée lors du clic sur le bouton de détail
 * @param {Function} props.onContributionComplete - Fonction appelée lorsqu'une contribution a été confirmée
 * @param {Number} props.index - Index de la feature dans la liste pour déterminer la couleur
 */
const FeatureItem = ({ feature, onDetailClick, onContributionComplete, index }) => {
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);

  // Utiliser l'index pour sélectionner une couleur dans le tableau des couleurs
  const colorIndex = index % COLORS.length;
  const colors = COLORS[colorIndex];

  const progressPercentage = Math.round((feature.funded / feature.goal) * 100);

  const handleFundingClick = () => {
    setSelectedAmount(0);
    setShowFundingModal(true);
  };

  const handleCloseModal = () => {
    setShowFundingModal(false);
    if (onContributionComplete) {
      onContributionComplete();
    }
  };

  return (
    <div className={`${colors.bg} rounded-lg p-6`}>
      {/* En-tête avec icône, titre et objectif */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start">
          <div className={`${colors.text} mr-4`}>{getIconComponent(feature.icon)}</div>
          <div>
            <h3 className={`text-xl font-semibold mb-2 ${colors.text}`}>{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold">{feature.goal}€</span>
          <p className="text-sm text-gray-600">Objectif</p>
        </div>
      </div>

      {/* Lien GitHub discret */}
      <div className="mb-4">
        <Link
          to={feature.issue}
          target="_blank"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <GitHubIcon className="mr-1" />
          Suivre sur GitHub
        </Link>
      </div>

      {/* Montant collecté et barre de progression */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">{feature.funded}€ collectés</span>
          <span className="text-gray-600">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-white rounded-full h-2.5">
          <div
            className={`${colors.progress} h-2.5 rounded-full`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex space-x-2">
        <button
          onClick={handleFundingClick}
          className={`flex-1 ${colors.button} text-white py-2 rounded-md transition-colors`}
        >
          Contribuer à cette fonctionnalité
        </button>
        {feature.modal && (
          <button
            onClick={() => onDetailClick(feature)}
            className={`bg-white border px-4 py-2 rounded-md hover:bg-${
              colors.text.split('-')[1]
            }-50 transition-colors border-${colors.text.split('-')[1]}-200 ${colors.text}`}
          >
            En savoir plus
          </button>
        )}
      </div>

      {/* Modal de contribution */}
      {showFundingModal && (
        <ContributionModal
          isOpen={showFundingModal}
          onClose={handleCloseModal}
          feature={feature.title}
          amount={selectedAmount}
        />
      )}
    </div>
  );
};

FeatureItem.propTypes = {
  /** Informations sur la fonctionnalité */
  feature: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    goal: PropTypes.number.isRequired,
    funded: PropTypes.number.isRequired,
    icon: PropTypes.string.isRequired,
    issue: PropTypes.string,
    modal: PropTypes.string,
  }).isRequired,
  /** Fonction appelée lors du clic sur le bouton de détail */
  onDetailClick: PropTypes.func.isRequired,
  /** Fonction appelée lorsqu'une contribution a été confirmée */
  onContributionComplete: PropTypes.func,
  /** Index de la feature pour déterminer la couleur */
  index: PropTypes.number.isRequired,
};

export default FeatureItem;
