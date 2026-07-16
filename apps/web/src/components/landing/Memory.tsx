'use client';

import React from 'react';
import { Icon } from '@/components/ui/icons';

export function LandingMemory() {
  const memoryTypes = [
    { type: 'DECISION_RECORD', desc: 'Past dispatch overrides & operational decisions', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    { type: 'LESSON_LEARNED', desc: 'Retrospective findings & bottleneck avoidance', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
    { type: 'ACTION_PLAN', desc: 'Master emergency response blueprints', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/30' },
    { type: 'SPECIALIST_FINDINGS', desc: 'Domain reasoning logs & evidence trails', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    { type: 'SITUATION_REPORT', desc: 'Periodic operational status snapshots', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    { type: 'WEATHER_OBSERVATION', desc: 'Historical meteorological surge data', badge: 'bg-slate-800 text-slate-300 border-slate-700' },
    { type: 'FIELD_UPDATE', desc: 'Ground responder capacity & damage telemetry', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  ];

  return (
    <section id="memory" className="py-20 md:py-28 bg-slate-950 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 text-xs font-mono font-bold text-amber-400 mb-3">
            <span className="h-2 w-2 rounded-full bg-[#FF6B00] animate-pulse" />
            <span>THE HERO CAPABILITY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
            Collective Memory: Turning Disasters into Permanent Intelligence.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Stateless AI models forget what happened yesterday. ReliefGrid embeds 1024-dimensional vectors directly inside <strong className="text-slate-200 font-semibold">CockroachDB</strong>, enabling real-time recall that fundamentally alters agent recommendations.
          </p>
        </div>

        {/* Side-by-Side Proof Comparison */}
        <div className="mt-16 grid md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Without Memory */}
          <div className="rounded-2xl border border-red-500/40 bg-red-950/20 p-8 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">Standard Stateless AI</span>
                <span className="rounded-full bg-red-500/20 border border-red-500/40 px-2.5 py-0.5 text-[11px] font-bold text-red-300 font-mono">
                  ❌ WITHOUT MEMORY RECALL
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100">Naïve Shelter Allocation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluates distance only and recommends <strong>Ikeja Community Centre</strong>. Ignores past flood patterns.
              </p>

              <div className="rounded-xl border border-red-500/30 bg-slate-950 p-4 text-xs font-mono space-y-2">
                <div className="text-red-400 font-bold">⚠️ FATAL OPERATIONAL FAILURE</div>
                <p className="text-slate-400 text-[11px]">
                  Access road to Ikeja floods 30 minutes after heavy rainfall. Convoy stalls mid-route, stranding 400 evacuees in rising waters.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-red-500/20 text-[11px] font-mono text-red-400 flex items-center justify-between">
              <span>Failure Cause: Zero Historical Context</span>
              <span className="font-bold">Dispatch Risk: HIGH</span>
            </div>
          </div>

          {/* Card 2: With CockroachDB Memory */}
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-8 space-y-5 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Icon name="memory" size={16} className="text-[#FF6B00]" />
                  <span>ReliefGrid Engine</span>
                </span>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 font-mono">
                  ✅ WITH COCKROACHDB RECALL
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100">Memory-Guided Shelter Override</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Queries CockroachDB vector index (`DECISION_RECORD` cosine similarity). Recalls prior Ikeja road submergence.
              </p>

              <div className="rounded-xl border border-emerald-500/40 bg-slate-950 p-4 text-xs font-mono space-y-2 shadow-sm">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span>🧠 DECISION OVERRIDE SUCCESS (98.7% Match)</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Revises recommendation to <strong>Agege Stadium Evacuation Hub</strong>. Bypasses submerged Ikeja corridor completely.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-400 flex items-center justify-between">
              <span>Proven Outcome: Zero Evacuation Stalls</span>
              <span className="font-bold text-emerald-300">Confidence: 98.7%</span>
            </div>
          </div>
        </div>

        {/* 7 Operational Memory Types Grid */}
        <div className="mt-16 pt-12 border-t border-slate-900 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl font-bold text-slate-100">7 Standardized Vector Memory Types</h3>
            <p className="text-xs text-slate-400">Every operational observation, report, and decision is vectorized and queryable across incidents.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {memoryTypes.map((m, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-900 space-y-2">
                <span className={`inline-block px-2.5 py-0.5 rounded border text-[10px] font-mono font-bold ${m.badge}`}>
                  {m.type}
                </span>
                <p className="text-xs text-slate-400">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
