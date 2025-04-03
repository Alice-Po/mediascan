import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        'articleClick',
        'sourceAdd',
        'sourceRemove',
        'sourcesModify',
        'filterApply',
        'articleSave',
        'articleUnsave',
        'pedagogyVisit',
        'userLogin',
        'userRegister',
      ],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
      },
      sourceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Source',
      },
      orientation: {
        political: String,
        type: String,
        structure: String,
        scope: String,
      },
      category: String,
      filters: Object,
      userAgent: String,
      platform: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour accélérer la recherche par utilisateur
AnalyticsSchema.index({ userId: 1, timestamp: -1 });

// Index pour accélérer la recherche par type d'événement
AnalyticsSchema.index({ eventType: 1 });

export default mongoose.model('Analytics', AnalyticsSchema);
