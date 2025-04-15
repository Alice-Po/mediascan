import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { addUserSource, updateUserSource, deleteUserSource } from '../api/sourcesApi';
import api from '../api';
import { CATEGORIES, ORIENTATIONS } from '../constants';
import ArticleFilters from '../components/articles/ArticleFilters';
import ArticleList from '../components/articles/ArticleList';

/**
 * Page de gestion des sources
 */
const Sources = () => {
  const {
    userSources,
    allSources,
    loadingSources,
    addOrEnableSource,
    disableSource,
    articles,
    filters,
    setFilters,
  } = useContext(AppContext);

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
      type: 'mainstream',
      structure: 'institutionnel',
      scope: 'généraliste',
    },
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Liste des catégories disponibles
  const categories = CATEGORIES;

  // Options d'orientation
  const orientationOptions = ORIENTATIONS;

  // Memoize la fonction de filtrage pour éviter des re-renders inutiles
  const filteredArticles = React.useMemo(() => {
    return articles.filter((article) => {
      // Filtre par source
      if (filters.sources.length > 0 && !filters.sources.includes(article.sourceId)) {
        return false;
      }

      // Autres filtres...
      return true;
    });
  }, [articles, filters.sources]); // Ne recalculer que si ces dépendances changent

  // Filtrer les sources en fonction de la recherche
  const filteredSources = !searchTerm
    ? userSources
    : userSources.filter(
        (source) =>
          source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          source.categories.some((cat) => cat.toLowerCase().includes(searchTerm.toLowerCase()))
      );

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
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
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
      setSelectedIndex(-1);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la source:", error);
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

  // Gérer l'activation/désactivation d'une source
  const handleToggleSource = async (sourceId, enabled) => {
    try {
      await updateUserSource(sourceId, { enabled: !enabled });

      // Mettre à jour le state local (dans un vrai scénario, on mettrait à jour le context global)
      const updatedSources = userSources.map((source) =>
        source._id === sourceId ? { ...source, enabled: !enabled } : source
      );
      // Dans une application réelle, on mettrait à jour le context AppContext
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la source:', error);
    }
  };

  // Gérer la suppression d'une source personnalisée
  const handleDeleteSource = async (sourceId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette source ?')) {
      try {
        await deleteUserSource(sourceId);

        // Mettre à jour le state local (dans un vrai scénario, on mettrait à jour le context global)
        const updatedSources = userSources.filter((source) => source._id !== sourceId);
        // Dans une application réelle, on mettrait à jour le context AppContext
      } catch (error) {
        console.error('Erreur lors de la suppression de la source:', error);
      }
    }
  };

  // Gérer l'ajout d'une source suggérée
  const handleAddSuggestion = async (sourceId) => {
    try {
      await addUserSource(sourceId);
      setSearchTerm('');

      // Dans une application réelle, on mettrait à jour le context AppContext
    } catch (error) {
      console.error("Erreur lors de l'ajout de la source:", error);
    }
  };

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

  // Modifier la fonction validateRssUrl pour utiliser l'instance API
  const validateRssUrl = async (rssUrl) => {
    try {
      // Utiliser l'instance api au lieu de fetch
      const response = await api.post('/sources/validate-rss', {
        url: rssUrl,
      });

      if (!response.data.isValid) {
        throw new Error(response.data.error);
      }
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error.response?.data?.error || error.message,
      };
    }
  };

  // Modifier la fonction handleCustomSourceSubmit
  const handleCustomSourceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors({});

    // Validation de base
    const errors = {};
    if (!customSource.name.trim()) {
      errors.name = 'Le nom est requis';
    }
    if (!customSource.url.trim()) {
      errors.url = "L'URL du site est requise";
    }
    if (!customSource.rssUrl.trim()) {
      errors.rssUrl = "L'URL du flux RSS est requise";
    }
    if (customSource.categories.length === 0) {
      errors.categories = 'Sélectionnez au moins une catégorie';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      // Valider l'URL RSS
      const rssValidation = await validateRssUrl(customSource.rssUrl);
      if (!rssValidation.isValid) {
        setFormErrors({
          rssUrl: `Erreur de validation du flux RSS : ${rssValidation.error}. 
          Vérifiez que :
          - L'URL est accessible
          - Le flux est au format RSS/XML valide
          - Vous avez les droits d'accès au flux
          - Le flux n'est pas protégé par un pare-feu`,
        });
        setLoading(false);
        return;
      }

      // Ajouter la source
      await addUserSource(customSource);
      setShowAddForm(false);
      setCustomSource({
        name: '',
        url: '',
        rssUrl: '',
        categories: [],
        orientation: {
          political: 'centre',
          type: 'mainstream',
          structure: 'institutionnel',
          scope: 'généraliste',
        },
      });
    } catch (error) {
      console.error('Error adding source:', error);
      setFormErrors({
        submit:
          error.response?.data?.message ||
          `Erreur lors de l'ajout de la source : ${error.message}. 
          Si l'erreur persiste, vérifiez que :
          - Le flux RSS est accessible et à jour
          - Le format du flux est compatible
          - L'URL ne contient pas de caractères spéciaux
          - Le serveur distant autorise l'accès au flux`,
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar avec les filtres */}
        <div className="md:col-span-1">
          <ArticleFilters />
        </div>

        {/* Liste des articles */}
        <div className="md:col-span-3">
          <ArticleList articles={filteredArticles} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Sources);
