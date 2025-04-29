import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from './PostCard';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('http://34.205.144.114/api/posts');
      setPosts(data);
      // console.log('Fetched posts:', data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch posts');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">{error}</div>;

  const postsToDisplay = showAll ? posts : posts.slice(0, 5);

  return (
    <div>
      <div className="posts-grid">
        {postsToDisplay.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      {posts.length > 5 && !showAll && (
        <button onClick={() => setShowAll(true)}>Show All Posts</button>
      )}
    </div>
  );
};

export default PostList;