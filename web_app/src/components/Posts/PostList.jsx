import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts');
        setPosts(response.data);
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

  return (
    <div className="posts-grid">
      {posts.map(post => (
        <div key={post._id} className="post-card">
          <div className="post-header">
            <span className="post-author">{post.author}</span>
            <span className="post-date">
              {new Date(post.date).toLocaleDateString()}
            </span>
          </div>
          <div className="post-content">{post.content}</div>
        </div>
      ))}
    </div>
  );
};

export default PostList;