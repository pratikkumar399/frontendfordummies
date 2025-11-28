import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  icon,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-md tracking-wide';
  
  const variants = {
    primary: 'bg-gradient-btn text-white border border-transparent hover:border-primary-400/30',
    secondary: 'bg-dark-accent text-white hover:bg-zinc-700 focus:ring-white border border-dark-border',
    outline: 'border border-dark-border bg-transparent text-zinc-300 hover:border-primary-400 hover:text-primary-400 focus:ring-zinc-700',
    ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5'
  };

  const sizes = {
    sm: 'h-8 px-4 text-xs',
    md: 'h-10 px-5 text-sm',
    lg: 'h-12 px-8 text-base'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};