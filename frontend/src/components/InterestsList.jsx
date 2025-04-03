import React from 'react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const InterestsList = () => {
  const { userInterests } = useContext(AppContext);

  if (!userInterests || userInterests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <p className="text-gray-500">Aucune thématique sélectionnée</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {userInterests.map((interest) => (
        <span
          key={interest}
          className="px-3 py-1 bg-primary-light text-primary rounded-full text-sm"
        >
          {interest}
        </span>
      ))}
    </div>
  );
};

export default InterestsList;
