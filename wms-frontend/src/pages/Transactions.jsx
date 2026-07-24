import { useState, useEffect } from 'react';
import api from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    productId: '',
    warehouseId: '',
    type: 'IN',
    quantity: '',
    reference: ''
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions');
      setTransactions(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', {
        ...formData,
        productId: parseInt(formData.productId, 10),
        warehouseId: parseInt(formData.warehouseId, 10),
        quantity: parseInt(formData.quantity, 10)
      });
      setFormData({ productId: '', warehouseId: '', type: 'IN', quantity: '', reference: '' });
      fetchTransactions();
      alert('Transaction logged successfully! Check the Inventory tab to see updated stock.');
    } catch (err) {
      alert('Error logging transaction. Ensure Product ID and Warehouse ID are valid.');
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Stock Movements</h1>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
        <h3>Log New Transaction</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
          <input
            type="number"
            name="productId"
            placeholder="Product ID"
            value={formData.productId}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="number"
            name="warehouseId"
            placeholder="Warehouse ID"
            value={formData.warehouseId}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
            <option value="IN">IN (Receive Stock)</option>
            <option value="OUT">OUT (Ship Stock)</option>
            <option value="ADJUSTMENT">ADJUSTMENT (Audit)</option>
          </select>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
            style={inputStyle}
          />
          <input
            type="text"
            name="reference"
            placeholder="Reference (e.g., PO-1023)"
            value={formData.reference}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Submit</button>
        </form>
      </div>

      {loading ? (
        <p>Loading transaction history...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <thead>
            <tr style={{ background: 'var(--primary-color)', color: '#fff', textAlign: 'left' }}>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Warehouse</th>
              <th style={thStyle}>Qty</th>
              <th style={thStyle}>Reference</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.TransactionID} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={tdStyle}>{new Date(t.TransactionDate).toLocaleString()}</td>
                <td style={tdStyle}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontWeight: 'bold',
                    background: t.TransactionType === 'IN' ? '#dcfce7' : t.TransactionType === 'OUT' ? '#fee2e2' : '#fef08a',
                    color: t.TransactionType === 'IN' ? '#166534' : t.TransactionType === 'OUT' ? '#991b1b' : '#854d0e'
                  }}>
                    {t.TransactionType}
                  </span>
                </td>
                <td style={tdStyle}>{t.ProductName} ({t.SKU})</td>
                <td style={tdStyle}>{t.WarehouseName}</td>
                <td style={tdStyle}>{t.Quantity}</td>
                <td style={tdStyle}>{t.Reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const inputStyle = {
  padding: '8px 12px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  flex: '1',
  minWidth: '130px'
};

const buttonStyle = {
  padding: '8px 16px',
  backgroundColor: 'var(--secondary-color)',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const thStyle = { padding: '12px 15px' };
const tdStyle = { padding: '12px 15px' };

export default Transactions;