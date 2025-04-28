import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import PostList from './Posts/PostList';
import CreatePost from './Posts/CreatePost';
import LogoutButton from './Auth/LogoutButton';
import './Landing.css'; 

const Landing = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const firstName =
    isLoggedIn && user
      ? user.username.toUpperCase()
      : 'GUEST';

  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="header-top">
          {isLoggedIn && (
            <div className="logout-container">
              <Link to="/update-password" className="update-password-link">Update Password</Link>
              <LogoutButton />
            </div>
          )}
        </div>
        
        <div className="welcome-message">
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
        </div>
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