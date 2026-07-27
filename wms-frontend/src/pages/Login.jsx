import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LockKeyhole, LogIn, PackageCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.username, formData.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={panelStyle}>
        <div style={brandStyle}>
          <div style={brandIconStyle}>
            <PackageCheck size={30} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--primary-color)' }}>Vinsum WMS</h1>
            <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>Warehouse access portal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label style={labelStyle}>
            Username
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              style={inputStyle}
            />
          </label>

          {error && <div style={errorStyle}>{error}</div>}

          <button type="submit" disabled={loading} style={{ ...buttonStyle, opacity: loading ? 0.75 : 1 }}>
            {loading ? <LockKeyhole size={18} /> : <LogIn size={18} />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={hintStyle}>
          <strong>Prototype users:</strong> superadmin/admin123, manager1/admin123, demo/demo123
        </div>
      </div>
    </div>
  );
};

const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--background-color)',
  padding: '20px'
};

const panelStyle = {
  width: '100%',
  maxWidth: '420px',
  background: '#fff',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  padding: '28px',
  boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12)'
};

const brandStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  marginBottom: '24px'
};

const brandIconStyle = {
  width: '54px',
  height: '54px',
  borderRadius: '8px',
  background: 'var(--primary-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const labelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  fontWeight: 'bold',
  color: 'var(--text-primary)'
};

const inputStyle = {
  padding: '11px 12px',
  borderRadius: '4px',
  border: '1px solid #cbd5e1',
  fontSize: '1rem'
};

const buttonStyle = {
  marginTop: '4px',
  padding: '11px 16px',
  backgroundColor: 'var(--secondary-color)',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px'
};

const errorStyle = {
  padding: '10px 12px',
  background: '#fee2e2',
  color: '#991b1b',
  borderRadius: '4px',
  fontWeight: 'bold'
};

const hintStyle = {
  marginTop: '18px',
  color: 'var(--text-secondary)',
  fontSize: '0.85rem',
  lineHeight: 1.5
};

export default Login;
