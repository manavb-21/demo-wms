import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Products from './pages/Products';
import Warehouses from './pages/Warehouses';
import Inventory from './pages/Inventory';
import Transactions from './pages/Transactions';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="warehouses" element={<Warehouses />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
