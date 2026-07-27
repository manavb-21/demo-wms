const jwt = require('jsonwebtoken');

const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  DEMO_USER: 'DEMO_USER'
};

const prototypeUsers = [
  { id: 1, username: 'superadmin', password: 'admin123', role: ROLES.SUPER_ADMIN, displayName: 'Super Admin' },
  { id: 2, username: 'manager1', password: 'admin123', role: ROLES.SUPER_ADMIN, displayName: 'Manager 1' },
  { id: 3, username: 'manager2', password: 'admin123', role: ROLES.SUPER_ADMIN, displayName: 'Manager 2' },
  { id: 4, username: 'manager3', password: 'admin123', role: ROLES.SUPER_ADMIN, displayName: 'Manager 3' },
  { id: 5, username: 'demo', password: 'demo123', role: ROLES.DEMO_USER, displayName: 'Demo User' }
];

const findUserByCredentials = async (username, password) => {
  return prototypeUsers.find(
    (user) => user.username.toLowerCase() === String(username).toLowerCase() && user.password === password
  );
};

const buildAuthUser = (user) => ({
  id: user.id,
  username: user.username,
  role: user.role,
  displayName: user.displayName
});

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const user = await findUserByCredentials(username, password);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const authUser = buildAuthUser(user);
    const token = jwt.sign(authUser, process.env.JWT_SECRET || 'wms-demo-jwt-secret-change-me', {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h'
    });

    res.json({
      success: true,
      data: {
        token,
        user: authUser
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, findUserByCredentials, ROLES };
