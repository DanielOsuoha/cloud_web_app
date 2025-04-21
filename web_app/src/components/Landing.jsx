import React from 'react';
import PostList from './Posts/PostList';
import CreatePost from './Posts/CreatePost';

const Landing = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to Social Cloud</h1>
        <p>Share your thoughts with the world</p>
      </header>

      <section className="posts-feed">
        <div className="posts-header">
          <h2>Recent Posts</h2>
          <CreatePost />
        </div>
        <PostList />
      </section>

      <aside className="sidebar">
        <div className="auth-buttons">
          <button className="login-btn">Login</button>
          <button className="signup-btn">Sign Up</button>
        </div>
      </aside>
    </div>
  );
};

export default Landing;