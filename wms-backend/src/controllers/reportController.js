const reportModel = require('../models/reportModel');

const getReports = async (req, res, next) => {
  try {
    const lowStock = await reportModel.getLowStockReport();
    const inventoryValue = await reportModel.getInventoryValueReport();
    
    res.json({ 
      success: true, 
      data: { lowStock, inventoryValue } 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReports };