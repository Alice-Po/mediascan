import mongoose from 'mongoose';
import { VALID_ORIENTATIONS } from '../config/constants.js';

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
        'read',
        'save',
        'share',
        'userLogin',
        'userRegister',
        'userLogout',
        'sourceAdd',
        'sourceRemove',
        'emailVerification',
      ],
    },
    metadata: {
      sourceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Source',
      },
      category: String,
      orientation: {
        political: {
          type: String,
          enum: VALID_ORIENTATIONS,
        },
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Middleware pre-save pour logger les événements
// AnalyticsSchema.pre('save', function (next) {
//   console.log('Nouvel événement analytique:', {
//     userId: this.userId,
//     eventType: this.eventType,
//     metadata: {
//       articleId: this.metadata.articleId,
//       sourceId: this.metadata.sourceId,
//       orientation: this.metadata.orientation,
//       category: this.metadata.category,
//       timestamp: this.metadata.timestamp,
//     },
//   });
//   next();
// });

// Méthode statique pour logger les statistiques globales
AnalyticsSchema.statics.logStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' },
        uniqueArticles: { $addToSet: '$metadata.articleId' },
        uniqueSources: { $addToSet: '$metadata.sourceId' },
      },
    },
  ]);

  console.log('Statistiques globales:', {
    stats: stats.map((stat) => ({
      eventType: stat._id,
      count: stat.count,
      uniqueUsers: stat.uniqueUsers.length,
      uniqueArticles: stat.uniqueArticles.length,
      uniqueSources: stat.uniqueSources.length,
    })),
  });

  return stats;
};

// Méthode statique pour logger les statistiques d'un utilisateur
AnalyticsSchema.statics.logUserStats = async function (userId) {
  const userStats = await this.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) },
    },
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
        uniqueArticles: { $addToSet: '$metadata.articleId' },
        uniqueSources: { $addToSet: '$metadata.sourceId' },
        categories: { $addToSet: '$metadata.category' },
        orientations: { $push: '$metadata.orientation' },
      },
    },
  ]);

  console.log(`Statistiques pour l'utilisateur ${userId}:`, {
    stats: userStats.map((stat) => ({
      eventType: stat._id,
      count: stat.count,
      uniqueArticles: stat.uniqueArticles.length,
      uniqueSources: stat.uniqueSources.length,
      categories: stat.categories,
      orientations: {
        political: [...new Set(stat.orientations.map((o) => o?.political).filter(Boolean))],
        type: [...new Set(stat.orientations.map((o) => o?.type).filter(Boolean))],
        structure: [...new Set(stat.orientations.map((o) => o?.structure).filter(Boolean))],
        scope: [...new Set(stat.orientations.map((o) => o?.scope).filter(Boolean))],
      },
    })),
  });

  return userStats;
};

// Index pour les requêtes fréquentes
AnalyticsSchema.index({ userId: 1, 'metadata.timestamp': -1 });
AnalyticsSchema.index({ userId: 1, eventType: 1 });
AnalyticsSchema.index({ 'metadata.orientation.political': 1 });

const Analytics = mongoose.model('Analytics', AnalyticsSchema);

export default Analytics;
