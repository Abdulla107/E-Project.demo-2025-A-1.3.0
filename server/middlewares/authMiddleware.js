const jwt = require('jsonwebtoken');

module.exports.authMiddleware = (req, res, next) => {
  const { accessToken } = req.cookies;


  if (!accessToken) {
    return res.status(401).json({ error: 'Please login first' });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.SECRET);
    
    req.role = decoded.role;
    req.id = decoded.id;

    next(); // proceed to next middleware or route
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token. Please login again.' });
  }
};
