import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostCard = ({ post }) => {
  // State for the main post content
  const [postText, setPostText] = useState(post.content);
  // State for toggling the comment form and handling the comment input
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');
  // State for holding existing comments
  const [comments, setComments] = useState(post.comments || []);

  // Optionally, log commentText changes for debugging
  useEffect(() => {
    console.log('Current commentText:', commentText);
  }, [commentText]);

  const handleCommentToggle = () => {
    console.log('Comment button clicked');
    setShowCommentForm(prev => !prev);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError('');
    setCommentLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${post._id}/comments`, {
        comment: commentText,
      });
      console.log('Comment added:', response.data);
      // If the backend returns the updated post with comments, use that
      if (response.data.post && response.data.post.comments) {
        setComments(response.data.post.comments);
      } else {
        // Otherwise, append the new comment locally
        setComments(prev => [...prev, { comment: commentText, date: new Date() }]);
      }
      // Clear the comment input using setCommentText
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
        <span className="post-date">
          {new Date(post.date).toLocaleDateString()}
        </span>
      </div>
      <div className="post-content">
        <p>{postText}</p>
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
              <p>{com.comment}</p>
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