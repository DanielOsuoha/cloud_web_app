import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // This connects to a local MongoDB instance
    await mongoose.connect('mongodb://localhost:27017/social_app');
    console.log('Connected to local MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;