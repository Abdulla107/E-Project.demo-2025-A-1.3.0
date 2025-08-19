const jwt = require('jsonwebtoken');

module.exports.adminMiddleware = (req, res, next) => {
    const { accessToken } = req.cookies;

    if (!accessToken) {
        return res.status(401).json({ error: 'Please login first' });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.SECRET);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }

        req.role = decoded.role;
        req.id = decoded.id;

        next(); // proceed to next middleware or route
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token. Please login again.' });
    }
};
