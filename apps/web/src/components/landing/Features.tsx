'use client';

import React from 'react';
import { Icon } from '@/components/ui/icons';

export function LandingFeatures() {
  const features = [
    {
      title: 'Multi-Agent Consensus Engine',
      desc: 'Coordinates 6 domain specialists concurrently under the Coordinator Agent.',
      icon: 'coordinator',
    },
    {
      title: 'CockroachDB Vector Memory',
      desc: 'Retrieves prior crisis decisions using pgvector cosine similarity matching.',
      icon: 'memory',
    },
    {
      title: 'Watchdog Self-Healing Worker',
      desc: 'Detects stalled or timed-out agent tasks and auto-recovers state from checkpoints.',
      icon: 'telemetry',
    },
    {
      title: '11-Layer Exception Envelope',
      desc: 'Standardized error responses with structured error codes, correlation IDs, and trace IDs.',
      icon: 'audit',
    },
    {
      title: 'Custom OpenAPI Portal',
      desc: 'Interactive enterprise documentation portal built directly inside the web command app.',
      icon: 'reports',
    },
    {
      title: 'Ground Truth Telemetry',
      desc: 'Integrates real Open-Meteo forecasts, OpenStreetMap facilities, and OSRM routing.',
      icon: 'weather',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-slate-950 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00D2FF]">
            Platform Capabilities
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
            Designed for Government & Enterprise Emergency Standards.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Every subsystem is built with strict type safety, end-to-end auditability, and production resilience.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl border border-slate-800 bg-slate-900 shadow-md hover:border-slate-700 transition-all space-y-3"
            >
              <div className="h-12 w-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-[#00D2FF]">
                <Icon name={f.icon as any} size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-100">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
