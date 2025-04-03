import mongoose from 'mongoose';

// URI de connexion MongoDB
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/news_aggregator';

// Options de connexion
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Fonction de connexion à la base de données
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, options);
    console.log(`MongoDB connecté: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Erreur de connexion à MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
