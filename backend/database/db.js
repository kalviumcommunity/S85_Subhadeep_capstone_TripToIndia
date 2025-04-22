import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './config/.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log(' MongoDB Connected Successfully');
  } catch (error) {
    console.error(' MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

export default connectDB;