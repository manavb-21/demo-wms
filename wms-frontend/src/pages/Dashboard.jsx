import { useState, useEffect } from 'react';
import { Package, Warehouse, ArrowRightLeft, Activity } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalWarehouses: 0,
    totalStock: 0,
    monthlyTransactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/dashboard/metrics');
        setMetrics(response.data.data);
      } catch (err) {
        setError('Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Dashboard Overview</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <KpiCard 
          title="Total Products" 
          value={loading ? '...' : metrics.totalProducts} 
          icon={<Package size={32} color="var(--primary-color)" />} 
        />
        <KpiCard 
          title="Active Warehouses" 
          value={loading ? '...' : metrics.totalWarehouses} 
          icon={<Warehouse size={32} color="var(--primary-color)" />} 
        />
        <KpiCard 
          title="Total Units in Stock" 
          value={loading ? '...' : metrics.totalStock.toLocaleString()} 
          icon={<ArrowRightLeft size={32} color="var(--primary-color)" />} 
        />
        <KpiCard 
          title="30-Day Transactions" 
          value={loading ? '...' : metrics.monthlyTransactions} 
          icon={<Activity size={32} color="var(--primary-color)" />} 
        />
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, icon }) => (
  <div style={{ 
    background: '#fff', 
    padding: '24px', 
    borderRadius: '8px', 
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  }}>
    <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '50%', display: 'flex' }}>
      {icon}
    </div>
    <div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '5px' }}>
        {title.toUpperCase()}
      </div>
      <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
        {value}
      </div>
    </div>
  </div>
);

export default Dashboard;