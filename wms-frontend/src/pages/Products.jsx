import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const { isDemoUser, canEdit } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
      setError('Failed to load products.');
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
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (product) => {
    if (!canEdit) return;

    setEditingId(product.ProductID);
    setFormData({
      sku: product.SKU,
      name: product.Name,
      categoryId: product.CategoryID,
      unitPrice: product.UnitPrice
    });
  };

  const handleDelete = async (id) => {
    if (!canEdit) return;

    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert('Error deleting product.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canEdit) return;

    try {
      const payload = {
        ...formData,
        categoryId: parseInt(formData.categoryId, 10),
        unitPrice: parseFloat(formData.unitPrice)
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setEditingId(null);
      } else {
        await api.post('/products', payload);
      }
      
      setFormData({ sku: '', name: '', categoryId: 1, unitPrice: '' });
      fetchProducts();
    } catch (err) {
      alert('Error saving product.');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ sku: '', name: '', categoryId: 1, unitPrice: '' });
  };

  const filteredProducts = products
    .filter(p => 
      p.Name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.SKU.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.SKU.localeCompare(b.SKU));

  return (
    <div>
      <div style={pageTitleStyle}>
        <h1 style={{ margin: 0 }}>Products Management</h1>
        {isDemoUser && <span style={readOnlyBadgeStyle}>Read Only</span>}
      </div>

      {canEdit ? (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
          <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
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
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value={1}>1 - Electronics</option>
              <option value={2}>2 - Office Supplies</option>
              <option value={3}>3 - Packaging</option>
            </select>
            <input
              type="number"
              name="unitPrice"
              placeholder="Unit Price (INR)"
              step="0.01"
              value={formData.unitPrice}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} style={cancelButtonStyle}>
                Cancel
              </button>
            )}
          </form>
        </div>
      ) : (
        <div style={readOnlyPanelStyle}>Product add, edit, and delete actions are disabled for this account.</div>
      )}

      <input
        type="text"
        placeholder="Search products by SKU or Name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ ...inputStyle, marginBottom: '20px', width: '100%', padding: '12px' }}
      />

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
              {canEdit && <th style={thStyle}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.ProductID} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={tdStyle}>{p.ProductID}</td>
                <td style={tdStyle}><strong>{p.SKU}</strong></td>
                <td style={tdStyle}>{p.Name}</td>
                <td style={tdStyle}>{p.CategoryID}</td>
                <td style={tdStyle}>INR {parseFloat(p.UnitPrice).toFixed(2)}</td>
                {canEdit && (
                  <td style={tdStyle}>
                    <button onClick={() => handleEdit(p)} style={editButtonStyle}>Edit</button>
                    <button onClick={() => handleDelete(p.ProductID)} style={deleteButtonStyle}>Delete</button>
                  </td>
                )}
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

const cancelButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#64748b'
};

const editButtonStyle = {
  padding: '4px 8px',
  backgroundColor: '#f59e0b',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginRight: '8px'
};

const deleteButtonStyle = {
  padding: '4px 8px',
  backgroundColor: '#ef4444',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const thStyle = { padding: '12px 15px' };
const tdStyle = { padding: '12px 15px' };

const pageTitleStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '20px'
};

const readOnlyBadgeStyle = {
  padding: '4px 8px',
  background: '#fef3c7',
  color: '#92400e',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: 'bold'
};

const readOnlyPanelStyle = {
  background: '#fff',
  padding: '14px 16px',
  borderRadius: '8px',
  marginBottom: '20px',
  border: '1px solid var(--border-color)',
  color: 'var(--text-secondary)',
  fontWeight: 'bold'
};

export default Products;
