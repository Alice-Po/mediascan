import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { addUserSource, updateUserSource, deleteUserSource } from '../api/sourcesApi';
import { CATEGORIES, ORIENTATIONS } from '../constants';
import { isLightColor } from '../utils/colorUtils';
import SourceItem from '../components/sources/SourceItem';
import AddSourceForm from '../components/sources/AddSourceForm';

/**
 * Page de gestion des sources
 */
const Sources = () => {
  const { userSources, allSources, loadingSources, addOrEnableSource, disableSource } =
    useContext(AppContext);

  // State pour la recherche et l'ajout de sources
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [customSource, setCustomSource] = useState({
    name: '',
    url: '',
    rssUrl: '',
    categories: [],
    orientation: {
      political: 'centre',
    },
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Utiliser les constantes importées au lieu des tableaux locaux
  const categories = CATEGORIES;
  const orientationOptions = {
    political: Object.keys(ORIENTATIONS.political),
  };

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
            !userSources.some((us) => us._id === source._id && us.enabled)
        )
        .slice(0, 5); // Limiter à 5 suggestions
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      // Afficher le formulaire si aucune suggestion n'est trouvée
      setShowAddForm(filtered.length === 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setShowAddForm(false); // Cacher le formulaire si le champ est vide
    }
  };

  // Gérer la navigation au clavier
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  // Gérer la sélection d'une suggestion
  const handleSuggestionSelect = async (source) => {
    try {
      await addOrEnableSource(source._id);
      setSearchTerm('');
      setSuggestions([]);
      setShowSuggestions(false);
      setShowAddForm(false); // Cacher le formulaire après l'ajout
    } catch (error) {
      console.error('Error selecting source:', error);
      setError("Erreur lors de l'ajout de la source");
    }
  };

  // Fermer les suggestions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Handler pour les changements dans le formulaire
  const handleCustomSourceChange = (e) => {
    const { name, value, type } = e.target;
    console.log('Form change:', { name, value, type, currentSource: customSource }); // Log amélioré

    if (type === 'checkbox') {
      const newCategories = [...customSource.categories];
      if (e.target.checked) {
        newCategories.push(value);
      } else {
        const index = newCategories.indexOf(value);
        if (index > -1) {
          newCategories.splice(index, 1);
        }
      }
      setCustomSource({ ...customSource, categories: newCategories });
    } else {
      // Simplification du code - plus besoin de la condition orientation
      setCustomSource((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handler pour la soumission du formulaire
  const handleSubmit = async (sourceData) => {
    try {
      // Validation basique avant envoi
      if (!sourceData.rssUrl) {
        setFormErrors({ rssUrl: "L'URL du flux RSS est requise" });
        return;
      }

      console.log('Submitting source data:', sourceData); // Log avant envoi
      setLoading(true);

      const result = await addUserSource(sourceData);
      console.log('Source added successfully:', result); // Log après succès

      setShowAddForm(false);
      setCustomSource({
        name: '',
        url: '',
        rssUrl: '',
        categories: [],
        orientation: { political: 'centre' },
      });
    } catch (error) {
      console.error('Detailed error:', error.response?.data || error); // Log détaillé de l'erreur
      setError(error.response?.data?.message || "Erreur lors de l'ajout de la source");
      setFormErrors(error.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };

  if (loadingSources) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Bannière Premium */}
      <div className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border-2 border-dashed border-purple-200 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center mb-2">
            <span className="bg-purple-100 px-2 py-0.5 rounded-full text-xs font-mono text-purple-800">
              Bientôt disponible
            </span>
          </div>
          <h3 className="text-lg font-semibold text-purple-900 mb-2">
            Vos infolettres méritent mieux que votre boîte mail !
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Imaginez : toutes vos infolettres préférées, directement dans votre fil d'actualités,
            aux côtés de vos autres sources.
          </p>
          <a
            href="/premium"
            className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 hover:text-purple-900 group"
          >
            <span>En savoir plus sur l'intégration des infolettres</span>
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher une source..."
          className="w-full p-2 border rounded-lg"
        />

        {/* Liste des suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg divide-y divide-gray-200">
            {suggestions.map((source, index) => (
              <li
                key={source._id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  index === selectedIndex ? 'bg-gray-50' : ''
                }`}
                onClick={() => handleSuggestionSelect(source)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSuggestionSelect(source);
                }}
                role="option"
                aria-selected={index === selectedIndex}
                tabIndex={0}
              >
                <SourceItem
                  source={source}
                  onDisable={() => {}} // On désactive le bouton de suppression dans les suggestions
                  variant="compact" // Nouvelle prop pour un affichage adapté aux suggestions
                />
              </li>
            ))}
          </ul>
        )}

        {/* Formulaire d'ajout de source */}
        {showAddForm && (
          <AddSourceForm
            customSource={customSource}
            onSourceChange={handleCustomSourceChange}
            onSubmit={handleSubmit}
            onCancel={() => setShowAddForm(false)}
            loading={loading}
            formErrors={formErrors}
          />
        )}
      </div>

      {/* Sources actives */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Mes sources</h2>
        <div className="bg-white rounded-lg shadow-sm">
          {userSources.filter((source) => source.enabled).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Vous n'avez pas encore de sources actives</p>
              <a href="/onboarding" className="text-primary hover:text-primary-dark underline">
                Ajouter des sources
              </a>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {userSources
                .filter((source) => source.enabled)
                .map((source) => (
                  <SourceItem key={source._id} source={source} onDisable={disableSource} />
                ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default Sources;
