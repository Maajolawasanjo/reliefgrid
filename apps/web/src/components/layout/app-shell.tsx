'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { FullLogo } from '@/components/ui/logo';
import { Icon } from '@/components/ui/icons';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Incidents', href: '/incidents', icon: 'incident' },
  { label: 'Executive View', href: '/executive', icon: 'analytics' },
  { label: 'Memory Engine', href: '/memory', icon: 'memory' },
  { label: 'Telemetry', href: '/telemetry', icon: 'telemetry' },
];

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AppShell({ children, title, subtitle, actions }: AppShellProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex font-body">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 lg:flex`}
      >
        {/* Logo — Links directly to /incidents Dashboard */}
        <Link
          href="/incidents"
          className="flex items-center gap-3 px-6 py-5 border-b border-slate-800 hover:opacity-90 transition-opacity focus:outline-none"
          title="Return to Emergency Command Center Dashboard"
        >
          <FullLogo iconSize="h-9 w-9" textClass="text-lg" subtitle={false} />
        </Link>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#9AF376]/15 text-[#9AF376] border border-[#9AF376]/30 shadow-md font-bold'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-850'
                }`}
              >
                <Icon name={item.icon as any} size={18} className={isActive ? 'text-[#9AF376]' : 'text-slate-400'} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto rounded-full bg-red-500 text-white text-[10px] font-bold px-2 py-0.5">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User info + sign out */}
        {user && (
          <div className="px-4 py-4 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-[#9AF376]/20 border border-[#9AF376]/40 flex items-center justify-center text-[#9AF376] font-bold text-xs">
                {user.fullName?.charAt(0) || user.email?.charAt(0) || 'O'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-100 truncate">{user.fullName || user.email}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all focus:outline-none"
            >
              Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-6 py-4">
          {/* Mobile sidebar toggle */}
          <button
            className="lg:hidden mr-3 rounded-lg border border-slate-700 p-2 text-slate-300 hover:text-slate-100"
            onClick={() => setSidebarOpen((o) => !o)}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Page title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#9AF376] animate-pulse hidden sm:block" />
              {title}
            </h1>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5 truncate font-medium">{subtitle}</p>}
          </div>

          {/* Page-level actions */}
          {actions && <div className="flex items-center gap-3 ml-4">{actions}</div>}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 text-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
}
