# Social Cloud Web Application


## Overview
Social Cloud is a full-stack social media web application built with the MERN stack (MongoDB, Express.js, React, Node.js). It allows users to create accounts, share posts, and interact through comments in a secure environment.

## Key Features
- User authentication (signup, login, password management)
- Post creation and viewing
- Comment functionality (add, update, delete)
- Responsive design

## Technical Architecture

### Frontend (React)
- Component-based UI architecture
- State management with React hooks and Context API
- Axios for API communication
- React Router for navigation
- Form validation and error handling

### Backend (Node.js/Express)
- RESTful API design
- JWT authentication
- MongoDB integration with Mongoose
- Password hashing with bcrypt
- Error handling and validation

### Database (MongoDB)
- User collection: stores user credentials and profile information
- Post collection: stores user posts with references to authors
- Comment collection: stores comments with references to posts and users

## API Documentation

### Authentication Endpoints
- `POST /api/users/signup` - Register new user
- `POST /api/users/login` - Authenticate user and return JWT
- `POST /api/users/verify-email` - Verify email for password updates
- `PUT /api/users/password` - Update user password

### Post Endpoints
- `GET /api/posts` - Retrieve all posts
- `POST /api/posts` - Create a new post

### Comment Endpoints
- `GET /api/posts/:postId/comments` - Get all comments for a post
- `POST /api/posts/:postId/comments` - Add a comment to a post
- `PUT /api/comments/:commentId` - Update a comment
- `DELETE /api/comments/:commentId` - Delete a comment

## Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Protected routes requiring authentication
- Password complexity requirements

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone https://github.com/username/cloud_web_app.git
cd cloud_web_app
```
2. Install dependencies
```bash

cd web_app
npm install
```

```bash
cd client
npm install
```

3. Environment configuration Create a .env file in the root directory with:
```bash

JWT_SECRET=your_jwt_secret_here
MONGODB_URI=your_mongodb_connection_string
PORT=5000

```

4. Start the application
```bash
npm run server

npm start
```
