import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Warehouse, ArrowRightLeft, FileBarChart, Activity, LogOut, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MainLayout = () => {
  const { user, isDemoUser, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ 
        width: 'var(--sidebar-width)', 
        backgroundColor: 'var(--primary-color)', 
        color: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '20px', fontSize: '1.25rem', fontWeight: 'bold', borderBottom: '1px solid #1e293b' }}>
          Vinsum WMS
        </div>
        <nav style={{ flex: 1, padding: '20px 0' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavItem to="/products" icon={<Package size={20} />} label="Products" />
            <NavItem to="/warehouses" icon={<Warehouse size={20} />} label="Warehouses" />
            <NavItem to="/inventory" icon={<ArrowRightLeft size={20} />} label="Inventory" />
            <NavItem to="/transactions" icon={<Activity size={20} />} label="Transactions" />
            <NavItem to="/reports" icon={<FileBarChart size={20} />} label="Reports" />
            {isSuperAdmin && <NavItem to="/users" icon={<Users size={20} />} label="Users" />}
          </ul>
        </nav>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ 
          height: '60px', 
          backgroundColor: 'var(--surface-color)', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>System Overview</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isDemoUser && <span style={readOnlyBadgeStyle}>Read Only</span>}
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {user?.displayName || user?.username}
            </div>
            <button onClick={handleLogout} type="button" style={logoutButtonStyle} title="Logout">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <main style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => (
  <li>
    <Link to={to} style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '15px', 
      padding: '10px 20px',
      color: '#cbd5e1',
      transition: 'background 0.2s, color 0.2s'
    }}
    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1e293b'; e.currentTarget.style.color = '#fff'; }}
    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#cbd5e1'; }}
    >
      {icon}
      <span>{label}</span>
    </Link>
  </li>
);

const readOnlyBadgeStyle = {
  padding: '4px 8px',
  background: '#fef3c7',
  color: '#92400e',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: 'bold'
};

const logoutButtonStyle = {
  padding: '7px 10px',
  backgroundColor: '#f8fafc',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-color)',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontWeight: 'bold'
};

export default MainLayout;
