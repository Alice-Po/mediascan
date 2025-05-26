import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Sous-schéma pour les liens sociaux
const SocialLinkSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
      match: [/^https?:\/\//, "L'URL doit commencer par http:// ou https://"],
    },
  },
  { _id: false }
);

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
    avatar: {
      type: Buffer,
      description: "Données binaires de l'avatar de l'utilisateur",
      default: null,
    },
    avatarType: {
      type: String,
      description: "Type MIME de l'avatar (ex: image/png)",
      default: null,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'La biographie ne peut pas dépasser 500 caractères'],
      description: "Biographie de l'utilisateur",
    },
    socialLinks: {
      type: [SocialLinkSchema],
      default: [],
      description: "Liste des liens sociaux de l'utilisateur",
    },
    defaultCollection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      description: "Collection par défaut de l'utilisateur ('Mes sources')",
    },
    collections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
        description: "Collections privées de l'utilisateur et collections publiques qu'il a créées",
      },
    ],
    followedCollections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
        description: "Collections publiques que l'utilisateur suit",
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

// Méthode: Récupération de la collection par défaut
UserSchema.methods.getDefaultCollection = async function () {
  const Collection = mongoose.model('Collection');

  // Si l'utilisateur a déjà une collection par défaut définie
  if (this.defaultCollection) {
    return await Collection.findById(this.defaultCollection);
  }

  // Sinon, trouver la première collection de l'utilisateur nommée "Mes sources"
  const defaultCollection = await Collection.findOne({
    userId: this._id,
    name: 'Mes sources',
  });

  // Si trouvée, définir cette collection comme collection par défaut
  if (defaultCollection) {
    this.defaultCollection = defaultCollection._id;
    await this.save();
    return defaultCollection;
  }

  // Si aucune collection par défaut n'est trouvée, en créer une nouvelle
  const newDefaultCollection = await Collection.create({
    name: 'Mes sources',
    description: 'Collection par défaut pour vos sources',
    userId: this._id,
    sources: [],
    colorHex: '#3B82F6',
  });

  this.defaultCollection = newDefaultCollection._id;
  this.collections.push(newDefaultCollection._id);
  await this.save();

  return newDefaultCollection;
};

export default mongoose.model('User', UserSchema);
