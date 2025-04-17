import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { CATEGORIES } from '../config/constants.js';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Veuillez fournir une adresse email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir une adresse email valide'],
    },
    password: {
      type: String,
      required: [true, 'Veuillez fournir un mot de passe'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    },
    name: {
      type: String,
      trim: true,
    },
    interests: [
      {
        type: String,
        enum: CATEGORIES,
      },
    ],
    activeSources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Source',
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    verificationTokenExpires: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    savedArticles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Méthode: Hashage du mot de passe avant sauvegarde
UserSchema.pre('save', async function (next) {
  // Ne hashe le mot de passe que s'il a été modifié (ou est nouveau)
  if (!this.isModified('password')) return next();

  try {
    // Génère un salt
    const salt = await bcrypt.genSalt(10);
    // Hashe le mot de passe avec le salt
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Sauvegarde utilisateur:', {
      id: this._id,
      interests: this.interests,
      activeSources: this.activeSources,
      onboardingCompleted: this.onboardingCompleted,
    });
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode: Vérification du mot de passe
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);
