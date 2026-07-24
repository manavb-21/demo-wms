const { poolPromise, sql } = require('../config/db');

const createTransaction = async (transactionData) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // 1. Log the transaction entry
    const request = new sql.Request(transaction);
    await request
      .input('productId', sql.Int, transactionData.productId)
      .input('warehouseId', sql.Int, transactionData.warehouseId)
      .input('type', sql.NVarChar(20), transactionData.type)
      .input('quantity', sql.Int, transactionData.quantity)
      .input('reference', sql.NVarChar(100), transactionData.reference)
      .query(`
        INSERT INTO InventoryTransactions (ProductID, WarehouseID, TransactionType, Quantity, Reference)
        VALUES (@productId, @warehouseId, @type, @quantity, @reference)
      `);

    // 2. Determine quantity modifier (+ for IN, - for OUT)
    let qtyChange = transactionData.quantity;
    if (transactionData.type === 'OUT') {
      qtyChange = -transactionData.quantity;
    }

    // 3. Update or Insert into Inventory table
    const inventoryRequest = new sql.Request(transaction);
    await inventoryRequest
      .input('productId', sql.Int, transactionData.productId)
      .input('warehouseId', sql.Int, transactionData.warehouseId)
      .input('qtyChange', sql.Int, qtyChange)
      .query(`
        MERGE Inventory AS target
        USING (SELECT @warehouseId AS WarehouseID, @productId AS ProductID) AS source
        ON (target.WarehouseID = source.WarehouseID AND target.ProductID = source.ProductID)
        WHEN MATCHED THEN
          UPDATE SET Quantity = target.Quantity + @qtyChange, UpdatedAt = GETDATE()
        WHEN NOT MATCHED THEN
          INSERT (WarehouseID, ProductID, Quantity)
          VALUES (@warehouseId, @productId, @qtyChange);
      `);

    await transaction.commit();
    return { success: true };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

const getRecentTransactions = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT TOP 10 
      t.TransactionID,
      p.SKU,
      p.Name AS ProductName,
      w.Name AS WarehouseName,
      t.TransactionType,
      t.Quantity,
      t.Reference,
      t.TransactionDate
    FROM InventoryTransactions t
    JOIN Products p ON t.ProductID = p.ProductID
    JOIN Warehouses w ON t.WarehouseID = w.WarehouseID
    ORDER BY t.TransactionDate DESC
  `);
  return result.recordset;
};

module.exports = { createTransaction, getRecentTransactions };