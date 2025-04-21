import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from './PostCard';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        // Ensure response.data is an array
        setPosts(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch posts');
        setLoading(false);
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!Array.isArray(posts) || posts.length === 0) {
    return <div className="no-posts">No posts available</div>;
  }

  return (
    <div className="posts-grid">
      {posts.map((post) => (
        <PostCard key={post._id || Math.random()} post={post} />
      ))}
    </div>
  );
};

export default PostList;