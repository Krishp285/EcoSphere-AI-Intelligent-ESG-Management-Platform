import React from 'react';
import { PackageOpen } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({ 
  icon: Icon = PackageOpen, 
  title = 'No Data Available', 
  description = 'There is currently no data to display here.', 
  actionLabel, 
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-white to-gray-50 rounded-xl border border-dashed border-gray-300 ${className}`}>
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-600 mb-4 ring-1 ring-primary-100">
        <Icon className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
