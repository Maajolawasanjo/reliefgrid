import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'hoverable' | 'interactive' | 'accent' | 'dark' | 'glow';
}

export function Card({ className = '', variant = 'base', ...props }: CardProps) {
  const baseStyle = 'rounded-rg-card border bg-white shadow-rg-sm p-5 transition-all duration-200';
  
  const variantStyles = {
    base: 'border-tactical bg-white text-rg-text',
    hoverable: 'border-tactical bg-white text-rg-text hover:shadow-rg-md hover:border-rg-primary-300',
    interactive: 'border-tactical bg-white text-rg-text cursor-pointer hover:shadow-rg-md hover:border-rg-tech-500 hover:ring-1 hover:ring-rg-tech-500 active:scale-[0.99]',
    accent: 'border-tactical border-l-4 border-l-rg-urgency bg-white text-rg-text',
    dark: 'bg-rg-slate text-white border-rg-navy-600 shadow-lg',
    glow: 'border-rg-tech-500/30 bg-white text-rg-text shadow-rg-glow',
  };

  return <div className={`${baseStyle} ${variantStyles[variant]} ${className}`} {...props} />;
}

export function CardHeader({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`border-b border-rg-primary-100 pb-3 mb-4 flex items-center justify-between ${className}`} {...props} />;
}

export function CardBody({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`space-y-3 ${className}`} {...props} />;
}

export function CardFooter({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`border-t border-rg-primary-100 pt-3 mt-4 flex items-center justify-between text-xs text-slate-500 ${className}`} {...props} />;
}
