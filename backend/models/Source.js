import mongoose from 'mongoose';
import { CATEGORIES, ORIENTATIONS } from '../config/constants.js';

const SourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, "L'URL est requise"],
      trim: true,
    },
    rssUrl: {
      type: String,
      required: [true, "L'URL du flux RSS est requise"],
      trim: true,
    },
    faviconUrl: {
      type: String,
      default: '/default-favicon.png',
    },
    categories: [
      {
        type: String,
        enum: CATEGORIES,
      },
    ],
    orientation: {
      political: {
        type: String,
        enum: ORIENTATIONS.political,
        default: 'centre',
      },
      type: {
        type: String,
        enum: ORIENTATIONS.type,
        default: 'mainstream',
      },
      structure: {
        type: String,
        enum: ORIENTATIONS.structure,
        default: 'institutionnel',
      },
      scope: {
        type: String,
        enum: ORIENTATIONS.scope,
        default: 'généraliste',
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
