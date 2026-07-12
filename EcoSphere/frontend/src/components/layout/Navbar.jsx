import React from 'react';
import { Bell, Search, Menu, Leaf } from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';
import { useUser } from '../../context/UserContext';
import { useNotifications } from '../../context/NotificationContext';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

export const Navbar = () => {
  const { toggleSidebar } = useSidebar();
  const { currentOrganization, organizations, setCurrentOrganization } = useUser();
  const { unreadCount } = useNotifications();

  return (
    <header className="bg-surface shadow-sm h-16 flex items-center px-4 md:px-6 justify-between sticky top-0 z-20 border-b border-gray-200">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar} 
          className="mr-4 p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center text-primary-600">
          <Leaf className="h-6 w-6 mr-2" />
          <span className="font-bold text-xl hidden sm:block">EcoSphere AI</span>
        </div>
      </div>

      <div className="flex-1 max-w-lg px-4 hidden md:block">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm transition-colors"
            placeholder="Search resources, policies, reports..."
            type="search"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-5">
        <div className="hidden sm:flex items-center">
          <select 
            className="text-sm border-none bg-transparent font-medium text-gray-700 focus:ring-0 cursor-pointer"
            value={currentOrganization}
            onChange={(e) => setCurrentOrganization(e.target.value)}
          >
            {organizations.map(org => (
              <option key={org} value={org}>{org}</option>
            ))}
          </select>
        </div>

        <div className="hidden sm:block">
          <Badge variant="success" className="font-bold border border-green-200">
            ESG Score: A+
          </Badge>
        </div>

        <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>

        <div className="relative">
          <button className="flex items-center focus:outline-none">
            <Avatar initials="AJ" size="sm" className="ring-2 ring-white shadow-sm" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
