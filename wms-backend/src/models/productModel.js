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
      WHERE ProductID = @id
    `);
  return result.rowsAffected;
};

const deleteProduct = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM Products WHERE ProductID = @id');
  return result.rowsAffected;
};

const getProductById = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM Products WHERE ProductID = @id');
  return result.recordset[0];
};

// ... your other model functions (create, update, delete, etc.)

module.exports = { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
};