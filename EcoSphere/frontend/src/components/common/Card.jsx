import React from 'react';

export const Card = ({ children, className = '', noPadding = false, ...props }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden ${className}`}
      {...props}
    >
      {!noPadding ? <div className="p-6">{children}</div> : children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex justify-between items-start mb-4 ${className}`}>
    <div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export default Card;
