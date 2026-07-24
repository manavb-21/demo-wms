const { poolPromise, sql } = require('../config/db');

const getInventory = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT 
      i.InventoryID,
      w.Name AS WarehouseName,
      p.SKU,
      p.Name AS ProductName,
      i.Quantity,
      i.UpdatedAt
    FROM Inventory i
    JOIN Warehouses w ON i.WarehouseID = w.WarehouseID
    JOIN Products p ON i.ProductID = p.ProductID
  `);
  return result.recordset;
};

module.exports = { getInventory };