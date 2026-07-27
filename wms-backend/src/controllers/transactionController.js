const transactionModel = require('../models/transactionModel');

const logTransaction = async (req, res, next) => {
  try {
    const { type, quantity } = req.body;

    if (quantity <= 0 && type !== 'ADJUSTMENT') {
      return res.status(400).json({ success: false, message: 'Quantity must be greater than zero for IN and OUT transactions' });
    }

    const result = await transactionModel.createTransaction(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const history = await transactionModel.getRecentTransactions();
    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

module.exports = { logTransaction, getTransactions };