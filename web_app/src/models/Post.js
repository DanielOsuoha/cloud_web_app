// import mongoose from 'mongoose';

// const postSchema = new mongoose.Schema({
//   author: {
//     type: String,
//     required: true
//   },
//   content: {
//     type: String,
//     required: true
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   },
//   comments: [{
//     comment: String,
//     username: String,
//     date: {
//       type: Date,
//       default: Date.now
//     }
//   }]
// });

// const Post = mongoose.model('Post', postSchema);
// export default Post;


import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const commentSchema = new mongoose.Schema({
  id: {
    type: Number,
    // "required" is optional because the plugin fills it in
  },
  comment: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Apply the plugin to the commentSchema to auto increment the "id" field.
commentSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'comment_seq' });

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
  comments: [commentSchema]
});

const Post = mongoose.model('Post', postSchema);
export default Post;