import React from 'react';

export const PageHeader = ({ title, description, actions, className = '' }) => {
  return (
    <div className={`mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {actions && (
        <div className="mt-4 flex space-x-3 sm:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
