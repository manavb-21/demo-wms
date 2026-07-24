const transactionModel = require('../models/transactionModel');

const logTransaction = async (req, res, next) => {
  try {
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