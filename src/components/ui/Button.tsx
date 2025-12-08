import React from 'react';
import Link from 'next/link';
import { ButtonVariant, ButtonSize } from '@/types/types';

// Shared styles for button appearance
const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl tracking-wide';

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

// Utility function to get button classes (useful for custom styling)
export const getButtonClasses = (
  variant: ButtonVariant = ButtonVariant.PRIMARY,
  size: ButtonSize = ButtonSize.MD,
  className: string = ''
) => `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

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
  return (
    <button
      className={getButtonClasses(variant, size, className)}
      style={{ borderRadius: '0.5rem', ...props.style }}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// LinkButton component - renders as an anchor tag styled like a button (SEO-friendly)
interface LinkButtonProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  target?: string;
  rel?: string;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  variant = ButtonVariant.PRIMARY,
  size = ButtonSize.MD,
  className = '',
  children,
  icon,
  target,
  rel,
}) => {
  const isExternal = href.startsWith('http') || href.startsWith('//');
  
  const content = (
    <>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </>
  );

  const buttonClasses = getButtonClasses(variant, size, className);
  const style = { borderRadius: '0.5rem' };

  if (isExternal) {
    return (
      <a 
        href={href} 
        className={buttonClasses} 
        style={style}
        target={target || '_blank'}
        rel={rel || 'noopener noreferrer'}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={buttonClasses} style={style}>
      {content}
    </Link>
  );
};
