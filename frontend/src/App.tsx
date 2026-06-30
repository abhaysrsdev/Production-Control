import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import ProductionList from './pages/ProductionList';
import ProductionPlanning from './pages/ProductionPlanning';
import ProcessMapping from './pages/ProcessMapping';
import ProcessQueue from './pages/ProcessQueue';
import KarigarAllocation from './pages/KarigarAllocation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="production" element={<ProductionList />} />
          <Route path="production/:id" element={<ProductionPlanning />} />
          <Route path="process-mapping/:id" element={<ProcessMapping />} />
          <Route path="production/processes/:processName" element={<ProcessQueue />} />
          <Route path="karigar-allocation/:id" element={<KarigarAllocation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
