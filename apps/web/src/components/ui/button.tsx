import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles: Aspekta typography, 8px layout, focus ring
    const baseStyle =
      'inline-flex items-center justify-center font-sans font-semibold tracking-wide transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-rg-tech-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    // Size variants matching the typography token heights
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs rounded-rg-sm gap-1.5 h-8',
      md: 'px-4 py-2 text-sm rounded-rg-button gap-2 h-10',
      lg: 'px-6 py-3 text-base rounded-rg-lg gap-2.5 h-12',
    };

    // Color theme variants derived from the Locked Palette
    const variantStyles = {
      primary:
        'bg-rg-slate text-white border border-rg-navy-600 hover:bg-rg-navy-600 hover:border-rg-navy-700 active:bg-rg-navy-700 shadow-rg-sm',
      secondary:
        'bg-white text-rg-text border border-rg-primary-200 hover:bg-rg-primary-50 active:bg-rg-primary-100 shadow-rg-sm',
      ghost:
        'bg-transparent text-rg-text hover:bg-rg-primary-100 active:bg-rg-primary-200',
      outline:
        'bg-transparent text-rg-navy-500 border-2 border-rg-navy-500 hover:bg-rg-navy-50 active:bg-rg-navy-100',
      danger:
        'bg-rg-danger-500 text-white hover:bg-rg-danger-600 active:bg-rg-danger-700 shadow-rg-sm',
      success:
        'bg-rg-success-500 text-white hover:bg-rg-success-600 active:bg-rg-success-700 shadow-rg-sm',
    };

    const spinner = (
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading && spinner}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
