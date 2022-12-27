const jwt = require('jsonwebtoken');

const authMiddleware = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).send('Authentication invalid');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // attach the user to the job routes
        req.user = { userId: payload.userId, name: payload.name }
        next();
      } catch (error) {
        res.status(401).send('Invalid token')
      }
}

module.exports = authMiddleware;