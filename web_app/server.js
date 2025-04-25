import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Post from './src/models/Post.js';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'x7RTp9JqK5vM3nL8';
const MONGODB_URI = "mongodb://localhost:27017/social_app";

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to social_app MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/api/posts', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }

    console.log('Fetching posts...');
    const posts = await Post.find()
      .sort({ date: -1 })
      .lean();
    
    // console.log(`Found ${posts.length} posts`);
    // console.log('First post:', posts[0]);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(posts);

  } catch (err) {
    console.error('Error fetching posts:', err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

app.post('/api/posts', auth, async (req, res) => {
  try {
    const post = new Post({
      author: req.user.username,
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



app.post('/api/posts/:postId/comments', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newComment = {
      comment,
      user: req.user.id,
      username: req.user.username,
      date: new Date()
    };

    post.comments.push(newComment);
    await post.save();
    res.json({ message: 'Comment added successfully', post });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Error adding comment' });
  }
});

app.get('/api/posts/:postId/comments', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ comments: post.comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

app.post('/api/users/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with that email or username' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salit);
    const user = new User({
      username,
      email,
      password: hashedPassword
    });
    await user.save();
    console.log('New user created:', user);
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email
    };
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const userPayload = {
      id: user._id,
      username: user.username,
      email: user.email
    };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1h' });
    res.json({ user: userPayload, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

app.post('/api/users/update-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Email, current password, and new password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid current password' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedNewPassword;
    await user.save();
    console.log(`Password updated for user: ${user.email}`);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Error updating password' });
  }
});

app.post('/api/users/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    console.log(`Password reset token for ${user.email}: ${resetToken}`);
    res.json({ message: 'Password reset token has been sent to your email' });
  } catch (error) {
    console.error('Error in forgot-password:', error);
    res.status(500).json({ error: 'Error processing forgot password' });
  }
});

// Add this test endpoint to server.js
app.get('/api/test-db', async (req, res) => {
  try {
    // Check DB connection
    const dbState = mongoose.connection.readyState;
    console.log('MongoDB State:', dbState);
    
    // Get connection details
    const dbName = mongoose.connection.name;
    const host = mongoose.connection.host;
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Check users collection
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    
    res.json({
      connection: {
        state: dbState,
        database: dbName,
        host: host
      },
      collections: collections.map(c => c.name),
      stats: {
        users: userCount,
        posts: postCount
      }
    });
  } catch (err) {
    console.error('Database test error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/test-post', async (req, res) => {
  try {
    // Create multiple test posts
    const testPosts = [
      {
        author: 'Test User 1',
        content: 'First test post',
        date: new Date()
      },
      {
        author: 'Test User 2',
        content: 'Second test post',
        date: new Date()
      }
    ];
    
    const posts = await Post.insertMany(testPosts);
    console.log('Test posts created:', posts);
    
    res.json({
      success: true,
      posts: posts
    });
  } catch (err) {
    console.error('Test post error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));