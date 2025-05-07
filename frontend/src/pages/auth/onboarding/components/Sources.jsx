import React from 'react';
import PropTypes from 'prop-types';
import { SelectableSourceItem } from '../../../../components/sources/SourceItem';

const Step5Sources = ({ selectedSources = [], allSources = [], onToggleSource }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
          C'est parti !
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Commencer à personnaliser votre fils en sélectionnant au moins 3 sources pour commencer.
          Vous pourrez en ajouter d'autres plus tard.
        </p>
      </div>

      {/* Compteur de sources sélectionnées */}
      <div className="mb-4 text-sm text-center">
        <span className="font-medium">
          {selectedSources.length} source{selectedSources.length > 1 ? 's' : ''} sélectionnée
          {selectedSources.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Liste des sources */}
      <div className="space-y-2 mb-4 max-h-[60vh] overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 p-2">
        {Array.isArray(allSources) && allSources.length > 0 ? (
          <div className="grid gap-2">
            {allSources.map((source) => (
              <SelectableSourceItem
                key={source._id}
                source={source}
                isSelected={selectedSources.includes(source._id)}
                onToggle={() => onToggleSource(source._id)}
                compact={true}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Aucune source disponible pour le moment</p>
        )}
      </div>

      {/* Note d'information */}
      <div className="space-y-4">
        <p className="text-xs text-gray-500 text-center">
          Les sources sont présentées de manière aléatoire. Vous pourrez affiner vos choix plus tard
          depuis votre profil.
        </p>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <span role="img" aria-label="tip" className="text-xl shrink-0">
              💡
            </span>
            <p className="text-sm text-blue-700">
              Conseil : Commencez avec quelques sources de qualité plutôt que de tout sélectionner.
              Vous pourrez toujours en ajouter plus tard !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

Step5Sources.propTypes = {
  selectedSources: PropTypes.arrayOf(PropTypes.string).isRequired,
  allSources: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      logo: PropTypes.string,
    })
  ).isRequired,
  onToggleSource: PropTypes.func.isRequired,
};

export default Step5Sources;
