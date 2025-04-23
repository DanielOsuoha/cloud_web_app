import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [comments, setComments] = useState(post.comments || []);

  const handleCommentToggle = () => {
    setShowCommentForm(prev => !prev);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError('');
    setCommentLoading(true);
    
    const newComment = {
      comment: commentText,
      username: user.username, 
      date: new Date()
    };

    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${post._id}/comments`, newComment);
      // Update local state directly with the new comment
      if (response.data && response.data.post.comments) {
        setComments(response.data.post.comments);
      } else {
        setComments(prevComments => [...prevComments, newComment]);
      }
      setCommentText('');
      setShowCommentForm(false);
    } catch (error) {
      console.error('Error posting comment:', error);
      setCommentError('Failed to post comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      console.log('Fetching comments for post:', post._id);
      const token = localStorage.getItem('token'); // Get token from localStorage
      const config = {
        headers: { 
          Authorization: token
        }
      };
      
      const response = await axios.get(
        `http://localhost:5000/api/posts/${post._id}/comments`,
        config
      );
      console.log('Response:', response.data);
      if (response.data && response.data.comments) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post._id]);

  return (
    <div className="post-card">
      <div className="post-header">
        <span className="post-author">{post.author}</span>
        <span className="post-date">
          {new Date(post.date).toLocaleDateString()}
        </span>
      </div>
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      <button className="comment-button" onClick={handleCommentToggle}>
        Comment
      </button>
      {showCommentForm && (
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            className="comment-textarea"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment here..."
            rows="3"
          />
          {commentError && <div className="error">{commentError}</div>}
          <button
            type="submit"
            className="submit-comment-button"
            disabled={commentLoading}
          >
            {commentLoading ? 'Posting...' : 'Submit Comment'}
          </button>
        </form>
      )}
      {comments.length > 0 && (
        <div className="comments-section">
          {comments.map((com, index) => (
            <div key={index} className="comment-item">
              {console.log('Comment:', com)}
              <div className="comment-username">{com.author}</div>
              <div className="comment-content">{com.comment}</div>
              <span className="comment-date">
                {new Date(com.date).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;