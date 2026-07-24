const dashboardModel = require('../models/dashboardModel');

const getMetrics = async (req, res, next) => {
  try {
    const metrics = await dashboardModel.getDashboardMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMetrics };