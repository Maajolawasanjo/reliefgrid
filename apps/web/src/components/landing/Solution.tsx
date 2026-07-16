'use client';

import React from 'react';
import { Icon } from '@/components/ui/icons';

export function LandingSolution() {
  const steps = [
    {
      step: '01',
      title: 'Real-Time Incident Ingestion',
      description: 'Incident stream ingested via REST API or operator report, grounded with exact GPS street geocoding.',
      icon: 'incident',
    },
    {
      step: '02',
      title: 'Coordinator Agent Orchestration',
      description: 'Decomposes complex crisis into concurrent domain mandates for specialized execution.',
      icon: 'coordinator',
    },
    {
      step: '03',
      title: '6 Specialist Agents Parallel Execution',
      description: 'Weather, Infrastructure, Medical, Shelter, Logistics, and Communication agents process domain data simultaneously.',
      icon: 'ai',
    },
    {
      step: '04',
      title: 'CockroachDB Vector Memory Recall',
      description: 'Performs cosine similarity search over historical decision records to identify past failures and successes.',
      icon: 'memory',
    },
    {
      step: '05',
      title: 'AI Decision Revision & Evidence Synthesis',
      description: 'AWS Bedrock synthesizes grounded recommendations with explicit data source attribution and confidence scoring.',
      icon: 'bedrock',
    },
    {
      step: '06',
      title: 'Actionable Dispatch & Audit Logging',
      description: 'Dispatches emergency units, updates GIS matrices, and logs immutable audit records for after-action review.',
      icon: 'reports',
    },
  ];

  return (
    <section id="workflow" className="py-20 md:py-28 bg-slate-950 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00D2FF]">
            The ReliefGrid Paradigm
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
            How ReliefGrid Operates Under Fire.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            A battle-tested 6-stage autonomous workflow that combines multi-agent consensus, transactional database persistence, and vector memory recall.
          </p>
        </div>

        {/* Workflow Grid */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border border-slate-800 bg-slate-900 p-7 transition-all hover:bg-slate-850 hover:border-slate-700 hover:shadow-lg group space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono text-slate-600 group-hover:text-[#9AF376] transition-colors">
                  {item.step}
                </span>
                <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-[#00D2FF]">
                  <Icon name={item.icon as any} size={20} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-100">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
