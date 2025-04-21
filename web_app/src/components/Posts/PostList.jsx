import React, { useState } from 'react';
import PostCard from './PostCard';
const PostList = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'John Doe',
      content: 'This is a sample post',
      date: new Date().toLocaleString(),
    },
    // Add more sample posts as needed
  ]);

  return (
    <div className="posts-grid">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;