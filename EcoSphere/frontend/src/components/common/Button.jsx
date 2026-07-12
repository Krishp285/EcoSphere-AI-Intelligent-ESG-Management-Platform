import React, { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  icon: Icon,
  fullWidth = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantStyles = variants[variant] || variants.primary;
  const sizeStyles = sizes[size] || sizes.md;
  const widthClass = fullWidth ? 'w-full' : '';
  const [ripples, setRipples] = useState([]);

  const createRipple = (event) => {
    if (props.disabled || isLoading) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    const ripple = { id: `${Date.now()}-${Math.random()}`, x, y, size };
    setRipples(prev => [...prev, ripple]);
    window.setTimeout(() => {
      setRipples(prev => prev.filter(item => item.id !== ripple.id));
    }, 650);
  };

  const buttonClassName = useMemo(() => `${baseStyles} ${variantStyles} ${sizeStyles} ${widthClass} ${className} relative overflow-hidden transform-gpu active:scale-[0.98]`, [baseStyles, variantStyles, sizeStyles, widthClass, className]);

  return (
    <button
      className={buttonClassName}
      onPointerDown={createRipple}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-inherit">
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 animate-ping"
            style={{ left: ripple.x, top: ripple.y, width: ripple.size, height: ripple.size, animationDuration: '650ms' }}
          />
        ))}
      </span>
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
