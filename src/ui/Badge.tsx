import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'gray' | 'green' | 'purple';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'green', className = '' }) => {
  const styles = {
    blue: 'bg-blue-900/20 text-blue-300 border border-blue-800/50',
    gray: 'bg-dark-accent text-zinc-300 border border-dark-border',
    green: 'bg-primary-600/20 text-primary-300 border border-primary-600/30',
    purple: 'bg-purple-900/20 text-purple-300 border border-purple-800/50',
  };

  const selectedStyle = variant === 'green' && children ? styles.green : styles[variant];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${selectedStyle} ${className}`}>
      {children}
    </span>
  );
};