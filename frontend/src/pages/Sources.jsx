import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { addUserSource, updateUserSource, deleteUserSource } from '../api/sourcesApi';
import { CATEGORIES, ORIENTATIONS } from '../constants';
import { isLightColor } from '../utils/colorUtils';

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

  // Gérer l'affichage du formulaire d'ajout de source personnalisée
  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    setFormErrors({});
  };

  // Gérer le changement dans le formulaire d'ajout
  const handleCustomSourceChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('orientation.')) {
      const orientationType = name.split('.')[1];
      setCustomSource({
        ...customSource,
        orientation: {
          ...customSource.orientation,
          [orientationType]: value,
        },
      });
    } else {
      setCustomSource({
        ...customSource,
        [name]: value,
      });
    }

    // Effacer l'erreur
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  // Gérer le changement dans les catégories
  const handleCategoryChange = (category) => {
    const updatedCategories = customSource.categories.includes(category)
      ? customSource.categories.filter((cat) => cat !== category)
      : [...customSource.categories, category];

    setCustomSource({
      ...customSource,
      categories: updatedCategories,
    });

    // Effacer l'erreur
    if (formErrors.categories) {
      setFormErrors({
        ...formErrors,
        categories: null,
      });
    }
  };

  // Valider le formulaire d'ajout
  const validateCustomSource = () => {
    const errors = {};

    if (!customSource.name.trim()) {
      errors.name = 'Le nom est requis';
    }

    if (!customSource.url.trim()) {
      errors.url = "L'URL est requise";
    } else if (
      !customSource.url.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)
    ) {
      errors.url = 'URL invalide';
    }

    if (!customSource.rssUrl.trim()) {
      errors.rssUrl = "L'URL du flux RSS est requise";
    } else if (
      !customSource.rssUrl.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)
    ) {
      errors.rssUrl = 'URL du flux RSS invalide';
    }

    if (customSource.categories.length === 0) {
      errors.categories = 'Sélectionnez au moins une catégorie';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumettre le formulaire d'ajout
  const handleCustomSourceSubmit = async (e) => {
    e.preventDefault();

    if (!validateCustomSource()) {
      return;
    }

    setLoading(true);

    try {
      const response = await addUserSource({
        ...customSource,
        isUserAdded: true,
      });

      if (response && response.data) {
        await addOrEnableSource(response.data._id);

        setCustomSource({
          name: '',
          url: '',
          rssUrl: '',
          categories: [],
          orientation: {
            political: 'centre',
          },
        });

        setShowAddForm(false);
        setSearchTerm('');
        setFormErrors({});
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la source personnalisée:", error);
      setFormErrors({
        submit:
          error.response?.data?.message ||
          "Erreur lors de l'ajout de la source. Vérifiez l'URL du flux RSS.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Log pour debug
  useEffect(() => {
    console.log('Sources component data:', {
      userSources,
      userSourcesEnabled: userSources.filter((source) => source.enabled),
      allSources,
      loadingSources,
    });
  }, [userSources, allSources, loadingSources]);

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
          <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg">
            {suggestions.map((source, index) => (
              <li
                key={source._id}
                className={`p-2 hover:bg-gray-100 cursor-pointer ${
                  index === selectedIndex ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleSuggestionSelect(source)}
              >
                {source.name}
              </li>
            ))}
          </ul>
        )}

        {/* Formulaire d'ajout - affiché quand la recherche ne donne aucun résultat */}
        {showAddForm && searchTerm.trim() && (
          <div className="mt-4">
            <p className="text-gray-600 mb-2">
              Aucune source trouvée. Voulez-vous ajouter une nouvelle source ?
            </p>
            <form
              onSubmit={handleCustomSourceSubmit}
              className="border border-gray-200 rounded-md p-4 mb-4"
            >
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Ajouter une source personnalisée
              </h3>

              {formErrors.submit && (
                <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                  {formErrors.submit}
                </div>
              )}

              <div className="space-y-4">
                {/* Nom de la source */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la source <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={customSource.name}
                    onChange={handleCustomSourceChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.name ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="Le Monde, Libération, etc."
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* URL de la source */}
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                    URL du site <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="url"
                    name="url"
                    value={customSource.url}
                    onChange={handleCustomSourceChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.url ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="https://www.lemonde.fr"
                  />
                  {formErrors.url && <p className="text-red-500 text-xs mt-1">{formErrors.url}</p>}
                </div>

                {/* URL du flux RSS */}
                <div>
                  <label htmlFor="rssUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    URL du flux RSS <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="rssUrl"
                    name="rssUrl"
                    value={customSource.rssUrl}
                    onChange={handleCustomSourceChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.rssUrl ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="https://www.lemonde.fr/rss/une.xml"
                  />
                  {formErrors.rssUrl && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.rssUrl}</p>
                  )}
                </div>

                {/* Catégories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégories <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategoryChange(category)}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          customSource.categories.includes(category)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  {formErrors.categories && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.categories}</p>
                  )}
                </div>

                {/* Orientation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(orientationOptions).map(([type, options]) => (
                    <div key={type}>
                      <label
                        htmlFor={`orientation.${type}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {type === 'political'
                          ? 'Orientation politique'
                          : type === 'type'
                          ? 'Type de média'
                          : type === 'structure'
                          ? 'Structure'
                          : 'Portée'}
                      </label>
                      <select
                        id={`orientation.${type}`}
                        name={`orientation.${type}`}
                        value={customSource.orientation[type]}
                        onChange={handleCustomSourceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={toggleAddForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded-md ${
                      loading
                        ? 'bg-gray-300 text-gray-600'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {loading ? (
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></span>
                    ) : null}
                    Ajouter
                  </button>
                </div>
              </div>
            </form>
          </div>
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
                  <li key={source._id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {source.faviconUrl && (
                          <img src={source.faviconUrl} alt="" className="w-6 h-6" />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{source.name}</h3>
                          <p className="text-sm text-gray-500">
                            {source.categories.slice(0, 3).join(', ')}
                            {source.categories.length > 3 && '...'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full`}
                          style={{
                            backgroundColor:
                              ORIENTATIONS.political[source.orientation.political]?.color ||
                              '#f3f4f6',
                            color: isLightColor(
                              ORIENTATIONS.political[source.orientation.political]?.color ||
                                '#f3f4f6'
                            )
                              ? '#000000'
                              : '#ffffff',
                          }}
                        >
                          {ORIENTATIONS.political[source.orientation.political]?.label ||
                            source.orientation.political}
                        </span>
                        <button
                          onClick={() => {
                            console.log('Disabling source:', source._id);
                            disableSource(source._id);
                          }}
                          className="text-sm text-gray-400 hover:text-red-600 transition-colors"
                          title="Retirer cette source"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default Sources;
