import React from 'react';

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-800 ring-1 ring-primary-200',
    success: 'bg-green-100 text-green-800 ring-1 ring-green-200',
    warning: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200',
    danger: 'bg-red-100 text-red-800 ring-1 ring-red-200',
    gray: 'bg-gray-100 text-gray-800 ring-1 ring-gray-200',
  };

  const variantClass = variants[variant] || variants.primary;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${variantClass} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
