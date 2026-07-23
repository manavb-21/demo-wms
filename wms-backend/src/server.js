const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { poolPromise } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT 1 AS status');
    res.json({
      success: true,
      dbStatus: result.recordset[0].status
    });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});