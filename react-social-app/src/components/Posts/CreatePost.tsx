import React, { useState } from 'react';

const CreatePost: React.FC = () => {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to handle post creation goes here
        console.log('Post created:', content);
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                required
            />
            <button type="submit">Post</button>
        </form>
    );
};

export default CreatePost;