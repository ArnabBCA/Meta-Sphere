const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    /*try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        if (!token) {
            throw new Error('No token!');
        }
        const decodedToken = jwt.verify(token, 'secret');
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Authentication failed' });
    }*/
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'secret', (err, decoded) => {
        if(err) return res.sendStatus(403);
        req.email = decoded.email;
        next();
    });
};
