'use client';

import React from 'react';

export function LogoIcon({ className = 'h-10 w-10', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Outer Shield Outline */}
      <path
        d="M60 8 L108 35 V82 L60 112 L12 82 V35 Z"
        className="stroke-slate-800"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Interior Mesh structure */}
      <path
        d="M60 8 V58 M60 58 L12 35 M60 58 L108 35 M60 58 L12 82 M60 58 L108 82 M60 58 V112"
        className="stroke-slate-800"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Subdivisions / Triangulation */}
      <path
        d="M36 21.5 L60 35 L84 21.5 M12 35 L36 63 L60 35 M108 35 L84 63 L60 35 M36 63 L60 97 L84 63 M12 82 L36 63 M108 82 L84 63"
        className="stroke-slate-700/60"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="2 2"
      />

      {/* Highlighted Vector Paths (Fresh Green Glow) */}
      <path
        d="M36 21.5 L60 35 M60 35 V58 M60 58 L84 63 L108 35"
        className="stroke-brand-500"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Node Circles */}
      {/* Top Center Node */}
      <circle cx="60" cy="8" r="6" className="fill-slate-100 stroke-slate-950" strokeWidth="2" />
      {/* Center Node */}
      <circle cx="60" cy="58" r="6" className="fill-slate-100 stroke-slate-950" strokeWidth="2" />
      {/* Bottom Center Node */}
      <circle cx="60" cy="112" r="6" className="fill-slate-100 stroke-slate-950" strokeWidth="2" />
      
      {/* Active Fresh Green Highlighted Nodes */}
      {/* Upper Left Active Node */}
      <circle cx="36" cy="21.5" r="7.5" className="fill-brand-500 stroke-slate-950" strokeWidth="2.5" />
      {/* Upper Right Active Node */}
      <circle cx="84" cy="21.5" r="7.5" className="fill-brand-500 stroke-slate-950" strokeWidth="2.5" />
      {/* Center Right Active Node */}
      <circle cx="84" cy="63" r="7.5" className="fill-brand-500 stroke-slate-950" strokeWidth="2.5" />
    </svg>
  );
}

export function Wordmark({ className = 'text-2xl font-bold tracking-wider', ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`font-sans tracking-tight ${className}`} {...props}>
      <span className="text-slate-100 font-black">RELIEF</span>
      <span className="text-brand-500 font-extrabold">GRID</span>
    </span>
  );
}

export function FullLogo({
  className = 'flex items-center gap-3',
  iconSize = 'h-10 w-10',
  textClass = 'text-2xl',
  subtitle = true
}: {
  className?: string;
  iconSize?: string;
  textClass?: string;
  subtitle?: boolean;
}) {
  return (
    <div className={className}>
      <LogoIcon className={iconSize} />
      <div className="flex flex-col leading-none">
        <Wordmark className={`font-black tracking-tight ${textClass}`} />
        {subtitle && (
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mt-1">
            Multi-Agent Disaster Coordination
          </span>
        )}
      </div>
    </div>
  );
}
