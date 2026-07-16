'use client';

import React from 'react';
import { Icon } from '@/components/ui/icons';

export function LandingTechnology() {
  const stack = [
    {
      name: 'CockroachDB Serverless',
      category: 'Distributed Vector Memory DB',
      description: 'Houses 1024D vector embeddings and transactional decision records with pgvector similarity indexing.',
      icon: 'memory',
    },
    {
      name: 'AWS Bedrock',
      category: 'Foundation AI Service',
      description: 'Orchestrates Claude 3.5 Sonnet reasoning & Titan Text Embeddings with enterprise isolation.',
      icon: 'bedrock',
    },
    {
      name: 'FastAPI (Python 3.12)',
      category: 'Asynchronous API Gateway',
      description: 'Provides high-throughput async endpoints, request validation, and global correlation middleware.',
      icon: 'telemetry',
    },
    {
      name: 'Next.js 14 + App Router',
      category: 'Frontend Command Center',
      description: 'React Server Components, dynamic bundle splitting, and strict TypeScript types.',
      icon: 'analytics',
    },
    {
      name: 'Open-Meteo Weather API',
      category: 'Hydrological & Storm Feeds',
      description: 'Fetches real-time wind speeds, hourly rainfall levels, and pressure gradients without rate limits.',
      icon: 'weather',
    },
    {
      name: 'OpenStreetMap & OSRM',
      category: 'Spatial & Route Engine',
      description: 'Resolves hospital and shelter coordinates and calculates optimal evacuation drive times.',
      icon: 'route',
    },
  ];

  return (
    <section id="stack" className="py-20 md:py-28 bg-slate-950 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9AF376]">
            Enterprise Infrastructure
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
            Built with Best-in-Class Cloud & AI Native Technologies.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            No toy scripts or fragile abstractions. ReliefGrid is built on distributed SQL, cloud foundation models, and open GIS standards.
          </p>
        </div>

        {/* Tech Stack Cards Grid */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stack.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition-all hover:bg-slate-850 hover:border-slate-700 hover:shadow-lg space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-[#9AF376]">
                  <Icon name={item.icon as any} size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">{item.name}</h3>
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">{item.category}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800/80">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
