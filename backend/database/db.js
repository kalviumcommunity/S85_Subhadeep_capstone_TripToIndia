import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './config/.env' });

const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('📍 DB_URI exists:', !!process.env.DB_URI);

    await mongoose.connect(process.env.DB_URI);
    console.log(' MongoDB Connected Successfully');

    // Add connection event listeners
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

  } catch (error) {
    console.error(' MongoDB Connection Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

export default connectDB;