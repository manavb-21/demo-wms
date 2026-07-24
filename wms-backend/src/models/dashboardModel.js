const { poolPromise } = require('../config/db');

const getDashboardMetrics = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT 
      (SELECT COUNT(*) FROM Products) AS totalProducts,
      (SELECT COUNT(*) FROM Warehouses) AS totalWarehouses,
      (SELECT ISNULL(SUM(Quantity), 0) FROM Inventory) AS totalStock,
      (SELECT COUNT(*) FROM InventoryTransactions WHERE TransactionDate >= DATEADD(day, -30, GETDATE())) AS monthlyTransactions
  `);
  return result.recordset[0];
};

module.exports = { getDashboardMetrics };