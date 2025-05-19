import React, { useState } from 'react';
import Badge from './Badge';

// Composant formulaire d'ajout de tags
const TagInputForm = ({ tags, setTags, error }) => {
  // État pour stocker le tag en cours de saisie
  const [currentTag, setCurrentTag] = useState('');

  // Ajout d'un nouveau tag
  const addTag = () => {
    // Vérifier si le tag est vide
    if (!currentTag.trim()) {
      return;
    }

    // Vérifier si on a déjà 3 tags
    if (tags.length >= 3) {
      return;
    }

    // Vérifier si le tag existe déjà
    if (tags.includes(currentTag.trim())) {
      return;
    }

    // Ajouter le tag à la liste
    setTags((prev) => ({
      ...prev,
      orientation: [...prev.orientation, currentTag.trim()],
    }));
    setCurrentTag('');
  };

  // Suppression d'un tag
  const removeTag = (indexToRemove) => {
    setTags((prev) => ({
      ...prev,
      orientation: prev.orientation.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Gestion de la touche Entrée pour ajouter un tag
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Tags ({tags.length}/3)
        </label>

        <div className="flex flex-wrap mb-2">
          {tags.map((tag, index) => (
            <Badge key={index} text={tag} onRemove={() => removeTag(index)} />
          ))}
        </div>

        <div className="flex">
          <input
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={tags.length >= 3}
            placeholder={tags.length >= 3 ? 'Limite de tags atteinte' : 'Ajouter un tag...'}
            className="flex-1 p-2 border border-gray-300 rounded-l focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={addTag}
            disabled={tags.length >= 3 || !currentTag.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 focus:outline-none disabled:bg-blue-300"
          >
            Ajouter
          </button>
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        <p className="mt-1 text-sm text-gray-500">
          Vous pouvez ajouter jusqu'à 3 tags. Les tags peuvent contenir des espaces.
        </p>
      </div>
    </div>
  );
};

export default TagInputForm;
