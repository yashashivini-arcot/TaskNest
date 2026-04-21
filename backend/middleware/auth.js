const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  let token = req.header('x-auth-token');
  const authHeader = req.header('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'change_this_secret_in_production';
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ msg: 'Invalid token. Please log in again.' });
  }
};

const authorize = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];
  return (req, res, next) => {
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access denied: insufficient permissions.' });
    }
    next();
  };
};

module.exports = { auth, authorize };
