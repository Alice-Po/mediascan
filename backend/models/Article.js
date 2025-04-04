import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
    },
    contentSnippet: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    pubDate: {
      type: Date,
      required: true,
      index: true,
    },
    image: {
      type: String,
      trim: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Source',
      required: true,
    },
    // On stocke ces infos dupliquées pour la performance des requêtes et l'historique
    sourceName: {
      type: String,
    },
    sourceFavicon: {
      type: String,
    },
    categories: [
      {
        type: String,
      },
    ],
    orientation: {
      political: String,
      type: String,
      structure: String,
      scope: String,
    },
    // Pour suivre les interactions des utilisateurs
    userInteractions: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        type: {
          type: String,
          enum: ['save', 'read', 'share'],
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // TTL index pour la suppression automatique après 7 jours (version gratuite)
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: '7d' },
    },
    publishedAt: {
      type: Date,
      index: true,
      default: function () {
        return this.pubDate;
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index composé pour la recherche rapide d'articles par source et date
ArticleSchema.index({ sourceId: 1, pubDate: -1 });

// Index pour la recherche d'articles par catégorie
ArticleSchema.index({ categories: 1 });

// Index pour aider à dédoublonner (titre + source)
ArticleSchema.index({ title: 1, sourceId: 1 }, { unique: true });

export default mongoose.model('Article', ArticleSchema);
