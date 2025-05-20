import React, { useState } from 'react';
import Badge from './Badge';

// Composant formulaire d'ajout de tags
const TagInputForm = () => {
  // État pour stocker le tag en cours de saisie
  const [currentTag, setCurrentTag] = useState('');

  // État pour stocker la liste des tags
  const [tags, setTags] = useState([]);

  // État pour stocker les messages d'erreur
  const [error, setError] = useState('');

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Tags soumis:', tags);
    // Ici vous pouvez envoyer les tags à votre backend
  };

  // Ajout d'un nouveau tag
  const addTag = () => {
    // Vérifier si le tag est vide
    if (!currentTag.trim()) {
      setError('Le tag ne peut pas être vide');
      return;
    }

    // Vérifier si on a déjà 3 tags
    if (tags.length >= 3) {
      setError('Vous ne pouvez pas ajouter plus de 3 tags');
      return;
    }

    // Vérifier si le tag existe déjà
    if (tags.includes(currentTag.trim())) {
      setError('Ce tag existe déjà');
      return;
    }

    // Ajouter le tag à la liste
    setTags([...tags, currentTag.trim()]);
    setCurrentTag('');
    setError('');
  };

  // Suppression d'un tag
  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
    setError('');
  };

  // Gestion de la touche Entrée pour ajouter un tag
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className=" mx-auto p-4 bg-white rounded-lg shadow">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Tags ({tags.length}/3)
          </label>

          <div className="flex flex-wrap mb-2">
            {tags.map((tag, index) => (
              <Badge key={index} text={tag} onRemove={() => removeTag(index)} />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={tags.length >= 3}
              placeholder={tags.length >= 3 ? 'Limite de tags atteinte' : 'Ajouter un tag...'}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addTag}
              disabled={tags.length >= 3 || !currentTag.trim()}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none disabled:bg-blue-300"
            >
              Ajouter
            </button>
          </div>

          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

          <p className="mt-1 text-sm text-gray-500">
            Vous pouvez ajouter jusqu'à 3 tags. Les tags peuvent contenir des espaces.
          </p>

          {/* Suggestions de tags éditoriaux */}
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Exemples de lignes éditoriales :</p>
            <div className="flex flex-wrap gap-2">
              {[
                'droit',
                'gauche',
                'ecologie',
                'transition écologique',
                'scientifique',
                'tech neutre',
                'tech critique',
                'tech pédagogique',
              ].map((example) => (
                <span
                  key={example}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs border border-gray-200 cursor-pointer hover:bg-blue-100"
                  onClick={() => {
                    if (!tags.includes(example) && tags.length < 3) {
                      setTags([...tags, example]);
                      setError('');
                    }
                  }}
                >
                  {example}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">Cliquez sur un exemple pour l'ajouter.</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TagInputForm;
