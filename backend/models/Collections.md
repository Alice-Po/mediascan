# Collections de Sources

Ce document décrit le modèle de données pour la fonctionnalité "Collections de Sources", similaire aux playlists sur Spotify.

## Modèle de données

### Collection

Le modèle `Collection` permet aux utilisateurs de créer des regroupements personnalisés de sources RSS.

```javascript
const CollectionSchema = new mongoose.Schema({
  name: String, // Nom de la collection
  description: String, // Description de la collection
  imageUrl: String, // Image/icône de la collection
  sources: [ObjectId], // Liste des IDs de sources
  userId: ObjectId, // ID de l'utilisateur propriétaire
  isPublic: Boolean, // Indique si la collection est publique
  createdAt: Date, // Date de création
  updatedAt: Date, // Date de dernière modification
});
```

## Relations entre les modèles

### Collection → Source

- Une collection peut contenir plusieurs sources (relation many-to-many)
- La relation est implémentée via un tableau de références `sources` dans le modèle `Collection`
- Chaque élément du tableau est un ID de source (ObjectId référençant le modèle 'Source')

### User → Collection

- Un utilisateur peut avoir plusieurs collections (relation one-to-many)
- La relation est implémentée de deux façons:
  1. Chaque collection a un champ `userId` qui référence son propriétaire
  2. L'utilisateur a un tableau `collections` qui référence toutes ses collections

## Cas d'utilisation

1. **Création d'une collection**:

   - Un utilisateur crée une collection avec un nom, une description et éventuellement une image
   - L'ID de l'utilisateur est automatiquement associé à la collection

2. **Ajout de sources à une collection**:

   - L'utilisateur peut ajouter une ou plusieurs sources à sa collection
   - L'ID de chaque source est ajouté au tableau `sources` de la collection

3. **Filtrage des articles par collection**:

   - Lorsqu'un utilisateur sélectionne une collection, l'application filtre les articles pour n'afficher que ceux provenant des sources de cette collection

4. **Partage de collections**:
   - Les collections peuvent être définies comme publiques (`isPublic: true`)
   - D'autres utilisateurs peuvent voir et utiliser ces collections partagées

## Collections par défaut

Il est recommandé de créer automatiquement certaines collections par défaut pour les nouveaux utilisateurs:

1. **Favoris**: Pour les sources préférées de l'utilisateur
2. **À lire plus tard**: Pour les sources que l'utilisateur souhaite consulter ultérieurement
3. **Actualités**: Pour les sources d'information générale
4. **Tech**: Pour les sources technologiques

## Implémentation technique

- Les collections sont indexées par utilisateur pour des performances optimales
- Une recherche textuelle est disponible sur le nom des collections
- Les timestamps automatiques permettent de suivre les dates de création et de mise à jour
