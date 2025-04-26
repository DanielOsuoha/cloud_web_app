import jwt from 'jsonwebtoken';

const JWT_SECRET = 'x7RTp9JqK5vM3nL8';  // Move to environment variables later

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  console.log('Auth middleware received:', {
    fullHeader: token,
    type: typeof token
  });

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const tokenStr = token.replace('Bearer ', '').trim();
    console.log('Cleaned token:', tokenStr, '  JWT: ', JWT_SECRET);

    const decoded = jwt.verify(tokenStr, JWT_SECRET);
    console.log('Token verified for user:', decoded.username);

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', {
      error: error.message,
      token: token.substring(0, 20) + '...'
    });
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default auth;