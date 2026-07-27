const { poolPromise, sql } = require('../config/db');

const getAllUsers = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT UserID, Username, Role, DisplayName, IsActive, CreatedAt
    FROM Users
    WHERE LOWER(Username) NOT IN ('superadmin', 'demo')
    ORDER BY CreatedAt DESC, UserID DESC
  `);
  return result.recordset;
};

const createUser = async (userData) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('username', sql.NVarChar(100), userData.username)
    .input('password', sql.NVarChar(255), userData.password)
    .input('role', sql.NVarChar(50), userData.role || 'ADMIN')
    .input('displayName', sql.NVarChar(150), userData.displayName)
    .query(`
      INSERT INTO Users (Username, Password, Role, DisplayName, IsActive)
      OUTPUT inserted.UserID, inserted.Username, inserted.Role, inserted.DisplayName, inserted.IsActive, inserted.CreatedAt
      VALUES (@username, @password, @role, @displayName, 1)
    `);
  return result.recordset[0];
};

const updateUserRole = async (userId, role) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('userId', sql.Int, userId)
    .input('role', sql.NVarChar(50), role)
    .query(`
      UPDATE Users
      SET Role = @role
      OUTPUT inserted.UserID, inserted.Username, inserted.Role, inserted.DisplayName, inserted.IsActive, inserted.CreatedAt
      WHERE UserID = @userId
    `);
  return result.recordset[0];
};

const toggleUserStatus = async (userId, isActive) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('userId', sql.Int, userId)
    .input('isActive', sql.Bit, isActive)
    .query(`
      UPDATE Users
      SET IsActive = @isActive
      OUTPUT inserted.UserID, inserted.Username, inserted.Role, inserted.DisplayName, inserted.IsActive, inserted.CreatedAt
      WHERE UserID = @userId
    `);
  return result.recordset[0];
};

const deleteUser = async (userId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('userId', sql.Int, userId)
    .query('DELETE FROM Users WHERE UserID = @userId');
  return result.rowsAffected[0];
};

module.exports = {
  getAllUsers,
  createUser,
  updateUserRole,
  toggleUserStatus,
  deleteUser
};
