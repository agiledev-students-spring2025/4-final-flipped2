import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.set('strictQuery', true);
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not defined in .env file');
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => {
    console.log(`MongoDB connected to database: ${mongoose.connection.name}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });
