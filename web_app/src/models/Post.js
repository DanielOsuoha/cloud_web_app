import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  comments: [{
    comment: String,
    username: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

// Fix: Change model definition to use schema name correctly
const Post = mongoose.model('Post', postSchema);
export default Post;