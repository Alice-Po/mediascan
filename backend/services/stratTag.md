# Logique de génération de tags sur les articles

1. Vérifier une liste de tags existants, ou si présence d'indice de tag dans de l'html (exemple avec Reporterre)
2. Si pas de tag, utiliser les modèles linguistiques pour générer des tags

## Embeddings vectoriels

Ajouter à la stack :

- Base de données vectorielle (Qdrant) : Stockage des embeddings d'articles et mots-clés.
- Modèle d'embedding local : Pour transformer les textes en vecteurs

1. Création d'un service d'embeddings local
2. Configuration de qdrant avec deux collection : article et keyword
3. Intégration avec mongodb. Middleware pour générer automatiquement l'embedding et les mots-clés lors de la sauvegarde.
   Fonction d'extraction de mots-clés pour les nouveaux articles
4. Système d'enrichissement progressif

Avantages de cette approche pour votre MVP

Indépendance : Solution 100% locale, pas de dépendance à des API externes
Apprentissage continu : Le système s'améliore automatiquement à mesure que votre base d'articles grandit
Compréhension sémantique : Capture les relations sémantiques plutôt que de se limiter aux correspondances exactes
Évolutivité : S'adapte facilement à de nouvelles sources et langues
Intégration transparente avec MongoDB : Complète votre architecture existante

Points à considérer

Performance : L'exécution du modèle d'embedding en local peut être intensive en ressources. Vous pourriez envisager un service de génération d'embeddings séparé.
Démarrage à froid : Le système nécessite un certain volume d'articles catégorisés pour commencer à être efficace. Prévoyez un mécanisme de fallback pour les premiers articles.
Mise à jour périodique : Programmez des tâches pour ré-enrichir la base de mots-clés régulièrement.
