import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const { isLoggedIn, token, user } = useContext(AuthContext);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [comments, setComments] = useState(post.comments || []);

  const handleCommentToggle = () => setShowCommentForm(prev => !prev);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setCommentError('');
    setCommentLoading(true);
    try {
      const newComment = {
        comment: commentText,
        user: user._id,
        username: user.username,
        date: new Date()
      };
      const response = await axios.post(
        `http://localhost:5000/api/posts/${post._id}/comments`,
        newComment,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const updatedComments = response.data.post?.comments;
      if (updatedComments) setComments(updatedComments);
      setCommentText('');
      setShowCommentForm(false);
    } catch (error) {
      console.error('Error posting comment:', error);
      setCommentError('Failed to post comment');
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <span className="post-author">{post.author}</span>
        <span className="post-date">{new Date(post.date).toLocaleDateString()}</span>
      </div>
      <div className="post-content"><p>{post.content}</p></div>
      <button className="comment-button" onClick={handleCommentToggle}>
        {showCommentForm ? 'Cancel' : 'Comment'}
      </button>
      {showCommentForm && (
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            className="comment-textarea"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Write your comment here..."
            rows="3"
          />
          {commentError && <div className="error">{commentError}</div>}
          <button type="submit" className="submit-comment-button" disabled={commentLoading}>
            {commentLoading ? 'Posting...' : 'Submit Comment'}
          </button>
        </form>
      )}
      {comments.length > 0 && (
        <div className="comments-section">
          {comments.map((com, idx) => (
            <div key={idx} className="comment-item">
              <div className="comment-header">
                <span className="comment-username">By {com.username}</span>
                <span className="comment-date">{new Date(com.date).toLocaleDateString()}</span>
              </div>
              <div className="comment-content">{com.comment}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;
