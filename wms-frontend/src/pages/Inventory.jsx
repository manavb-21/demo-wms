import { useState, useEffect } from 'react';
import api from '../services/api';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const response = await api.get('/inventory');
        setInventory(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load inventory levels.');
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Stock Inventory Overview</h1>

      {loading ? (
        <p>Loading inventory...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <thead>
            <tr style={{ background: 'var(--primary-color)', color: '#fff', textAlign: 'left' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Warehouse</th>
              <th style={thStyle}>SKU</th>
              <th style={thStyle}>Product Name</th>
              <th style={thStyle}>Quantity in Stock</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.InventoryID} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={tdStyle}>{item.InventoryID}</td>
                <td style={tdStyle}><strong>{item.WarehouseName}</strong></td>
                <td style={tdStyle}>{item.SKU}</td>
                <td style={tdStyle}>{item.ProductName}</td>
                <td style={tdStyle}>
                  <span style={{ padding: '4px 8px', background: item.Quantity < 200 ? '#fee2e2' : '#dcfce7', color: item.Quantity < 200 ? '#991b1b' : '#166534', borderRadius: '4px', fontWeight: 'bold' }}>
                    {item.Quantity.toLocaleString()} units
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = { padding: '12px 15px' };
const tdStyle = { padding: '12px 15px' };

export default Inventory;