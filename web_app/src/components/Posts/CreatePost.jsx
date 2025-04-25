import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import AuthRequired from '../Auth/AuthRequired';
import axios from 'axios';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, token } = useContext(AuthContext);  // Get token from context

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/posts',
        { content },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token  
          }
        }
      );

      if (response.data) {
        setContent('');
        window.location.reload();
      }
    } catch (error) {
      console.error('Post creation error:', error.response?.data || error);
      setErrorMsg(error.response?.data?.error || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="create-post-container">
        <AuthRequired message="Please login to create a post" />
        <p>
          Forgot your password? <Link to="/forgot-password">Reset it here</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="create-post-container">
      <form className="create-post-form" onSubmit={handleSubmit}>
        <textarea
          className="create-post-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows="4"
        />
        {errorMsg && <p className="error-message">{errorMsg}</p>}
        <button className="create-post-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;