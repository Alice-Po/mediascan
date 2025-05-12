import mongoose from 'mongoose';

const CollectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom de la collection est requis'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '/default-collection.png',
    },
    sources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Source',
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "L'identifiant de l'utilisateur est requis"],
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Ceci créera automatiquement createdAt et updatedAt
  }
);

// Index pour accélérer la recherche des collections par utilisateur
CollectionSchema.index({ userId: 1 });

// Index pour la recherche par nom
CollectionSchema.index({ name: 'text' });

export default mongoose.model('Collection', CollectionSchema);
