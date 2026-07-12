import React from 'react';

export const Avatar = ({ src, alt, initials, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const sizeClass = sizes[size] || sizes.md;

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full bg-primary-100 text-primary-700 overflow-hidden ${sizeClass} ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="font-semibold uppercase">{initials || alt?.charAt(0) || '?'}</span>
      )}
    </div>
  );
};

export default Avatar;
