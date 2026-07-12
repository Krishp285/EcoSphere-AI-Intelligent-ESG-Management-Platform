import React from 'react';
import EmptyState from '../components/common/EmptyState';
import { Hammer } from 'lucide-react';

export const PlaceholderPage = ({ title }) => {
  return (
    <div className="h-full flex items-center justify-center py-12">
      <EmptyState 
        icon={Hammer}
        title={`${title} Module Under Development`}
        description={`We are actively building the ${title} module. It will be available in an upcoming release.`}
        className="w-full max-w-2xl bg-white shadow-sm border-gray-200"
      />
    </div>
  );
};

export default PlaceholderPage;
