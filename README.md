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

2. Start the backend server:
```bash
npm run server
```

3. Start the React development server:
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
JWT_SECRET=your_jwt_secret
```

## Database Setup

### Option 1: Local MongoDB
1. Install MongoDB locally:
```bash
brew install mongodb-community
```

2. Start MongoDB service:
```bash
brew services start mongodb-community
```

3. Use local connection string:
```
MONGODB_URI=mongodb://localhost:27017/social_app
```

### Option 2: MongoDB Atlas
1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string from Atlas dashboard
3. Replace `<password>` with your database password:
```
MONGODB_URI=mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/social_app
```

### Verifying Connection
```bash
# Check database status
mongosh
> use social_app
> show collections
```

**Note:** For production, always use MongoDB Atlas with proper security measures.
