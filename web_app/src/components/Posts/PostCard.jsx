import React, { useState, useContext } from 'react'; // Remove useEffect
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
      user: user._id,    
      username: user.username,
      date: new Date()
    };

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.post(
        `http://localhost:5000/api/posts/${post._id}/comments`, 
        newComment,
        config
      );

      if (response.data && response.data.post.comments) {
        setComments(response.data.post.comments);
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
              <div className="comment-header">
                {console.log(com)}
                {/* <div className="comment-username">By {com.username}</div> */}
                <span className="comment-date">
                  {new Date(com.date).toLocaleDateString()}
                </span>
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