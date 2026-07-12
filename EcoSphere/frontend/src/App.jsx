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

// ESG Module Pages
import Social from './pages/Social';
import Governance from './pages/Governance';
import Gamification from './pages/Gamification';
import Reports from './pages/Reports';
import TrustCenter from './pages/TrustCenter';
import AICopilot from './pages/AICopilot';
import Settings from './pages/Settings';

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

          {/* Core ESG Modules */}
          <Route path="social" element={<Social />} />
          <Route path="governance" element={<Governance />} />
          <Route path="gamification" element={<Gamification />} />
          <Route path="reports" element={<Reports />} />
          <Route path="trust-center" element={<TrustCenter />} />
          <Route path="ai-copilot" element={<AICopilot />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
