import mongoose from 'mongoose';
import { CATEGORIES, ORIENTATIONS } from '../config/constants.js';

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
        enum: CATEGORIES,
      },
    ],
    orientation: {
      political: {
        type: String,
        enum: ORIENTATIONS.political,
      },
      type: {
        type: String,
        enum: ORIENTATIONS.type,
      },
      structure: {
        type: String,
        enum: ORIENTATIONS.structure,
      },
      scope: {
        type: String,
        enum: ORIENTATIONS.scope,
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
