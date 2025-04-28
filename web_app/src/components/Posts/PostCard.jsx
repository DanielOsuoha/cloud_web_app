import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const PostCard = ({ post }) => {
  const { user, token } = useContext(AuthContext);
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

    if (!token) {
      alert('Please login to comment');
      return;
    }
    if (!commentText.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    setCommentLoading(true);
    setCommentError('');

    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${post._id}/comments`,
        { comment: commentText },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log('Response from posting comment:', response);
      setComments(prev => [...prev, response.data]);
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
      setCommentError(error.response?.data?.error || 'Error posting comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    
    setComments(prevComments =>
      prevComments.filter(comment => comment._id !== commentId)
    );
  };

  const handleUpdateComment = async (commentId) => {
    const updatedCommentText = window.prompt("Enter the updated comment:");
    if (!updatedCommentText || !updatedCommentText.trim()) {
      alert("Updated comment cannot be empty");
      return;
    }
    setComments(prevComments =>
      prevComments.map(c =>
        c._id === commentId ? { ...c, comment: updatedCommentText } : c
      )
    );
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <span className="post-author">    
          {typeof post.author === 'object' ? post.author.username : 'Unknown User'}
        </span>
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
          {comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <div className="comment-username">By {comment.username}</div>
                <span className="comment-date">
                  {new Date(comment.date).toLocaleString()}
                </span>
                {user?.username === comment.username && (
                  <>
                  <button
                    className="delete-comment-button"
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="update-comment-button"
                    onClick={() => handleUpdateComment(comment._id)}
                  >
                    Update
                  </button>
                  </>
                )}
              </div>
              <div className="comment-content">{comment.comment}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;