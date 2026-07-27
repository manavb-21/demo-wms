const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { ROLES } = require('../controllers/authController');

router.post('/', verifyToken, requireRole(ROLES.SUPER_ADMIN), transactionController.logTransaction);
router.get('/', verifyToken, transactionController.getTransactions);

module.exports = router;
