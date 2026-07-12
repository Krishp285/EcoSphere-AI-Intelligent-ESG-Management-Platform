import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-gray-200 py-4 px-6 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} EcoSphere AI. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary-600 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
