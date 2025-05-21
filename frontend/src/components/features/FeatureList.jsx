import React, { useState } from 'react';
import functionalities from './functionalities.json';
import FeatureDetailModal from './FeatureDetailModal';
import FeatureItem from './FeatureItem';
// Importation dynamique des composants de détail
import OnboardingPublicCollections from '../../pages/auth/onboarding/components/OnboardingPublicCollections';
import Step3Radar from '../../pages/auth/onboarding/components/Radar';
import Step4Coverage from '../../pages/auth/onboarding/components/Coverage';
import Step5Credits from '../../pages/auth/onboarding/components/Credits';

const FeatureList = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleDetailClick = (feature) => {
    if (feature.modal) {
      setSelectedFeature(feature);
      setShowDetailModal(true);
    }
  };

  const handleContributionComplete = () => {
    // Cette fonction pourrait être utilisée pour mettre à jour l'affichage après une contribution
    console.log('Contribution complétée');
  };

  // Fonction pour obtenir le composant de détail en fonction du nom
  const getDetailComponent = (modalName) => {
    switch (modalName) {
      case 'PublicCollections':
        return <OnboardingPublicCollections />;

      case 'Radar':
        return <Step3Radar />;
      case 'Coverage':
        return <Step4Coverage />;
      case 'Credits':
        return <Step5Credits />;
      default:
        return <div>Détails non disponibles</div>;
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {functionalities.map((feature, index) => (
          <FeatureItem
            key={index}
            feature={feature}
            onDetailClick={handleDetailClick}
            onContributionComplete={handleContributionComplete}
            index={index}
          />
        ))}
      </div>

      {/* Modal de détail */}
      {showDetailModal && selectedFeature && (
        <FeatureDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          feature={selectedFeature}
          detailComponent={getDetailComponent(selectedFeature.modal)}
        />
      )}
    </div>
  );
};

export default FeatureList;
