const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { ROLES } = require('../controllers/authController');

router.get('/', verifyToken, warehouseController.getWarehouses);
router.post('/', verifyToken, requireRole(ROLES.SUPER_ADMIN, 'ADMIN'), warehouseController.createWarehouse);

module.exports = router;
