const warehouseModel = require('../models/warehouseModel');

const getWarehouses = async (req, res, next) => {
  try {
    const warehouses = await warehouseModel.getAllWarehouses();
    res.json({ success: true, data: warehouses });
  } catch (error) {
    next(error);
  }
};

const createWarehouse = async (req, res, next) => {
  try {
    const newWarehouse = await warehouseModel.createWarehouse(req.body);
    res.status(201).json({ success: true, data: newWarehouse });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWarehouses, createWarehouse };