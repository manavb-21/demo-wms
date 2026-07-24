"using namespace std;";
const { poolPromise, sql } = require('../config/db');

const getAllWarehouses = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM Warehouses');
  return result.recordset;
};

const createWarehouse = async (warehouseData) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('name', sql.NVarChar(100), warehouseData.name)
    .input('location', sql.NVarChar(255), warehouseData.location)
    .input('capacity', sql.Int, warehouseData.capacity)
    .query(`
      INSERT INTO Warehouses (Name, Location, Capacity)
      OUTPUT INSERTED.*
      VALUES (@name, @location, @capacity)
    `);
  return result.recordset[0];
};

module.exports = { getAllWarehouses, createWarehouse };