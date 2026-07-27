import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Warehouses = () => {
  const { isDemoUser, canEdit } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: ''
  });

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/warehouses');
      setWarehouses(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load warehouses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canEdit) return;

    try {
      await api.post('/warehouses', {
        ...formData,
        capacity: parseInt(formData.capacity, 10)
      });
      setFormData({ name: '', location: '', capacity: '' });
      fetchWarehouses();
    } catch (err) {
      alert('Error creating warehouse.');
    }
  };

  return (
    <div>
      <div style={pageTitleStyle}>
        <h1 style={{ margin: 0 }}>Warehouse Locations</h1>
        {isDemoUser && <span style={readOnlyBadgeStyle}>Read Only</span>}
      </div>

      {canEdit ? (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
          <h3>Add New Warehouse</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
            <input
              type="text"
              name="name"
              placeholder="Warehouse Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="text"
              name="location"
              placeholder="Location (City, State)"
              value={formData.location}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="number"
              name="capacity"
              placeholder="Max Capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>Add Warehouse</button>
          </form>
        </div>
      ) : (
        <div style={readOnlyPanelStyle}>Warehouse creation is disabled for this account.</div>
      )}

      {loading ? (
        <p>Loading warehouses...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <thead>
            <tr style={{ background: 'var(--primary-color)', color: '#fff', textAlign: 'left' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Capacity</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((w) => (
              <tr key={w.WarehouseID} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={tdStyle}>{w.WarehouseID}</td>
                <td style={tdStyle}><strong>{w.Name}</strong></td>
                <td style={tdStyle}>{w.Location}</td>
                <td style={tdStyle}>{w.Capacity.toLocaleString()} units</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const inputStyle = { padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', flex: '1', minWidth: '150px' };
const buttonStyle = { padding: '8px 16px', backgroundColor: 'var(--secondary-color)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
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

export default Warehouses;
