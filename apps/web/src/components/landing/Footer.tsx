'use client';

import React from 'react';
import Link from 'next/link';
import { FullLogo } from '@/components/ui/logo';

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="col-span-2 space-y-4">
          <FullLogo iconSize="h-8 w-8" textClass="text-lg text-slate-100 font-extrabold" subtitle={false} />
          <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
            Mission-Critical Autonomous Multi-Agent Disaster Response Platform Engine powered by CockroachDB Collective Vector Memory and AWS Bedrock Reasoning.
          </p>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 pt-2">
            <span>Built by @Ma'ajo Lawasanjo</span>
            <span>•</span>
            <span className="text-[#9AF376]">CockroachDB × AWS Hackathon 2026</span>
          </div>
        </div>

        {/* Platform Links */}
        <div className="space-y-3">
          <span className="font-bold text-slate-200 uppercase font-mono tracking-wider text-[11px]">Platform</span>
          <ul className="space-y-2">
            <li><Link href="/incidents" className="hover:text-slate-100 transition-colors">Command Center</Link></li>
            <li><Link href="/memory" className="hover:text-slate-100 transition-colors">Memory Engine</Link></li>
            <li><Link href="/telemetry" className="hover:text-slate-100 transition-colors">Telemetry Worker</Link></li>
            <li><Link href="/executive" className="hover:text-slate-100 transition-colors">Executive View</Link></li>
          </ul>
        </div>

        {/* Developer Links */}
        <div className="space-y-3">
          <span className="font-bold text-slate-200 uppercase font-mono tracking-wider text-[11px]">Developers</span>
          <ul className="space-y-2">
            <li><Link href="/docs" className="hover:text-slate-100 transition-colors">API Portal & Specs</Link></li>
            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-100 transition-colors">GitHub Repository</a></li>
            <li><a href="#architecture" className="hover:text-slate-100 transition-colors">System Architecture</a></li>
            <li><a href="#stack" className="hover:text-slate-100 transition-colors">Technology Stack</a></li>
          </ul>
        </div>

        {/* Legal & Open Source */}
        <div className="space-y-3">
          <span className="font-bold text-slate-200 uppercase font-mono tracking-wider text-[11px]">Legal & License</span>
          <ul className="space-y-2">
            <li><span className="text-slate-500">MIT Open Source License</span></li>
            <li><span className="text-slate-500">Open-Meteo & OpenStreetMap Terms</span></li>
            <li><span className="text-slate-500">AWS Bedrock Responsible AI</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
        <p>© 2026 ReliefGrid Platform. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="h-2 w-2 rounded-full bg-[#9AF376] animate-pulse" />
          <span className="font-mono text-[#9AF376] font-semibold">All Systems Operational</span>
        </div>
      </div>
    </footer>
  );
}
