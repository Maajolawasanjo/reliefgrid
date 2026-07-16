'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/icons';

export function LandingAgents() {
  const [activeAgent, setActiveAgent] = useState('shelter');

  const agents = [
    {
      id: 'weather',
      name: 'WeatherAgent',
      title: 'Meteorological & Hydrological Analysis',
      icon: 'weather',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      responsibilities: 'Analyzes live atmospheric telemetry, wind velocity, precipitation intensity, and storm surge trajectory.',
      inputs: 'Open-Meteo REST API, satellite precipitation feeds, local sensor nodes.',
      outputs: 'Flood surge risk scores, wind danger corridors, 24h weather trajectory forecast.',
      reasoning: 'Evaluates rainfall against terrain elevation maps to forecast flood inundation velocity.',
    },
    {
      id: 'shelter',
      name: 'ShelterAgent',
      title: 'Evacuation Capacity & Memory-Aware Recall',
      icon: 'shelter',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      responsibilities: 'Manages evacuation shelter allocations, matches displaced population capacity, and recalls past shelter failures.',
      inputs: 'OpenStreetMap facility database, displaced population counts, CockroachDB vector decision memory.',
      outputs: 'Optimal shelter selection recommendations, capacity utilization alerts, access route safety confirmations.',
      reasoning: 'Queries CockroachDB vector index for prior flood events. Overrides allocations if historical roads were submerged.',
    },
    {
      id: 'infrastructure',
      name: 'InfrastructureAgent',
      title: 'Road Network & Transportation Integrity',
      icon: 'infrastructure',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      responsibilities: 'Assesses bridge stability, road network blockages, power grid failures, and critical infrastructure collapse.',
      inputs: 'OSRM routing API, OpenStreetMap highway nodes, field report telemetry.',
      outputs: 'Navigable transport corridors, road obstruction warnings, secondary fallback routes.',
      reasoning: 'Calculates shortest path algorithms weighted by flood depth and debris density.',
    },
    {
      id: 'medical',
      name: 'MedicalAgent',
      title: 'Triage & Hospital Resource Matching',
      icon: 'medical',
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      responsibilities: 'Routes casualties to nearest trauma units, tracks ICU bed availability, and monitors field medical supplies.',
      inputs: 'Hospital registry telemetry, casualty estimates, trauma center capacity meters.',
      outputs: 'Medical evacuation dispatch plans, ambulance routing vectors, casualty overload alerts.',
      reasoning: 'Balances patient transport time against hospital emergency capacity to prevent facility collapse.',
    },
    {
      id: 'logistics',
      name: 'LogisticsAgent',
      title: 'Supply Chain & Emergency Resource Dispatch',
      icon: 'logistics',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      responsibilities: 'Manages distribution of clean water, medical packs, food rations, emergency generators, and rescue boats.',
      inputs: 'Inventory warehouse state, fuel supplies, transport convoy availability.',
      outputs: 'Supply distribution schedules, convoy routing manifests, resource deficit warnings.',
      reasoning: 'Prioritizes high-density impact sectors with critical water and power shortages.',
    },
    {
      id: 'communication',
      name: 'CommunicationAgent',
      title: 'Public Alerting & Inter-Agency Coordination',
      icon: 'communication',
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
      borderColor: 'border-violet-500/30',
      responsibilities: 'Synthesizes emergency broadcasts, sends evacuation notifications, and maintains inter-agency situation reports.',
      inputs: 'Specialist agent outputs, incident location bounds, public alert templates.',
      outputs: 'Multi-lingual SMS emergency broadcasts, agency SITREPs, operational bulletins.',
      reasoning: 'Translates technical risk metrics into clear, actionable public evacuation instructions.',
    },
  ];

  const current = agents.find((a) => a.id === activeAgent) || agents[1];

  return (
    <section id="agents" className="py-20 md:py-28 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9AF376]">
            Autonomous Specialist Architecture
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
            6 Specialized AI Agents. One Cohesive Command Network.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Rather than relying on a single monolith prompt, ReliefGrid deploys domain-specific agents executing concurrently under the Coordinator.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setActiveAgent(agent.id)}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 border ${
                activeAgent === agent.id
                  ? 'bg-[#00D2FF] text-slate-950 border-[#00D2FF] shadow-lg font-extrabold'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850'
              }`}
            >
              <Icon name={agent.icon as any} size={16} className={activeAgent === agent.id ? 'text-slate-950' : 'text-slate-400'} />
              <span>{agent.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Agent Detail Card */}
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-950 p-8 sm:p-10 shadow-xl max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-850 pb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className={`h-14 w-14 rounded-2xl ${current.bgColor} border ${current.borderColor} flex items-center justify-center ${current.color}`}>
                <Icon name={current.icon as any} size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-100">{current.name}</h3>
                <p className="text-sm text-slate-400">{current.title}</p>
              </div>
            </div>
            <span className="rounded-full bg-slate-900 border border-slate-800 px-3.5 py-1 text-xs font-mono font-bold text-[#9AF376] self-start sm:self-auto">
              Concurrent Execution
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2 bg-slate-900/90 p-5 rounded-xl border border-slate-800">
              <span className="font-bold text-[#00D2FF] uppercase tracking-wider text-[11px] font-mono">Core Responsibilities</span>
              <p className="text-slate-300 leading-relaxed">{current.responsibilities}</p>
            </div>
            <div className="space-y-2 bg-slate-900/90 p-5 rounded-xl border border-slate-800">
              <span className="font-bold text-[#00D2FF] uppercase tracking-wider text-[11px] font-mono">AI Reasoning Logic</span>
              <p className="text-slate-300 leading-relaxed">{current.reasoning}</p>
            </div>
            <div className="space-y-2 bg-slate-900/90 p-5 rounded-xl border border-slate-800">
              <span className="font-bold text-[#9AF376] uppercase tracking-wider text-[11px] font-mono">Telemetry Inputs</span>
              <p className="text-slate-400 leading-relaxed font-mono text-[11px]">{current.inputs}</p>
            </div>
            <div className="space-y-2 bg-slate-900/90 p-5 rounded-xl border border-slate-800">
              <span className="font-bold text-[#9AF376] uppercase tracking-wider text-[11px] font-mono">Structured Outputs</span>
              <p className="text-slate-400 leading-relaxed font-mono text-[11px]">{current.outputs}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
