import React from 'react';

export const Progress = ({ value = 0, max = 100, color = 'bg-primary-500', size = 'md', className = '' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const sizeClass = sizes[size] || sizes.md;

  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClass} ${className}`}>
      <div 
        className={`${color} h-full rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default Progress;
