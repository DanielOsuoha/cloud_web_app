// src/services/posts.ts

import axios from 'axios';

const API_URL = 'https://your-api-url.com/api/posts';

export const fetchPosts = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createPost = async (postData: { content: string }) => {
    const response = await axios.post(API_URL, postData);
    return response.data;
};