import { useState, useEffect } from 'react';
import api from '../services/api';

const Reports = () => {
  const [reports, setReports] = useState({ lowStock: [], inventoryValue: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports');
        setReports(response.data.data);
      } catch (err) {
        setError('Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>System Reports</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Low Stock Report Table */}
        <div>
          <h3 style={{ marginBottom: '10px', color: '#991b1b' }}>Low Stock Alerts (Under 500 units)</h3>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: '#fee2e2', color: '#991b1b', textAlign: 'left' }}>
                <th style={thStyle}>Warehouse</th>
                <th style={thStyle}>SKU</th>
                <th style={thStyle}>Product Name</th>
                <th style={thStyle}>Current Qty</th>
              </tr>
            </thead>
            <tbody>
              {reports.lowStock.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={tdStyle}>{item.WarehouseName}</td>
                  <td style={tdStyle}>{item.SKU}</td>
                  <td style={tdStyle}>{item.ProductName}</td>
                  <td style={tdStyle}><strong>{item.Quantity}</strong></td>
                </tr>
              ))}
              {reports.lowStock.length === 0 && (
                <tr><td colSpan="4" style={tdStyle}>No low stock items!</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Inventory Value Report Table */}
        <div>
          <h3 style={{ marginBottom: '10px', color: '#166534' }}>Inventory Valuation by Location</h3>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: '#dcfce7', color: '#166534', textAlign: 'left' }}>
                <th style={thStyle}>Warehouse Location</th>
                <th style={thStyle}>Total Asset Value (₹)</th>
              </tr>
            </thead>
            <tbody>
              {reports.inventoryValue.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={tdStyle}>{item.WarehouseName}</td>
                  <td style={tdStyle}>₹{item.TotalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const tableStyle = { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' };
const thStyle = { padding: '12px 15px' };
const tdStyle = { padding: '12px 15px' };

export default Reports;