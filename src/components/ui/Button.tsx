import React from 'react';
import { ButtonVariant, ButtonSize } from '@/types/types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = ButtonVariant.PRIMARY, 
  size = ButtonSize.MD, 
  className = '', 
  children, 
  icon,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl tracking-wide';
  
  const variants = {
    [ButtonVariant.PRIMARY]: 'bg-gradient-btn text-white border border-transparent hover:border-primary-400/30',
    [ButtonVariant.SECONDARY]: 'bg-dark-accent text-white hover:bg-zinc-700 focus:ring-white border border-dark-border',
    [ButtonVariant.OUTLINE]: 'border border-dark-border bg-transparent text-zinc-300 hover:border-primary-400 hover:text-primary-400 focus:ring-zinc-700',
    [ButtonVariant.GHOST]: 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5'
  };

  const sizes = {
    [ButtonSize.SM]: 'h-8 px-4 text-xs',
    [ButtonSize.MD]: 'h-10 px-5 text-sm',
    [ButtonSize.LG]: 'h-12 px-8 text-base'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ borderRadius: '0.5rem', ...props.style }}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
