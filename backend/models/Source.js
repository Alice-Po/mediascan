import mongoose from 'mongoose';

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
    },
    description: {
      type: String,
      trim: true,
    },
    funding: {
      type: {
        type: String,
        enum: ['independent', 'public', 'private', 'cooperative', 'association', 'other'],
      },
      details: {
        type: String,
        trim: true,
      },
    },
    orientations: {
      type: [String],
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
    status: {
      type: String,
      enum: ['pending', 'active', 'rejected', 'disabled'],
      default: 'pending',
    },
    moderationNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Source', SourceSchema);
