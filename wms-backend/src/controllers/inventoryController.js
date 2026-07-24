const inventoryModel = require('../models/inventoryModel');

const getInventory = async (req, res, next) => {
  try {
    const inventory = await inventoryModel.getInventory();
    res.json({ success: true, data: inventory });
  } catch (error) {
    next(error);
  }
};

module.exports = { getInventory };