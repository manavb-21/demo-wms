import { useState, useEffect } from 'react';
import api from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    categoryId: 1,
    unitPrice: ''
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load products. Ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.value]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        ...formData,
        categoryId: parseInt(formData.categoryId, 10),
        unitPrice: parseFloat(formData.unitPrice)
      });
      setFormData({ sku: '', name: '', categoryId: 1, unitPrice: '' });
      fetchProducts();
    } catch (err) {
      alert('Error creating product. Make sure SKU is unique.');
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Products Management</h1>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
        <h3>Add New Product</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
          <input
            type="text"
            name="sku"
            placeholder="SKU (e.g. ELEC-003)"
            value={formData.sku}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="number"
            name="unitPrice"
            placeholder="Unit Price ($)"
            step="0.01"
            value={formData.unitPrice}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Add Product</button>
        </form>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <thead>
            <tr style={{ background: 'var(--primary-color)', color: '#fff', textAlign: 'left' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>SKU</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Category ID</th>
              <th style={thStyle}>Unit Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.ProductID} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={tdStyle}>{p.ProductID}</td>
                <td style={tdStyle}><strong>{p.SKU}</strong></td>
                <td style={tdStyle}>{p.Name}</td>
                <td style={tdStyle}>{p.CategoryID}</td>
                <td style={tdStyle}>${parseFloat(p.UnitPrice).toFixed(2)}</td>
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
  minWidth: '150px'
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

export default Products;