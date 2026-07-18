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
  const { login, launchDemo } = useAuth();
  const router = useRouter();

  const handleLaunchDemo = () => {
    launchDemo();
    router.push('/incidents');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push('/incidents');
    } catch (err: any) {
      // Graceful fallback to demo mode
      launchDemo();
      router.push('/incidents');
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
            Emergency Operations & Public Access
          </p>
        </div>

        {/* ── PATH 1: PRIMARY INTERACTIVE DEMO CTA ── */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-[#9AF376]/40 shadow-[0_0_30px_rgba(154,243,118,0.15)] space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-[#9AF376] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#9AF376] animate-ping"></span>
              Public Interactive Demo
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#9AF376]/10 text-[#9AF376] border border-[#9AF376]/30">
              Instant Access
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Explore live disaster intelligence, autonomous multi-agent coordination, and vector memory recall without creating an account.
          </p>
          <button
            type="button"
            onClick={handleLaunchDemo}
            className="w-full rounded-xl bg-gradient-to-r from-[#9AF376] via-[#00D2FF] to-[#9AF376] bg-[length:200%_auto] hover:bg-right px-4 py-3.5 text-xs font-black text-slate-950 transition-all shadow-[0_0_20px_rgba(154,243,118,0.3)] focus:outline-none flex items-center justify-center gap-2 uppercase tracking-wider font-mono transform active:scale-[0.99]"
          >
            <Icon name="incident" size={16} className="text-slate-950" />
            <span>Launch Interactive Demo</span>
          </button>
        </div>

        {/* ── DIVIDER ── */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">OR OPERATOR SIGN IN</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* ── PATH 2: OPERATOR CREDENTIAL SIGN IN ── */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono font-extrabold text-slate-400 uppercase tracking-wider text-[11px]">Operator Credentials</span>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-[11px] font-mono font-bold text-[#00D2FF] hover:underline focus:outline-none"
            >
              Fill Credentials
            </button>
          </div>
          <div className="font-mono text-slate-400 text-xs">Email: <span className="text-slate-200 font-bold">admin@reliefgrid.gov</span></div>
          <div className="font-mono text-slate-400 text-xs">Pass: <span className="text-slate-200 font-bold">AdminPassword123!</span></div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 p-3.5 text-xs font-mono text-red-400 border border-red-500/30">
            ⚠️ {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                Operator Email Address
              </label>
              <input
                type="email"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-[#00D2FF] focus:outline-none focus:ring-1 focus:ring-[#00D2FF] transition-all font-mono"
                placeholder="admin@reliefgrid.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                Security Password
              </label>
              <input
                type="password"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-[#00D2FF] focus:outline-none focus:ring-1 focus:ring-[#00D2FF] transition-all font-mono"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-3 text-xs font-bold text-slate-200 transition-all border border-slate-700 focus:outline-none disabled:opacity-50 flex items-center justify-center gap-2 font-mono uppercase tracking-wider"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In as Operator'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

