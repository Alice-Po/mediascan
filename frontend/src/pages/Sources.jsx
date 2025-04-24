import React, { useState, useEffect } from 'react';
import { useSources } from '../hooks/useSources';
import { DeletableSourceItem, SimpleSourceItem } from '../components/sources/SourceItem';
import AddSourceForm from '../components/sources/AddSourceForm';
import PremiumBanner from '../components/premium/PremiumBanner';

const Sources = () => {
  const {
    sources: userSources,
    allSources,
    loading: loadingSources,
    error,
    enableSource,
    disableSource,
    addSource,
    loadUserSources,
    loadAllSources,
  } = useSources();

  // State local pour l'UI
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Charger les sources au montage
  useEffect(() => {
    loadUserSources();
    loadAllSources();
  }, [loadUserSources, loadAllSources]);

  // Gérer la recherche et les suggestions
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedIndex(-1);

    if (value.trim()) {
      const filtered = allSources
        .filter(
          (source) =>
            source.name.toLowerCase().includes(value.toLowerCase()) &&
            !userSources.some((us) => us._id === source._id)
        )
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setShowAddForm(filtered.length === 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setShowAddForm(false);
    }
  };

  // Handler pour la sélection d'une suggestion
  const handleSuggestionSelect = async (source) => {
    await enableSource(source._id);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  // Handler pour la soumission du formulaire
  const handleSubmit = async (sourceData) => {
    try {
      await addSource(sourceData);
      setShowAddForm(false);
      setFormErrors({});
    } catch (error) {
      setFormErrors(error.response?.data?.errors || {});
    }
  };

  if (loadingSources) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PremiumBanner
        className="mb-8"
        variant="coming"
        title="Vos infolettres ici plutôt que dans votre boîte mail !"
        description="Imaginez : toutes vos infolettres préférées, directement dans votre fil d'actualités, aux côtés de vos autres sources."
        linkText="En savoir plus sur l'intégration des infolettres"
      />

      <div className="relative mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Rechercher une source..."
          className="w-full p-2 border rounded-lg"
        />

        {showSuggestions && (
          <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg">
            {suggestions.map((source) => (
              <li
                key={source._id}
                onClick={() => handleSuggestionSelect(source)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <SimpleSourceItem source={source} />
              </li>
            ))}
          </ul>
        )}

        {showAddForm && (
          <AddSourceForm
            onSubmit={handleSubmit}
            onCancel={() => setShowAddForm(false)}
            formErrors={formErrors}
          />
        )}
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Mes sources</h2>
        <div className="bg-white rounded-lg shadow-sm">
          {userSources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Vous n'avez pas encore de sources actives</p>
              <a href="/onboarding" className="text-primary hover:text-primary-dark underline">
                Ajouter des sources
              </a>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {userSources.map((source) => (
                <DeletableSourceItem
                  key={source._id}
                  source={source}
                  onDelete={() => disableSource(source._id)}
                />
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default Sources;
