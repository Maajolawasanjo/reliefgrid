'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { FullLogo } from '@/components/ui/logo';
import { Icon } from '@/components/ui/icons';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@reliefgrid.gov');
  const [password, setPassword] = useState('AdminPassword123!');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push('/incidents');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('admin@reliefgrid.gov');
    setPassword('AdminPassword123!');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 font-body">
      {/* Container Box */}
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Back to Public Landing Page Button */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#9AF376] transition-colors focus:outline-none"
          >
            <span>← Return to Public Landing Page</span>
          </Link>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-[#9AF376] border border-slate-700 font-bold">
            v1.0
          </span>
        </div>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center pt-2">
          <FullLogo className="flex flex-col items-center gap-2" iconSize="h-14 w-14" textClass="text-2xl" subtitle={true} />
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Security Gateway & Operations Access
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono font-extrabold text-[#9AF376] uppercase tracking-wider text-[11px]">Demo Environment Credentials</span>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-[11px] font-mono font-bold text-[#00D2FF] hover:underline focus:outline-none"
            >
              Fill Credentials
            </button>
          </div>
          <div className="font-mono text-slate-300 text-xs">Email: <span className="text-slate-100 font-bold">admin@reliefgrid.gov</span></div>
          <div className="font-mono text-slate-300 text-xs">Pass: <span className="text-slate-100 font-bold">AdminPassword123!</span></div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 p-3.5 text-xs font-mono text-red-400 border border-red-500/30">
            ⚠️ {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                Operator Email Address
              </label>
              <input
                type="email"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-[#00D2FF] focus:outline-none focus:ring-1 focus:ring-[#00D2FF] transition-all font-mono"
                placeholder="admin@reliefgrid.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                Security Password
              </label>
              <input
                type="password"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-[#00D2FF] focus:outline-none focus:ring-1 focus:ring-[#00D2FF] transition-all font-mono"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#38bdf8] px-4 py-3.5 text-sm font-extrabold text-slate-950 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,210,255,0.3)] focus:outline-none disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Icon name="incident" size={16} className="text-slate-950" />
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Emergency Command Center'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
