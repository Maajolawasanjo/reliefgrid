import React from 'react';

// Unified standard focus and base classes for forms
const baseInputClass =
  'w-full px-4 py-2.5 text-sm font-sans bg-white border border-rg-primary-200 rounded-rg-input text-rg-text placeholder-slate-400 focus:border-rg-tech-500 focus:ring-1 focus:ring-rg-tech-500 focus:outline-none transition-all duration-150 disabled:opacity-50 disabled:bg-rg-primary-50 disabled:cursor-not-allowed';
const errorInputClass = 'border-rg-danger-500 focus:border-rg-danger-500 focus:ring-rg-danger-500';

interface FieldWrapperProps {
  label?: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

function FieldWrapper({ label, error, helperText, children }: FieldWrapperProps) {
  return (
    <div className="space-y-1 w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-rg-slate/80">
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-xs font-semibold text-rg-danger-500">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}

// 1. Text Input Primitive
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, type = 'text', ...props }, ref) => {
    return (
      <FieldWrapper label={label} error={error} helperText={helperText}>
        <input
          ref={ref}
          type={type}
          className={`${baseInputClass} ${error ? errorInputClass : ''} ${className}`}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
Input.displayName = 'Input';

// 2. Textarea Primitive
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, helperText, ...props }, ref) => {
    return (
      <FieldWrapper label={label} error={error} helperText={helperText}>
        <textarea
          ref={ref}
          className={`${baseInputClass} ${error ? errorInputClass : ''} min-h-[100px] resize-y ${className}`}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
Textarea.displayName = 'Textarea';

// 3. Dropdown Select Primitive
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, helperText, options, ...props }, ref) => {
    return (
      <FieldWrapper label={label} error={error} helperText={helperText}>
        <select
          ref={ref}
          className={`${baseInputClass} ${error ? errorInputClass : ''} ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FieldWrapper>
    );
  }
);
Select.displayName = 'Select';

// 4. Checkbox Control
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            ref={ref}
            type="checkbox"
            className={`h-4 w-4 rounded border-rg-primary-200 text-rg-slate focus:ring-rg-tech-500 cursor-pointer ${className}`}
            {...props}
          />
          <span className="text-sm font-sans font-medium text-rg-text">{label}</span>
        </label>
        {error && <p className="text-xs font-semibold text-rg-danger-500">{error}</p>}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

// 5. Toggle Switch
export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  checked?: boolean;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className = '', label, checked, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-3 cursor-pointer select-none">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            className="sr-only peer"
            {...props}
          />
          <div className="w-9 h-5 bg-rg-primary-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-rg-tech-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rg-tech-500" />
        </div>
        <span className="text-sm font-sans font-medium text-rg-text">{label}</span>
      </label>
    );
  }
);
Switch.displayName = 'Switch';
