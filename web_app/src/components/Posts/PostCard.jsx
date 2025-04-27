import React, { useState, useContext } from 'react'; 
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const handleCommentToggle = () => {
    setShowCommentForm(prev => !prev);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to comment');
        return;
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    };

    try {
        const response = await axios.post(
            `http://localhost:5000/api/posts/${post._id}/comments`,
            { comment: commentText },
            config
        );
        console.log('Comment response:', response.data);
        setComments(prev => [...prev, response.data]);
        setCommentText('');
    } catch (error) {
        console.error('Error posting comment:', error);
        alert(error.response?.data?.message || 'Error posting comment');
    }
};
    
  const handleDelete = async (type, id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `http://localhost:5000/api/${type}/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (type === 'comments') {
        setComments(prev => prev.filter(comment => comment._id !== id));
      } else if (type === 'posts') {
        // Trigger parent component refresh
        window.location.reload();
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert(error.response?.data?.message || `Error deleting ${type}`);
    }
  };

  const handleEdit = async (type, id, newContent) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `http://localhost:5000/api/${type}/${id}`,
        { content: newContent },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (type === 'comments') {
        setComments(prev => 
          prev.map(comment => 
            comment._id === id ? response.data : comment
          )
        );
      } else if (type === 'posts') {
        setEditedContent(newContent);
        setIsEditing(false);
      }
    } catch (error) {
      console.error(`Error editing ${type}:`, error);
      alert(error.response?.data?.message || `Error editing ${type}`);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <span className="post-author">{post.author}</span>
        <span className="post-date">
          {new Date(post.date).toLocaleDateString()}
        </span>
        {user?.username === post.author && (
          <div className="post-actions">
            <button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <button onClick={() => handleDelete('posts', post._id)}>
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="post-content">
        {isEditing ? (
          <div>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows="4"
            />
            <button onClick={() => handleEdit('posts', post._id, editedContent)}>
              Save
            </button>
          </div>
        ) : (
          <p>{post.content}</p>
        )}
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
                <div className="comment-username">By {com.username}</div>
                <span className="comment-date">
                  {new Date(com.date).toLocaleDateString()}
                </span>
                {user?.username === com.username && (
                  <div className="comment-actions">
                    <button onClick={() => handleDelete('comments', com._id)}>
                      Delete
                    </button>
                  </div>
                )}
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