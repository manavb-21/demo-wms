const { poolPromise, sql } = require('../config/db');

const getAllProducts = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM Products');
  return result.recordset;
};

const getProductById = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM Products WHERE ProductID = @id');
  return result.recordset[0];
};

const createProduct = async (productData) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('sku', sql.NVarChar(50), productData.sku)
    .input('name', sql.NVarChar(150), productData.name)
    .input('categoryId', sql.Int, productData.categoryId)
    .input('unitPrice', sql.Decimal(18, 2), productData.unitPrice)
    .query(`
      INSERT INTO Products (SKU, Name, CategoryID, UnitPrice)
      OUTPUT INSERTED.*
      VALUES (@sku, @name, @categoryId, @unitPrice)
    `);
  return result.recordset[0];
};

const updateProduct = async (id, productData) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .input('sku', sql.NVarChar(50), productData.sku)
    .input('name', sql.NVarChar(150), productData.name)
    .input('categoryId', sql.Int, productData.categoryId)
    .input('unitPrice', sql.Decimal(18, 2), productData.unitPrice)
    .query(`
      UPDATE Products
      SET SKU = @sku, Name = @name, CategoryID = @categoryId, UnitPrice = @unitPrice, UpdatedAt = GETDATE()
      OUTPUT INSERTED.*
      WHERE ProductID = @id
    `);
  return result.recordset[0];
};

const deleteProduct = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      DELETE FROM Products
      OUTPUT DELETED.*
      WHERE ProductID = @id
    `);
  return result.recordset[0];
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };