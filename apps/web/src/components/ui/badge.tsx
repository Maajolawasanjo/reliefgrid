import React from 'react';

export type BadgeVariant =
  | 'active'
  | 'resolved'
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'pending'
  | 'processing'
  | 'success'
  | 'failed'
  | 'online'
  | 'offline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant;
}

export function Badge({ className = '', variant, children, ...props }: BadgeProps) {
  const baseStyle =
    'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border font-mono select-none';

  const variantStyles = {
    active: 'bg-rg-tech-50 text-rg-tech-700 border-rg-tech-200',
    resolved: 'bg-rg-success-50 text-rg-success-600 border-rg-success-200',
    critical: 'bg-rg-danger-50 text-rg-danger-600 border-rg-danger-200 animate-pulse',
    high: 'bg-rg-orange-50 text-rg-orange-600 border-rg-orange-200',
    medium: 'bg-rg-warning-50 text-rg-warning-600 border-rg-warning-200',
    low: 'bg-rg-primary-100 text-rg-primary-700 border-rg-primary-200',
    pending: 'bg-rg-primary-50 text-rg-primary-600 border-rg-primary-200',
    processing: 'bg-rg-tech-50 text-rg-tech-600 border-rg-tech-200 animate-pulse',
    success: 'bg-rg-success-50 text-rg-success-600 border-rg-success-200',
    failed: 'bg-rg-danger-50 text-rg-danger-600 border-rg-danger-200',
    online: 'bg-rg-success-50 text-rg-success-600 border-rg-success-200 flex items-center gap-1',
    offline: 'bg-rg-primary-100 text-rg-primary-400 border-rg-primary-200 flex items-center gap-1',
  };

  const getDot = () => {
    if (variant === 'online') {
      return <span className="h-1.5 w-1.5 rounded-full bg-rg-success-500 animate-ping" />;
    }
    if (variant === 'offline') {
      return <span className="h-1.5 w-1.5 rounded-full bg-rg-primary-300" />;
    }
    return null;
  };

  return (
    <span className={`${baseStyle} ${variantStyles[variant]} ${className}`} {...props}>
      {getDot()}
      <span>{children || variant}</span>
    </span>
  );
}
