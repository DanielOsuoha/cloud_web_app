import jwt from 'jsonwebtoken';

const JWT_SECRET = 'x7RTp9JqK5vM3nL8';  

const auth = (req, res, next) => {
  
  // console.log('🔒 Auth Check:', {
  //   path: req.path,
  //   method: req.method,
  //   headers: req.headers
  // });

  const token = req.headers.authorization;
  
  // console.log('Auth middleware check:', {
  //   hasToken: !!token,
  //   tokenStart: token?.substring(0, 20),
  //   path: req.path
  // });

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const tokenStr = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(tokenStr, JWT_SECRET);
    req.user = decoded;
    console.log('Token verified for:', decoded.username);
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default auth;