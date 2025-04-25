import jwt from 'jsonwebtoken';

const JWT_SECRET = 'x7RTp9JqK5vM3nL8';  // Match the secret from server.js

const auth = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export default auth;