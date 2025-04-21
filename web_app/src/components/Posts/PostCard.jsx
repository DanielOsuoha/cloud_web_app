import React from 'react';

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <div className="post-header">
        <span className="post-author">{post.author}</span>
        <span className="post-date">{post.date}</span>
      </div>
      <div className="post-content">
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export default PostCard;