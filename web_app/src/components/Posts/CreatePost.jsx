import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import AuthRequired from '../Auth/AuthRequired';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ content })
      });
      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      const data = await response.json();
      console.log('New post:', data);
      setContent('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div>
        <AuthRequired message="Please login to create a post" />
        <p>
          Forgot your password? <Link to="/forgot-password">Reset it here</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows="4"
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;