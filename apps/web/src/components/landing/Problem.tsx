'use client';

import React from 'react';
import { Icon } from '@/components/ui/icons';

export function LandingProblem() {
  const problems = [
    {
      title: 'Disaster Amnesia',
      description: 'Emergency response agencies repeat past failures because operational lessons learned are buried in static post-disaster PDF reports rather than active system memory.',
      icon: 'memory',
      badge: 'Critical Flaw',
    },
    {
      title: 'Information Chaos & Fragmented Telemetry',
      description: 'Satellite weather, shelter capacities, road closures, and medical inventory sit in disconnected silos, delaying critical multi-agency consensus during the golden hour.',
      icon: 'telemetry',
      badge: 'Data Silos',
    },
    {
      title: 'Hallucinated AI Recommendations',
      description: 'Generic LLM tools lack ground truth verification, producing hallucinated dispatch plans that fail on the ground during active weather and flooding events.',
      icon: 'alert',
      badge: 'Unverified AI',
    },
    {
      title: 'State Loss & System Cascades',
      description: 'Standard stateless AI scripts crash mid-incident, losing progress and forcing responders to restart emergency reasoning from scratch while lives are at stake.',
      icon: 'infrastructure',
      badge: 'System Risk',
    },
  ];

  return (
    <section id="problem" className="py-20 md:py-28 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF6B00]">
            The Crisis Response Challenge
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
            Traditional Disaster Response is Severely Hampered by Amnesia.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            When disasters hit, decision-makers are flooded with noise. Statistically, up to 70% of response delays stem from fragmented agency data and repeating past shelter or route mistakes.
          </p>
        </div>

        {/* Problem Grid */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {problems.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-8 shadow-md hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-[#9AF376]">
                  <Icon name={item.icon as any} size={24} />
                </div>
                <span className="rounded-full bg-red-500/10 border border-red-500/30 px-3 py-1 text-[11px] font-bold text-red-400 uppercase font-mono tracking-wider">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-100">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
