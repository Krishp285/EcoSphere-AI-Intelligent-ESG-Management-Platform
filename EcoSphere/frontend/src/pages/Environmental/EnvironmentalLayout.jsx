import React from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calculator,
  ArrowLeftRight,
  Beaker,
  Flag,
  Building2,
  FileText
} from 'lucide-react';

const tabs = [
  { name: 'Overview', path: '/environmental', icon: LayoutDashboard, end: true },
  { name: 'Carbon Calculator', path: '/environmental/calculator', icon: Calculator, end: false },
  { name: 'Transactions', path: '/environmental/transactions', icon: ArrowLeftRight, end: false },
  { name: 'Emission Factors', path: '/environmental/emission-factors', icon: Beaker, end: false },
  { name: 'Goals', path: '/environmental/goals', icon: Flag, end: false },
  { name: 'Departments', path: '/environmental/departments', icon: Building2, end: false },
  { name: 'Reports', path: '/environmental/reports', icon: FileText, end: false },
];

const EnvironmentalLayout = () => {
  return (
    <div className="space-y-0">
      {/* Module Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Environmental Management</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor, calculate and report your organisation's environmental impact</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-1 overflow-x-auto" aria-label="Environmental Module Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                end={tab.end}
                className={({ isActive }) =>
                  `group inline-flex items-center py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`mr-2 h-4 w-4 ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                    {tab.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Page Content */}
      <Outlet />
    </div>
  );
};

export default EnvironmentalLayout;
