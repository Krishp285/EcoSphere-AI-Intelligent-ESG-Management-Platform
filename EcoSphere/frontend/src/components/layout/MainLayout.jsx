import React from 'react';
import { Outlet } from 'react-router-dom';

const Navbar = () => (
  <header className="bg-surface shadow-sm h-16 flex items-center px-6 justify-between">
    <div className="font-bold text-xl text-primary">EcoSphere AI</div>
    <div className="flex items-center space-x-4">
      {/* NotificationBell & UserProfile placeholders */}
      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
    </div>
  </header>
);

const Sidebar = () => (
  <aside className="w-64 bg-surface border-r border-gray-200 h-full flex flex-col">
    <nav className="flex-1 p-4 space-y-2">
      <a href="/" className="block p-2 rounded hover:bg-gray-100">Dashboard</a>
      <a href="/environmental" className="block p-2 rounded hover:bg-gray-100">Environmental</a>
      <a href="/social" className="block p-2 rounded hover:bg-gray-100">Social</a>
      <a href="/governance" className="block p-2 rounded hover:bg-gray-100">Governance</a>
      <a href="/reports" className="block p-2 rounded hover:bg-gray-100">Reports</a>
      <a href="/trust-center" className="block p-2 rounded hover:bg-gray-100">Trust Center</a>
    </nav>
  </aside>
);

const Footer = () => (
  <footer className="bg-surface text-center p-4 text-sm text-gray-500 border-t border-gray-200">
    &copy; 2026 EcoSphere AI. All rights reserved.
  </footer>
);

export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
