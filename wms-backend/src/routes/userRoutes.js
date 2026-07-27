const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { ROLES } = require('../controllers/authController');

router.use(verifyToken, requireRole(ROLES.SUPER_ADMIN));

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.patch('/:id/role', userController.updateUserRole);
router.patch('/:id/status', userController.toggleUserStatus);
router.delete('/:id', userController.deleteUser);

module.exports = router;
