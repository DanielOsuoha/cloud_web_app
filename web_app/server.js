import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Post from './src/models/Post.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/social_app')
  .then(() => console.log('Connected to local MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test route to create a post
app.post('/api/posts', async (req, res) => {
  try {
    const post = new Post({
      author: req.body.author || 'Anonymous',
      content: req.body.content || 'Empty post'
    });
    await post.save();
    console.log('New post created:', post);
    res.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    console.log('Retrieved posts:', posts);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));