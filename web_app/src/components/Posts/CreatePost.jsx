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
  const { isLoggedIn, token } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ content })
      });

      const data = await response.json();
      
      if (response.ok) {
        setContent('');
        window.location.reload();
      } else {
        throw new Error(data.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Post creation error:', error);
      setErrorMsg(error.message || 'Failed to create post');
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