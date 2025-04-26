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

const Post = mongoose.model('Post', postSchema);
export default Post;