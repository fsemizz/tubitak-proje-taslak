import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'purple';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
}) => {
  const variants = {
    default: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
