import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  // This is a temporary solution - you'll want to implement proper auth state management
  const isLoggedIn = false; // Replace this with actual auth check

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
      <div className="create-post-unauthorized">
        <p>Please <button onClick={() => navigate('/login')}>login</button> to create a post</p>
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