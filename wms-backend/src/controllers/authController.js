const jwt = require('jsonwebtoken');
const { poolPromise, sql } = require('../config/db');

const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  DEMO_USER: 'DEMO_USER'
};

const prototypeUsers = [
  { id: 1, username: 'superadmin', password: 'admin123', role: ROLES.SUPER_ADMIN, displayName: 'Super Admin' },
  { id: 2, username: 'demo', password: 'demo123', role: ROLES.DEMO_USER, displayName: 'Demo User' }
];

const findUserByCredentials = async (username, password) => {
  const prototypeUser = prototypeUsers.find(
    (user) => user.username.toLowerCase() === String(username).toLowerCase() && user.password === password
  );

  if (prototypeUser) {
    return prototypeUser;
  }

  const pool = await poolPromise;
  const result = await pool.request()
    .input('username', sql.NVarChar(100), username)
    .input('password', sql.NVarChar(255), password)
    .query(`
      SELECT TOP 1 UserID, Username, Role, DisplayName
      FROM Users
      WHERE Username = @username AND Password = @password AND IsActive = 1
    `);

  const dbUser = result.recordset[0];

  if (!dbUser) {
    return null;
  }

  return {
    id: dbUser.UserID,
    username: dbUser.Username,
    role: dbUser.Role,
    displayName: dbUser.DisplayName
  };
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
