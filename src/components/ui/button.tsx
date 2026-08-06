import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export function buttonVariants({
  variant = 'default',
  size = 'md',
  className = '',
}: {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
} = {}) {
  const baseStyle =
    'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-sm';

  const variants = {
    default:
      'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-indigo-200',
    secondary: 'bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-amber-200',
    outline: 'border-2 border-slate-200 hover:bg-slate-100 text-slate-700',
    ghost: 'hover:bg-slate-100 text-slate-600 shadow-none',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
    icon: 'p-2.5 aspect-square',
  };

  return `${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props}>
      {children}
    </button>
  );
};
