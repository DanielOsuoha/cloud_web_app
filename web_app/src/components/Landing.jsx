import React from 'react';

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
          {/* Add a create post button that shows only if user is logged in */}
        </div>
        
        <div className="posts-grid">
          {/* This will be where your posts are mapped */}
          <div className="post-card">
            <div className="post-header">
              <span className="post-author">John Doe</span>
              <span className="post-date">2 hours ago</span>
            </div>
            <div className="post-content">
              <p>This is a sample post content. Your actual posts will go here.</p>
            </div>
          </div>
        </div>
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