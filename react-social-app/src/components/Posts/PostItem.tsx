import React from 'react';

interface PostItemProps {
    title: string;
    content: string;
    author: string;
    date: string;
}

const PostItem: React.FC<PostItemProps> = ({ title, content, author, date }) => {
    return (
        <div className="post-item">
            <h2>{title}</h2>
            <p>{content}</p>
            <p>
                <small>
                    Posted by {author} on {date}
                </small>
            </p>
        </div>
    );
};

export default PostItem;