# Social Cloud Web App

A social media web application built with React and Node.js.

## Features

- User authentication (signup/login)
- Create and view posts
- Comment on posts
- Real-time updates
- Responsive design

## Tech Stack

- Frontend: React, React Router
- Backend: Express.js, MongoDB
- Authentication: JWT
- API: RESTful endpoints

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB locally:
```bash
mongosh
```

3. Start the backend server:
```bash
npm run server
```

4. Start the React development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/users/signup` - Create new user
- POST `/api/users/login` - Login user

### Posts
- GET `/api/posts` - Get all posts
- POST `/api/posts` - Create new post
- POST `/api/posts/:postId/comments` - Add comment to post

## Environment Variables

Create a `.env` file in the root directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social_app
JWT_SECRET=your_jwt_secret
```

## Development

Access the app at `http://localhost:5173`
API runs at `http://localhost:5000`
