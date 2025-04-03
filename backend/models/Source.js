import mongoose from 'mongoose';

const SourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Veuillez fournir un nom pour la source'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, "Veuillez fournir l'URL du site"],
      trim: true,
    },
    rssUrl: {
      type: String,
      required: [true, "Veuillez fournir l'URL du flux RSS"],
      trim: true,
    },
    faviconUrl: {
      type: String,
      default: '/default-favicon.png',
    },
    categories: [
      {
        type: String,
        enum: [
          'politique',
          'économie',
          'société',
          'culture',
          'sport',
          'sciences',
          'technologie',
          'environnement',
          'santé',
          'international',
        ],
      },
    ],
    orientation: {
      political: {
        type: String,
        enum: ['gauche', 'centre-gauche', 'centre', 'centre-droite', 'droite', 'non-spécifié'],
        default: 'non-spécifié',
      },
      type: {
        type: String,
        enum: ['mainstream', 'alternatif', 'non-spécifié'],
        default: 'non-spécifié',
      },
      structure: {
        type: String,
        enum: ['institutionnel', 'indépendant', 'non-spécifié'],
        default: 'non-spécifié',
      },
      scope: {
        type: String,
        enum: ['généraliste', 'spécialisé', 'non-spécifié'],
        default: 'non-spécifié',
      },
    },
    defaultEnabled: {
      type: Boolean,
      default: false,
    },
    isUserAdded: {
      type: Boolean,
      default: false,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    addedDate: {
      type: Date,
      default: Date.now,
    },
    lastFetched: {
      type: Date,
    },
    fetchStatus: {
      success: Boolean,
      message: String,
      timestamp: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Source', SourceSchema);
