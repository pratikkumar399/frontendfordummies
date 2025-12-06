import React from 'react';
import { BadgeVariant } from '@/types/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = BadgeVariant.GREEN, className = '' }) => {
  const styles = {
    [BadgeVariant.BLUE]: 'bg-blue-900/20 text-blue-300 border border-blue-800/50',
    [BadgeVariant.GRAY]: 'bg-dark-accent text-zinc-300 border border-dark-border',
    [BadgeVariant.GREEN]: 'bg-primary-600/20 text-primary-300 border border-primary-600/30',
    [BadgeVariant.PURPLE]: 'bg-purple-900/20 text-purple-300 border border-purple-800/50',
  };

  const selectedStyle = variant === BadgeVariant.GREEN && children ? styles[BadgeVariant.GREEN] : styles[variant];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${selectedStyle} ${className}`}>
      {children}
    </span>
  );
};
