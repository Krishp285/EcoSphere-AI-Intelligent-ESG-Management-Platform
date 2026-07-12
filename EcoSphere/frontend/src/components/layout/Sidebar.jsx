import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TreePine, 
  Users, 
  Scale, 
  Trophy, 
  FileBarChart, 
  ShieldCheck, 
  Bot, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Environmental', path: '/environmental', icon: TreePine },
  { name: 'Social', path: '/social', icon: Users },
  { name: 'Governance', path: '/governance', icon: Scale },
  { name: 'Gamification', path: '/gamification', icon: Trophy },
  { name: 'Reports', path: '/reports', icon: FileBarChart },
  { name: 'Trust Center', path: '/trust-center', icon: ShieldCheck },
  { name: 'AI Copilot', path: '/ai-copilot', icon: Bot },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const { isOpen, closeSidebar } = useSidebar();
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900/50 transition-opacity md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar component */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-surface border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 md:hidden">
          <span className="font-bold text-xl text-primary-600">EcoSphere</span>
          <button onClick={closeSidebar} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                        isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`} 
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={logout}
            className="group flex w-full items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
