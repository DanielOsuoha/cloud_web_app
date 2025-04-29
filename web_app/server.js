import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Post from './src/models/Post.js';
import Comment from './src/models/Comment.js';
import auth from './src/middleware/auth.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const PORT = 5000;

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'x7RTp9JqK5vM3nL8';
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://dosuoha:4kP4P8QvytMlDIhm@cluster0.1ziqjik.mongodb.net/social_app?retryWrites=true&w=majority&appName=Cluster0";
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/social_app"; 

mongoose.connect(MONGODB_URI)
.then(() => console.log('Connected to social_app MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


app.get('/api/posts', async (req, res) => {
  console.log('Fetching posts...');
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }
    
    const posts = await Post.find()
    .populate('author', 'username')      
    .sort({ date: -1 });
    console.log('Posts fetched:', posts);
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


app.delete('/api/comments/:commentId', auth, async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId).populate('user', 'username');
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }
    
    if (comment.user._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this comment.' });
    }
    
    await comment.deleteOne();
    
    res.json({ message: 'Comment deleted successfully', deletedComment: comment });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: error.message });
  }
});



app.post('/api/posts/:postId/comments', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    console.log('Received comment:', comment); 
    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: 'Comment cannot be empty' });
    }
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const newComment = new Comment({
      post: new mongoose.Types.ObjectId(postId),
      user: new mongoose.Types.ObjectId(req.user.id),
      content: comment.trim(),
      date: new Date()
    });
    
    await newComment.save();
    const populatedComment = await newComment.populate('user', 'username');
    res.json(populatedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Error adding comment' });
  }
});

app.get('/api/posts/:postId/comments', auth, async (req, res) => {
  console.log('Fetching comments for post:', req.params.postId); // Fixed the typo
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .sort({ date: -1 })
      .populate('user', 'username');
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Error fetching comments' });
  }
});



app.post('/api/posts', auth, async (req, res) => {
  try {
    const { content } = req.body; 
    const post = new Post({
      author: new mongoose.Types.ObjectId(req.user.id),
      content: content,
      date: new Date()
    });
    
    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: error.message });
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

app.post('/api/users/reset-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!password || !password.trim()) {
      return res.status(400).json({ message: 'Password cannot be empty.' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email not found.' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user.password = hashedPassword;
    await user.save();

    return res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error in reset-password:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

app.put('/api/comments/:commentId', auth, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;
    
    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: 'Updated comment cannot be empty' });
    }
    
    const existingComment = await Comment.findById(commentId).populate('user', 'username');
    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }
    
    if (existingComment.user._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this comment.' });
    }
    
    existingComment.content = comment.trim();
    await existingComment.save();
    
    // Return the updated comment with populated user field
    res.json(existingComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: error.message });
  }
});

// app.post('/api/posts/:id', auth, async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ error: 'Post not found' });
//     if (post.author !== req.user.username) {
//       return res.status(403).json({ error: 'Not authorized' });
//     }
//     await post.deleteOne();
//     res.json({ message: 'Post deleted' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.put('/api/posts/:id', auth, async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ error: 'Post not found' });
//     if (post.author !== req.user.username) {
//       return res.status(403).json({ error: 'Not authorized' });
//     }
//     post.content = req.body.content;
//     await post.save();
//     res.json(post);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.post('/api/comments/:commentId/update', auth, async (req, res) => {
//   try {
//     const { commentId } = req.params;
//     const { comment } = req.body;
    
//     if (!comment || !comment.trim()) {
//       return res.status(400).json({ error: 'Updated comment cannot be empty' });
//     }
    
//     const existingComment = await Comment.findById(commentId);
//     if (!existingComment) {
//       return res.status(404).json({ error: 'Comment not found.' });
//     }
    
//     if (existingComment.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ error: 'Not authorized to update this comment.' });
//     }
    
//     existingComment.content = comment.trim();
//     await existingComment.save();
    
//     const populatedComment = await existingComment.populate('user', 'username');
//     res.json(populatedComment);
//   } catch (error) {
//     console.error('Error updating comment:', error);
//     res.status(500).json({ error: 'Error updating comment' });
//   }
// });



app.post('/api/users/verify-email', auth, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address' });
    }
    if (user._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'This email address does not match your account' });
    }
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/password', auth, async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.email !== email) {
      return res.status(400).json({ error: 'Email does not match your account' });
    }
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters and include uppercase, lowercase, number and special character'
      });
    }
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ error: 'New password must be different from current password' });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    console.log(`Password updated for user: ${user.email} at ${new Date()}`);
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ error: 'Server error while updating password' });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));