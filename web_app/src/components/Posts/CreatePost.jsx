import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthRequired from '../Auth/AuthRequired';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = false; 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    console.log('New post:', content);
    setContent('');
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