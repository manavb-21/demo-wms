const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { ROLES } = require('../controllers/authController');

router.get('/', verifyToken, productController.getProducts);
router.get('/:id', verifyToken, productController.getProduct);
router.post('/', verifyToken, requireRole(ROLES.SUPER_ADMIN, 'ADMIN'), productController.createProduct);
router.put('/:id', verifyToken, requireRole(ROLES.SUPER_ADMIN, 'ADMIN'), productController.updateProduct);
router.delete('/:id', verifyToken, requireRole(ROLES.SUPER_ADMIN, 'ADMIN'), productController.deleteProduct);

module.exports = router;
