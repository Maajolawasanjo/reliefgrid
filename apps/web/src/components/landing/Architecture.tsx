'use client';

import React from 'react';
import { Icon } from '@/components/ui/icons';

export function LandingArchitecture() {
  return (
    <section id="architecture" className="py-20 md:py-28 bg-[#F7F9FA] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00D2FF]">
            Modular System Blueprint
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#34495E]">
            End-to-End Enterprise Architecture.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Designed for horizontal scalability, zero single point of failure, and complete operational transparency.
          </p>
        </div>

        {/* Architecture Flow Diagram */}
        <div className="mt-14 max-w-5xl mx-auto bg-slate-900 rounded-2xl border border-slate-800 p-8 text-slate-100 shadow-2xl space-y-8">
          {/* Layer 1: Client Portal */}
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-[#00D2FF] font-bold">LAYER 1 — PRESENTATION TIER</span>
              <span>Next.js 14 App Router + Aspekta Styling</span>
            </div>
            <div className="grid sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-center">
                🖥️ Incident Command Center
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-center">
                🧠 Memory Explorer
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-center">
                📊 Telemetry Timeline
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-center">
                📈 Executive Dashboard
              </div>
            </div>
          </div>

          {/* Flow Arrow */}
          <div className="flex justify-center text-slate-500 font-mono text-xs">
            ↓ REST API Requests with JWT & Correlation Tracing ↓
          </div>

          {/* Layer 2: API Gateway & Orchestration */}
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-amber-400 font-bold">LAYER 2 — CONTROL & ORCHESTRATION GATEWAY</span>
              <span>FastAPI Python 3.12 + Async Coroutines</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                🛡️ Global Exception Handler & RBAC
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                ⚡ Coordinator Agent Orchestrator
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                🩺 Watchdog Task Auto-Healing Engine
              </div>
            </div>
          </div>

          {/* Flow Arrow */}
          <div className="flex justify-center text-slate-500 font-mono text-xs">
            ↓ Concurrent Async Execution across 6 Specialist Runtime Nodes ↓
          </div>

          {/* Layer 3: Specialist Runtimes & Cloud AI */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-emerald-400 font-bold">AWS BEDROCK INFERENCE</span>
              <p className="text-xs text-slate-400">Claude 3.5 Sonnet (Reasoning) + Titan Embeddings (1024D vectors)</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-[#00D2FF] font-bold">COCKROACHDB VECTOR ENGINE</span>
              <p className="text-xs text-slate-400">Distributed SQL + pgvector similarity indexing & serializable transactions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
