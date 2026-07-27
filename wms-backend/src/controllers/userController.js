const userModel = require('../models/userModel');

const editableRoles = ['ADMIN', 'DEMO_USER'];

const getUsers = async (req, res, next) => {
  try {
    const users = await userModel.getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { username, password, displayName, role } = req.body;

    if (!username || !password || !displayName) {
      return res.status(400).json({ success: false, message: 'Username, password, and display name are required' });
    }

    const nextRole = role || 'ADMIN';

    if (!editableRoles.includes(nextRole)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await userModel.createUser({ username, password, displayName, role: nextRole });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!editableRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await userModel.updateUserRole(req.params.id, role);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive must be a boolean' });
    }

    const user = await userModel.toggleUserStatus(req.params.id, isActive);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const deletedCount = await userModel.deleteUser(req.params.id);

    if (!deletedCount) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUserRole,
  toggleUserStatus,
  deleteUser
};
