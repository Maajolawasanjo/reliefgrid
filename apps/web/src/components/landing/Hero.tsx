'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icons';

export function LandingHero() {
  const router = useRouter();

  return (
    <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 bg-[#0B131A] text-slate-100 overflow-hidden border-b border-slate-800/80">
      {/* ── Dynamic Ambient Radial Light Glows ────────────────────────────── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#00D2FF]/20 via-[#9AF376]/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-[#FF6B00]/10 blur-[120px] pointer-events-none rounded-full" />

      {/* High-Tech Dot Grid Pattern Layer */}
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_0%,#0B131A_90%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Top Announcement Badge */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-[#233747] bg-[#162531]/90 px-4 py-1.5 text-xs font-semibold text-slate-200 mb-8 hover:border-slate-600 transition-all cursor-pointer shadow-xl backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9AF376] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9AF376]" />
          </span>
          <span className="font-bold text-[#9AF376] font-mono uppercase tracking-wider text-[11px]">CockroachDB × AWS Hackathon 2026</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300 font-mono text-[11px]">Multi-Agent Emergency System</span>
        </div>

        {/* Massive Display Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] max-w-5xl mx-auto">
          AI That Never Forgets <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#00D2FF] via-[#9AF376] to-[#00D2FF] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,210,255,0.25)]">
            a Crisis.
          </span>
        </h1>

        {/* Subheadline with Inline Technology Badges */}
        <p className="mt-7 text-base sm:text-xl text-[#94A3B8] max-w-3xl mx-auto font-normal leading-relaxed text-pretty">
          ReliefGrid is an autonomous multi-agent disaster response platform powered by{' '}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#162531] border border-[#233747] text-slate-100 font-medium text-sm">
            <Icon name="memory" size={14} className="text-[#FF6B00]" />
            CockroachDB Vector Memory
          </span>{' '}
          and{' '}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#162531] border border-[#233747] text-slate-100 font-medium text-sm">
            <Icon name="bedrock" size={14} className="text-[#9AF376]" />
            AWS Bedrock
          </span>
          . It eliminates operational amnesia by recalling historical disaster decisions to optimize evacuation routing and triage.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => router.push('/incidents')}
            className="rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#38bdf8] px-7 py-3.5 text-sm font-extrabold text-slate-950 hover:brightness-110 transition-all shadow-[0_0_30px_rgba(0,210,255,0.35)] flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[#9AF376]"
          >
            <Icon name="incident" size={18} className="text-slate-950" />
            <span>Launch Command Center</span>
          </button>

          <Link
            href="/docs"
            className="rounded-xl border border-[#233747] bg-[#162531]/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-[#162531] hover:border-slate-600 transition-all shadow-md flex items-center gap-2 focus:outline-none"
          >
            <Icon name="reports" size={18} className="text-slate-400" />
            <span>Architecture Specs</span>
          </Link>

          <Link
            href="/memory"
            className="rounded-xl border border-[#233747] bg-[#162531]/40 px-6 py-3.5 text-sm font-semibold text-slate-300 hover:bg-[#162531] hover:text-white transition-all flex items-center gap-2 focus:outline-none"
          >
            <Icon name="memory" size={18} className="text-[#FF6B00]" />
            <span>Explore Memory Engine</span>
          </Link>
        </div>

        {/* Refined Live Metrics Strip — Glassmorphism Cards */}
        <div className="mt-14 pt-8 border-t border-[#233747]/60 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-[#162531]/60 border border-[#233747] backdrop-blur-md space-y-1 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Specialist Agents</span>
              <Icon name="ai" size={14} className="text-[#9AF376]" />
            </div>
            <div className="text-xl font-extrabold text-slate-100 font-mono">6 Autonomous</div>
            <p className="text-[10px] text-slate-400 font-mono">Parallel Execution</p>
          </div>

          <div className="p-4 rounded-xl bg-[#162531]/60 border border-[#233747] backdrop-blur-md space-y-1 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Memory Layer</span>
              <Icon name="memory" size={14} className="text-[#FF6B00]" />
            </div>
            <div className="text-xl font-extrabold text-[#00D2FF] font-mono">CockroachDB</div>
            <p className="text-[10px] text-slate-400 font-mono">1024D pgvector Index</p>
          </div>

          <div className="p-4 rounded-xl bg-[#162531]/60 border border-[#233747] backdrop-blur-md space-y-1 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">AI Reasoning</span>
              <Icon name="bedrock" size={14} className="text-[#9AF376]" />
            </div>
            <div className="text-xl font-extrabold text-slate-100 font-mono">AWS Bedrock</div>
            <p className="text-[10px] text-slate-400 font-mono">Claude 3.5 Sonnet</p>
          </div>

          <div className="p-4 rounded-xl bg-[#162531]/60 border border-[#233747] backdrop-blur-md space-y-1 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">GIS Feeds</span>
              <Icon name="map" size={14} className="text-[#00D2FF]" />
            </div>
            <div className="text-xl font-extrabold text-slate-100 font-mono">OSM + Meteo</div>
            <p className="text-[10px] text-slate-400 font-mono">Real-time Telemetry</p>
          </div>
        </div>

        {/* ── Interactive Command Center Window Preview ────────────────────── */}
        <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl border border-[#233747] bg-[#0B131A] shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden text-left">
          {/* Chrome Window Bar */}
          <div className="bg-[#162531] px-5 py-3.5 border-b border-[#233747] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-3 font-mono text-xs text-slate-300 font-medium">reliefgrid-command-center -- incident-id=15178ba8 (Lekki Surge)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#9AF376] animate-pulse" />
              <span className="font-mono text-[10px] text-[#9AF376] uppercase tracking-widest font-bold">COCKROACHDB VECTOR SYNC</span>
            </div>
          </div>

          {/* Console Cards Container */}
          <div className="p-6 grid md:grid-cols-3 gap-6 font-mono text-xs">
            {/* Column 1: Live Ingestion Stream */}
            <div className="space-y-3 bg-[#162531]/80 p-4 rounded-xl border border-[#233747]">
              <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-[#233747]">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>[INPUT] Disaster Stream</span>
                </span>
                <span className="text-amber-400 font-bold">SEVERITY: HIGH</span>
              </div>
              <p className="text-slate-100 font-bold text-sm">📍 Lekki Peninsula Flash Flood</p>
              <p className="text-slate-400 text-[11px]">Lat: 6.4698 | Lon: 3.5852 (Lagos Sector)</p>
              <div className="bg-[#00D2FF]/10 border border-[#00D2FF]/30 p-2.5 rounded-lg text-cyan-300 text-[11px]">
                ⚡ Coordinator Agent dispatched 6 specialist tasks.
              </div>
            </div>

            {/* Column 2: Vector Memory Recall Proof */}
            <div className="space-y-3 bg-[#162531]/80 p-4 rounded-xl border border-[#233747]">
              <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-[#233747]">
                <span className="flex items-center gap-1.5">
                  <Icon name="memory" size={14} className="text-[#FF6B00]" />
                  <span>[MEMORY] Vector Search</span>
                </span>
                <span className="text-[#9AF376] font-bold">98.7% SIMILARITY</span>
              </div>
              <div className="p-3 rounded-lg bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-amber-300 text-[11px] space-y-1">
                <span className="font-bold text-[#FF6B00]">🧠 DECISION RECORD RECALLED:</span>
                <p className="text-amber-200/90 leading-tight">
                  Ikeja Centre rejected — primary access road submerged during prior storm event.
                </p>
              </div>
              <p className="text-slate-400 text-[10px]">Cosine Distance: 0.013 | Index: pgvector cosine</p>
            </div>

            {/* Column 3: Grounded Decision Dispatch */}
            <div className="space-y-3 bg-[#162531]/80 p-4 rounded-xl border border-[#233747]">
              <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-[#233747]">
                <span className="flex items-center gap-1.5">
                  <Icon name="audit" size={14} className="text-[#9AF376]" />
                  <span>[OUTPUT] Revision</span>
                </span>
                <span className="text-[#00D2FF] font-bold">CONFIDENCE: 96%</span>
              </div>
              <div className="p-3 rounded-lg bg-[#9AF376]/10 border border-[#9AF376]/30 text-[#9AF376] text-[11px] space-y-1">
                <span className="font-bold text-[#9AF376]">✅ ShelterAgent Memory Override:</span>
                <p className="text-emerald-200/90 leading-tight">
                  Dispatched evacuees to <strong>Agege Stadium Hub</strong>. Bypassed Ikeja road corridor.
                </p>
              </div>
              <p className="text-slate-400 text-[10px]">Attribution: Open-Meteo + Vector Memory</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
