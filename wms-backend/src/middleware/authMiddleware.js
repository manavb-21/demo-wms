const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication token is required' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'wms-demo-jwt-secret-change-me');
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
  }
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication is required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to perform this action' });
    }

    next();
  };
};

module.exports = { verifyToken, requireRole };
