import React from 'react';

// 1. Spinner Component
export function Spinner({
  className = '',
  size = 'md',
  color = 'technology',
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'technology' | 'urgency' | 'white' | 'slate';
}) {
  const sizeClasses = {
    sm: 'h-4 w-4 stroke-[3px]',
    md: 'h-8 w-8 stroke-[2px]',
    lg: 'h-12 w-12 stroke-[2px]',
  };

  const colorClasses = {
    technology: 'text-rg-tech-500',
    urgency: 'text-rg-urgency',
    white: 'text-white',
    slate: 'text-rg-slate',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// 2. Skeleton Loading Block
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-shimmer rounded bg-rg-primary-100 ${className}`} />;
}

// 3. Progress Bar
export function ProgressBar({
  value,
  max = 100,
  className = '',
}: {
  value: number;
  max?: number;
  className?: string;
}) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className={`w-full bg-rg-primary-100 h-2 rounded-full overflow-hidden ${className}`}>
      <div
        className="bg-rg-tech-500 h-full rounded-full transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

// 4. AI Agent Thinking / Streaming Indicator
export function ThinkingIndicator({ agentName }: { agentName?: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-rg-card border border-rg-tech-500/20 bg-rg-tech-50/50 shadow-rg-glow">
      <div className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-rg-tech-500 animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2 w-2 rounded-full bg-rg-tech-500 animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2 w-2 rounded-full bg-rg-tech-500 animate-bounce" />
      </div>
      <div className="text-xs font-mono font-bold text-rg-slate">
        {agentName ? `${agentName} Agent` : 'Coordinator Agent'} is executing reasoning trace...
      </div>
    </div>
  );
}
