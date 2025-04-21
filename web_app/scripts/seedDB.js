import mongoose from 'mongoose';
import Post from '../src/models/Post.js';

const samplePosts = [
  {
    author: 'John Doe',
    content: 'First sample post'
  },
  {
    author: 'Jane Smith',
    content: 'Second sample post'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/social_app');
    
    // Check if database is already seeded
    // const count = await Post.countDocuments();
    // if (count > 0) {
    //   console.log('Database already has data, skipping seed');
    //   process.exit(0);
    // }

    // Only seed if empty
    await Post.insertMany(samplePosts);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();