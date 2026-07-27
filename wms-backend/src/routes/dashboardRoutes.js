const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/metrics', verifyToken, dashboardController.getMetrics);

module.exports = router;
