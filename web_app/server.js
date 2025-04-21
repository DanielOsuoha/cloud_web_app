import express from 'express';
import mongoose from 'mongoose';
import Post from './src/models/Post.js';

const app = express();
app.use(express.json());

// Connect to local MongoDB
mongoose.connect('mongodb://localhost:27017/social_app')
  .then(() => console.log('Connected to local MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test route to create a post
app.post('/api/posts', async (req, res) => {
  try {
    const post = new Post({
      author: 'Test User',
      content: 'Test post content'
    });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));