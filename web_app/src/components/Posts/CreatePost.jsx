import React, { useState } from 'react';

const CreatePost = () => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you'll add logic to submit the post
    console.log('New post:', content);
    setContent('');
  };

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