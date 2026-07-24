const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/', transactionController.logTransaction);
router.get('/', transactionController.getTransactions);

module.exports = router;