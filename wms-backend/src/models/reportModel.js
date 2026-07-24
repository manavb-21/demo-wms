const { poolPromise } = require('../config/db');

const getLowStockReport = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT 
      w.Name AS WarehouseName,
      p.SKU,
      p.Name AS ProductName,
      i.Quantity
    FROM Inventory i
    JOIN Products p ON i.ProductID = p.ProductID
    JOIN Warehouses w ON i.WarehouseID = w.WarehouseID
    WHERE i.Quantity < 500
    ORDER BY i.Quantity ASC
  `);
  return result.recordset;
};

const getInventoryValueReport = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT 
      w.Name AS WarehouseName,
      SUM(i.Quantity * p.UnitPrice) AS TotalValue
    FROM Inventory i
    JOIN Products p ON i.ProductID = p.ProductID
    JOIN Warehouses w ON i.WarehouseID = w.WarehouseID
    GROUP BY w.Name
    ORDER BY TotalValue DESC
  `);
  return result.recordset;
};

module.exports = { getLowStockReport, getInventoryValueReport };