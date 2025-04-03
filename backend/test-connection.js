import mongoose from 'mongoose';
import 'dotenv/config';

const uri = process.env.MONGODB_URI;
console.log('Testing connection to:', uri);

try {
  const connection = await mongoose.connect(uri);
  console.log('Connection successful!', connection.connection.host);
  process.exit(0);
} catch (err) {
  console.error('Connection failed:', err);
  process.exit(1);
}
