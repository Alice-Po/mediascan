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
    image: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        index: true,
      },
    ],
    language: {
      type: String,
      trim: true,
      default: 'fr',
      enum: ['fr', 'en', 'es', 'de', 'it'],
      index: true,
    },
    creator: {
      type: String,
      trim: true,
      index: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Source',
      required: true,
    },
    sourceName: {
      type: String,
    },
    sourceFavicon: {
      type: String,
    },
    orientations: {
      type: [String],
    },
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
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: '7d' },
    },
    publishedAt: {
      type: Date,
      required: true,
      index: true,
      default: Date.now, // fallback si aucune date n'est fournie
    },
  },
  {
    timestamps: true,
  }
);

ArticleSchema.index({ sourceId: 1, publishedAt: -1 });
ArticleSchema.index({ title: 1, sourceId: 1 }, { unique: true });
ArticleSchema.index({ language: 1, publishedAt: -1 });
ArticleSchema.index({ tags: 1, publishedAt: -1 });
ArticleSchema.index({ creator: 1, publishedAt: -1 });

export default mongoose.model('Article', ArticleSchema);
