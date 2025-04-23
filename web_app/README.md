# Cloud Web Application

A full-stack web application built with React, Node.js, and MongoDB Atlas, featuring user authentication and real-time posts/comments functionality.

## Technologies Used

- **Frontend**: React + Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Cloud Deployment**: AWS EC2

## Features

- User authentication (signup, login, password reset)
- Create and view posts
- Comment on posts
- Real-time updates
- Secure password management
- Cloud-based database

## Getting Started

### Prerequisites

- Node.js (v20.0.0 or higher)
- npm (v10.0.0 or higher)
- MongoDB Atlas account
- AWS account (for deployment)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cloud_web_app.git
cd web_app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development server:
```bash
npm run dev
```

### Production Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to AWS EC2:
- Set up EC2 instance
- Configure Nginx
- Set up PM2 for process management
- Configure MongoDB Atlas access

## API Endpoints

### Authentication
- `POST /api/users/signup` - Register new user
- `POST /api/users/login` - User login
- `POST /api/users/forgot-password` - Password reset

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `POST /api/posts/:postId/comments` - Add comment to post

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React + Vite template
- MongoDB Atlas documentation
- AWS EC2 documentation
