import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Products from './pages/Products';
import Warehouses from './pages/Warehouses';

const Dashboard = () => <div><h1>Dashboard</h1></div>;
const Inventory = () => <div><h1>Inventory Module</h1></div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="warehouses" element={<Warehouses />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="reports" element={<div><h1>Reports Module</h1></div>} />
      </Route>
    </Routes>
  );
}

export default App;