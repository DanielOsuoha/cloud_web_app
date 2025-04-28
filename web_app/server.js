import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Post from './src/models/Post.js';
import auth from './src/middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'x7RTp9JqK5vM3nL8';
const MONGODB_URI = "mongodb://localhost:27017/social_app";

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to social_app MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


app.get('/api/posts', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }

    console.log('Fetching posts...');
    const posts = await Post.find()
      .sort({ date: -1 })
      .lean();

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
    console.log('Creating new post:', post);
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
      username: req.user.username,
      date: new Date()
    };
    post.comments.push(newComment);
    await post.save();
    const addedComment = post.comments[post.comments.length - 1];
    res.json(addedComment);
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
    console.log('Received signup request for:', email);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

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

    const token = jwt.sign(userPayload, JWT_SECRET, { 
      expiresIn: '6h' 
    });

    console.log('Token created:', {
      payload: userPayload,
      tokenPreview: token.substring(0, 20) + '...'
    });

    res.json({ 
      success: true,
      user: userPayload, 
      token: token  
    });

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

app.post('/api/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author !== req.user.username) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author !== req.user.username) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    post.content = req.body.content;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/posts/:postId/comments/:commentIndex/delete', auth, async (req, res) => {
  console.log('delete343')
  try {
    const { postId, commentIndex } = req.params;
    const index = parseInt(commentIndex, 10);
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (isNaN(index) || index < 0 || index >= post.comments.length) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const comment = post.comments[index];
    if (comment.username !== req.user.username) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    post.comments.splice(index, 1);
    await post.save();

    res.json({
      message: 'Comment deleted successfully',
      deletedComment: comment
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));