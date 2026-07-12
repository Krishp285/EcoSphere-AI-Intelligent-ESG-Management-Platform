import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import PlaceholderPage from './pages/PlaceholderPage';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import EmptyState from './components/common/EmptyState';
import { ShieldAlert } from 'lucide-react';

// Environmental Module
import EnvironmentalLayout from './pages/Environmental/EnvironmentalLayout';
import EnvironmentalDashboard from './pages/Environmental/EnvironmentalDashboard';
import CarbonCalculator from './pages/Environmental/CarbonCalculator';
import CarbonTransactions from './pages/Environmental/CarbonTransactions';
import EmissionFactors from './pages/Environmental/EmissionFactors';
import SustainabilityGoals from './pages/Environmental/SustainabilityGoals';
import DepartmentTracking from './pages/Environmental/DepartmentTracking';
import EnvironmentalReports from './pages/Environmental/EnvironmentalReports';

const NotFound = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <EmptyState icon={ShieldAlert} title="404 - Not Found" description="The page you are looking for does not exist." />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected App Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />

          {/* Environmental Module — nested inside EnvironmentalLayout */}
          <Route path="environmental" element={<EnvironmentalLayout />}>
            <Route index element={<EnvironmentalDashboard />} />
            <Route path="calculator" element={<CarbonCalculator />} />
            <Route path="transactions" element={<CarbonTransactions />} />
            <Route path="emission-factors" element={<EmissionFactors />} />
            <Route path="goals" element={<SustainabilityGoals />} />
            <Route path="departments" element={<DepartmentTracking />} />
            <Route path="reports" element={<EnvironmentalReports />} />
          </Route>

          {/* Other Module Placeholders */}
          <Route path="social" element={<PlaceholderPage title="Social" />} />
          <Route path="governance" element={<PlaceholderPage title="Governance" />} />
          <Route path="gamification" element={<PlaceholderPage title="Gamification" />} />
          <Route path="reports" element={<PlaceholderPage title="Reports" />} />
          <Route path="trust-center" element={<PlaceholderPage title="Trust Center" />} />
          <Route path="ai-copilot" element={<PlaceholderPage title="AI Copilot" />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
