import React from 'react';
import PostItem from './PostItem';

const PostList: React.FC<{ posts: Array<{ id: number; content: string }> }> = ({ posts }) => {
    return (
        <div>
            <h2>Posts</h2>
            <ul>
                {posts.map(post => (
                    <PostItem key={post.id} post={post} />
                ))}
            </ul>
        </div>
    );
};

export default PostList;