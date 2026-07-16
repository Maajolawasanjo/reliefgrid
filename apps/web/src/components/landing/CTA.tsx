'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icons';

export function LandingCTA() {
  const router = useRouter();

  return (
    <section className="py-20 md:py-28 bg-slate-950 text-white relative overflow-hidden border-b border-slate-900">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(154,243,118,0.12),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <span className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/30 px-4 py-1 text-xs font-mono font-bold text-[#9AF376]">
          PRODUCTION-READY DISASTER INTELLIGENCE
        </span>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-slate-100">
          Ready to Transform Emergency Response with Memory-Guided AI?
        </h2>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Experience the live Command Center, run simulated flood scenarios, or explore CockroachDB vector recall in action.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => router.push('/incidents')}
            className="rounded-xl bg-[#00D2FF] px-8 py-4 text-sm font-extrabold text-slate-950 hover:bg-cyan-300 transition-all shadow-xl flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#9AF376]"
          >
            <Icon name="incident" size={18} className="text-slate-950" />
            <span>Launch Command Center</span>
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-slate-800 bg-slate-900 px-7 py-4 text-sm font-semibold text-slate-200 hover:bg-slate-850 hover:border-slate-700 transition-all flex items-center gap-2 focus:outline-none"
          >
            <svg className="h-5 w-5 fill-current text-slate-300" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>View GitHub Repository</span>
          </a>
        </div>
      </div>
    </section>
  );
}
