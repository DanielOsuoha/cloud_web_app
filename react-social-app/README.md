# react-social-app

This is a bare-bones React social media site where users can make text posts that are visible to everyone, but require login to post.

## Features

- User authentication (login and registration)
- Create, view, and list posts
- Responsive layout

## Project Structure

```
react-social-app
├── src
│   ├── components
│   │   ├── Auth
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── Posts
│   │   │   ├── PostList.tsx
│   │   │   ├── PostItem.tsx
│   │   │   └── CreatePost.tsx
│   │   └── Layout
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── contexts
│   │   └── AuthContext.tsx
│   ├── services
│   │   ├── auth.ts
│   │   └── posts.ts
│   ├── types
│   │   └── index.ts
│   ├── App.tsx
│   └── index.tsx
├── public
│   └── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd react-social-app
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

To start the development server, run:
```
npm start
```

Visit `http://localhost:3000` in your browser to view the application.

## License

This project is licensed under the MIT License.