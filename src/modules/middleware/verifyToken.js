const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next(); 
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = verifyToken;