import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PostList from './Posts/PostList';
import CreatePost from './Posts/CreatePost';

const Landing = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const firstName =
    isLoggedIn && user
      ? user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase()
      : 'GUEST';

  return (
    <div className="landing-container">
      <header className="landing-header">
        {isLoggedIn ? (
          <>
            <h1>Welcome, {firstName}!</h1>
            <p>Share your thoughts with the world</p>
          </>
        ) : (
          <>
            <h1>Welcome to Social Cloud</h1>
            <p>Please log in or sign up to share your thoughts</p>
          </>
        )}
      </header>

      <section className="posts-feed">
        <div className="posts-header">
          <CreatePost />
        </div>
        <div className="posts-list">
          <h2>Recent Posts</h2>
          <PostList />
        </div>
      </section>
    </div>
  );
};

export default Landing;