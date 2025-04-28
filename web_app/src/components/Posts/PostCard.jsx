import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const PostCard = ({ post }) => {
  const { user, token } = useContext(AuthContext);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/posts/${post._id}/comments`, 
          {
            headers: token ? {
              'Authorization': `Bearer ${token}`
            } : {}
          }
        );
        setComments(response.data);
      } catch (err) {
        console.error(`Error fetching comments for post ${post._id}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [post._id, token]);

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
    
    try {
      await axios.delete(
        `http://localhost:5000/api/comments/${commentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
        
      // Remove deleted comment from state
      setComments(prevComments =>
        prevComments.filter(comment => comment._id !== commentId)
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const handleUpdateComment = async (commentId) => {
    const updatedCommentText = window.prompt("Enter the updated comment:");
    if (!updatedCommentText || !updatedCommentText.trim()) {
      alert("Updated comment cannot be empty");
      return;
    }
    
    try {
      const response = await axios.put(
        `http://localhost:5000/api/comments/${commentId}`,
        { comment: updatedCommentText },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Update comment in state with the response data
      setComments(prevComments =>
        prevComments.map(c =>
          c._id === commentId ? response.data : c
        )
      );
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment. Please try again.');
    }
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
      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length > 0 ? (
        <div className="comments-section">
          {comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <div className="comment-username">    
                  By {typeof comment.user === 'object' ? comment.user.username : 'Unknown User'}
                </div>
                <span className="comment-date">
                  {new Date(comment.date).toLocaleString()}
                </span>
                {user?.username === (typeof comment.user === 'object' ? comment.user.username : '') && (
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
              <div className="comment-content">{comment.content}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-comments">No comments yet</p>
      )}
    </div>
  );
};

export default PostCard;