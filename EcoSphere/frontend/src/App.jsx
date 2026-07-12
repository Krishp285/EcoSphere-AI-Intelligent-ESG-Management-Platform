import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Placeholder Page Components
const Dashboard = () => <div><h1 className="text-2xl font-bold mb-4">Dashboard</h1><p>Welcome to EcoSphere AI.</p></div>;
const Environmental = () => <div><h1 className="text-2xl font-bold mb-4">Environmental</h1></div>;
const Social = () => <div><h1 className="text-2xl font-bold mb-4">Social</h1></div>;
const Governance = () => <div><h1 className="text-2xl font-bold mb-4">Governance</h1></div>;
const Reports = () => <div><h1 className="text-2xl font-bold mb-4">Reports</h1></div>;
const TrustCenter = () => <div><h1 className="text-2xl font-bold mb-4">Trust Center</h1></div>;
const NotFound = () => <div><h1 className="text-2xl font-bold mb-4">404 - Not Found</h1></div>;
const Login = () => <div className="flex h-screen items-center justify-center bg-gray-50"><div className="p-8 bg-white shadow rounded">Login Page Placeholder</div></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="environmental" element={<Environmental />} />
          <Route path="social" element={<Social />} />
          <Route path="governance" element={<Governance />} />
          <Route path="reports" element={<Reports />} />
          <Route path="trust-center" element={<TrustCenter />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
