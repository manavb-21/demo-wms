import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ShieldCheck, Trash2, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/api';

const UserManagement = () => {
  const { isSuperAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    displayName: ''
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getUsers();
      setUsers(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
    }
  }, [isSuperAdmin]);

  if (!isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await userApi.createUser({ ...formData, role: 'ADMIN' });
      setFormData({ username: '', password: '', displayName: '' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating user.');
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      const response = await userApi.updateUserRole(userId, role);
      setUsers(users.map((user) => user.UserID === userId ? response.data.data : user));
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating role.');
    }
  };

  const handleStatusToggle = async (user) => {
    try {
      const response = await userApi.toggleUserStatus(user.UserID, !user.IsActive);
      setUsers(users.map((item) => item.UserID === user.UserID ? response.data.data : item));
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating status.');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user permanently?')) return;

    try {
      await userApi.deleteUser(userId);
      setUsers(users.filter((user) => user.UserID !== userId));
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting user.');
    }
  };

  return (
    <div>
      <div style={pageHeaderStyle}>
        <div>
          <h1 style={{ margin: 0 }}>User Management</h1>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)' }}>Database-backed administrator accounts</p>
        </div>
        <span style={adminBadgeStyle}>
          <ShieldCheck size={16} />
          SUPER_ADMIN
        </span>
      </div>

      <div style={formPanelStyle}>
        <h3>Add New Administrator</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="displayName"
            placeholder="Display Name"
            value={formData.displayName}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <button type="submit" disabled={saving} style={{ ...buttonStyle, opacity: saving ? 0.7 : 1 }}>
            <UserPlus size={16} />
            {saving ? 'Creating...' : 'Add User'}
          </button>
        </form>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: 'var(--primary-color)', color: '#fff', textAlign: 'left' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Username</th>
              <th style={thStyle}>Display Name</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Created</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.UserID} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={tdStyle}>{user.UserID}</td>
                <td style={tdStyle}><strong>{user.Username}</strong></td>
                <td style={tdStyle}>{user.DisplayName}</td>
                <td style={tdStyle}>
                  <select
                    value={user.Role}
                    onChange={(e) => handleRoleChange(user.UserID, e.target.value)}
                    style={selectStyle}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="DEMO_USER">DEMO_USER</option>
                  </select>
                </td>
                <td style={tdStyle}>
                  <button
                    type="button"
                    onClick={() => handleStatusToggle(user)}
                    style={user.IsActive ? activeButtonStyle : inactiveButtonStyle}
                  >
                    {user.IsActive ? 'Active' : 'Disabled'}
                  </button>
                </td>
                <td style={tdStyle}>{user.CreatedAt ? new Date(user.CreatedAt).toLocaleDateString() : '-'}</td>
                <td style={tdStyle}>
                  <button type="button" onClick={() => handleDelete(user.UserID)} style={deleteButtonStyle} title="Delete user">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="7" style={tdStyle}>No database users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

const pageHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '20px'
};

const adminBadgeStyle = {
  padding: '6px 10px',
  background: '#dbeafe',
  color: '#1e40af',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.8rem',
  fontWeight: 'bold'
};

const formPanelStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '20px',
  border: '1px solid var(--border-color)'
};

const inputStyle = {
  padding: '8px 12px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  flex: '1',
  minWidth: '160px'
};

const buttonStyle = {
  padding: '8px 16px',
  backgroundColor: 'var(--secondary-color)',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const errorStyle = {
  padding: '12px 15px',
  background: '#fee2e2',
  color: '#991b1b',
  borderRadius: '4px',
  marginBottom: '20px',
  fontWeight: 'bold'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#fff',
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid var(--border-color)'
};

const selectStyle = {
  padding: '7px 10px',
  borderRadius: '4px',
  border: '1px solid #cbd5e1',
  background: '#fff'
};

const activeButtonStyle = {
  padding: '6px 10px',
  background: '#dcfce7',
  color: '#166534',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const inactiveButtonStyle = {
  ...activeButtonStyle,
  background: '#fee2e2',
  color: '#991b1b'
};

const deleteButtonStyle = {
  padding: '6px 8px',
  backgroundColor: '#ef4444',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center'
};

const thStyle = { padding: '12px 15px' };
const tdStyle = { padding: '12px 15px' };

export default UserManagement;
