import React from 'react';
import { SearchIcon, CloseIcon } from '../common/icons';

/**
 * Composant de barre de recherche avec contexte
 * @param {Object} props - Propriétés du composant
 * @param {string} props.searchInput - Valeur actuelle de la recherche
 * @param {Function} props.handleSearch - Fonction appelée lors de la modification du champ
 * @param {Function} props.clearSearch - Fonction pour effacer la recherche
 */
const SearchBar = ({ searchInput, handleSearch, clearSearch }) => {
  return (
    <div className="mb-6">
      <div className="relative">
        <input
          id="search"
          type="text"
          value={searchInput}
          onChange={handleSearch}
          placeholder="Rechercher dans mes articles..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 text-sm"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="text-gray-400" />
        </div>
        {searchInput && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            aria-label="Effacer la recherche"
          >
            <CloseIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
