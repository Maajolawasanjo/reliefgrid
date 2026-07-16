'use client';

import React from 'react';
import { Icon } from '@/components/ui/icons';

export function LandingWhyCockroachDB() {
  const reasons = [
    {
      title: 'Distributed ACID Consistency',
      desc: 'Disaster coordination cannot tolerate split-brain data or partial writes. CockroachDB guarantees strict serializable transaction isolation across nodes.',
      icon: 'memory',
    },
    {
      title: 'Native pgvector Embeddings Indexing',
      desc: 'Stores 1024D Titan embeddings directly alongside relational operational tables, enabling cosine similarity queries inside standard SQL.',
      icon: 'search',
    },
    {
      title: 'Survivable Multi-Region Infrastructure',
      desc: 'During real floods, power grids fail. CockroachDB multi-region deployments survive regional datacenter outages with zero loss of decision state.',
      icon: 'infrastructure',
    },
    {
      title: 'Conflict Retry & State Protection',
      desc: 'ReliefGrid uses automatic conflict retry handlers to protect agent execution pipelines during heavy concurrent incident ingestion.',
      icon: 'audit',
    },
  ];

  return (
    <section id="why-cockroach" className="py-20 md:py-28 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF6B00]">
            The Memory Foundation
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
            Why CockroachDB is Critical to ReliefGrid.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Single-node SQLite or fragile vector sidecars crumble during real disaster emergencies. CockroachDB provides transactional multi-region vector resilience.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="mt-16 grid sm:grid-cols-2 gap-8">
          {reasons.map((r, idx) => (
            <div key={idx} className="p-8 rounded-2xl border border-slate-800 bg-slate-950 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-[#9AF376]">
                <Icon name={r.icon as any} size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-100">{r.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
