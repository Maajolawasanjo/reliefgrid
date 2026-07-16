'use client';

import React from 'react';
import { env } from '@/lib/config';
import { Icon } from '@/components/ui/icons';

interface RecCard {
  id: string;
  agent: string;
  title: string;
  impact: string;
  confidence: number;
  evidence: string[];
  source_attribution: string;
  grounding: 'live' | 'simulated';
}

interface Props {
  incidentId: string;
  token: string | null;
  data: any;
  loading: boolean;
}

export function RecommendationsWidget({ incidentId, token, data, loading }: Props) {
  const downloadReport = () => {
    if (!token) return;
    window.open(`${env.apiUrl}/analytics/incidents/${incidentId}/export-report`, '_blank');
  };

  if (loading) return <div className="text-slate-500 py-6 text-center">Loading AI explainability analysis...</div>;
  if (!data) return null;

  const groundingScore = data.data_grounding_score ?? 0.0;
  const groundingStatus = data.data_grounding_status ?? 'Simulated data only';
  const sourcesUsed = data.data_sources_used ?? [];
  const timestamp = data.timestamp ? new Date(data.timestamp).toLocaleString() : 'N/A';

  // Styles for Grounding Badges
  const getGroundingBadgeClass = (status: string) => {
    if (status.includes('100%')) return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    if (status.includes('Mixed')) return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl space-y-6">
      
      {/* Header & Overall Confidence */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Icon name="ai" size={20} className="text-brand-500" /> AI Recommendation & Explainability Board
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Multi-agent emergency dispatch mandates & data source attribution</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400">Agent Consensus Confidence</span>
            <div className="text-xl font-extrabold text-brand-400">{data.confidence_score}%</div>
          </div>
          <button
            onClick={downloadReport}
            className="rounded-lg border border-brand-500/40 bg-brand-500/10 px-3.5 py-2 text-xs font-semibold text-brand-400 hover:bg-brand-500/20 transition-all flex items-center gap-1.5"
          >
            <Icon name="reports" size={14} /> Export After-Action Report
          </button>
        </div>
      </div>

      {/* Geolocation Grounding & Data Quality Score */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Weather Feed Banner */}
        <div className="flex items-center justify-between rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-xs">
          <div className="flex items-center gap-3">
            <Icon name="weather" size={24} className="text-cyan-400" />
            <div>
              <span className="font-bold text-cyan-300">Live External Weather Feed</span>
              <p className="text-slate-400">Source: {data.live_weather.source}</p>
            </div>
          </div>
          <div className="flex gap-4 font-mono text-cyan-200">
            <span>Temp: {data.live_weather.temperature_c}°C</span>
            <span>Wind: {data.live_weather.wind_speed_kmh} km/h</span>
          </div>
        </div>

        {/* Data Quality Score Card */}
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-slate-300">Data Grounding Quality</span>
            <div className="flex items-center gap-2">
              <span className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold ${getGroundingBadgeClass(groundingStatus)}`}>
                {groundingStatus}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500">Live Grounding Score</span>
            <div className="text-lg font-mono font-bold text-slate-200">{groundingScore}%</div>
          </div>
        </div>
      </div>

      {/* Integration Registry / Sources Used */}
      {sourcesUsed.length > 0 ? (
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 text-[11px] flex flex-wrap items-center gap-2">
          <span className="text-slate-500 font-bold uppercase tracking-wider">Verifiable Data Feeds:</span>
          {sourcesUsed.map((source: string, idx: number) => (
            <span key={idx} className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-slate-300 font-mono">
              {source}
            </span>
          ))}
          <span className="text-slate-500 ml-auto font-mono text-[10px]">T: {timestamp}</span>
        </div>
      ) : (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-[11px] text-rose-400 font-semibold flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span>Using simulated data. No active credentials or public API connections are currently configured.</span>
        </div>
      )}

      {/* Warning if simulated fallback active */}
      {groundingScore < 100 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-amber-300 flex items-start gap-2.5">
          <span className="mt-0.5">⚠️</span>
          <div>
            <span className="font-bold text-amber-200">Mixed Grounding Alert</span>
            <p className="text-slate-400 text-[11px] mt-0.5">Some infrastructure and routing services are operating on simulated coordinates due to local boundary rate limits or default fallback settings.</p>
          </div>
        </div>
      )}

      {/* Recommendation Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {data.recommendation_cards.map((card: RecCard) => (
          <div key={card.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-brand-400">{card.agent}</span>
                <div className="flex items-center gap-2">
                  {(card.impact.toLowerCase().includes('revised') || card.impact.toLowerCase().includes('memory') || card.evidence.some(e => e.toLowerCase().includes('road failure') || e.toLowerCase().includes('memory'))) && (
                    <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400 animate-pulse flex items-center gap-1">
                      🧠 Memory Override
                    </span>
                  )}
                  <span className="text-xs font-mono font-bold text-emerald-400">{card.confidence}% Match</span>
                </div>
              </div>
              <h4 className="text-sm font-bold text-slate-100">{card.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{card.impact}</p>

              
              <div className="border-t border-slate-800/80 pt-2 mt-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Supporting Evidence</span>
                <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5 mt-1">
                  {card.evidence.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-850 pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Source: {card.source_attribution}</span>
              <span className={`px-1.5 py-0.2 rounded border font-semibold ${
                card.grounding === 'live' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 'border-amber-500/20 text-amber-500 bg-amber-500/5'
              }`}>
                {card.grounding === 'live' ? 'Grounded (Live)' : 'Simulated'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Related Memories */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Relevant CockroachDB Memory Context</h4>
        <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
          {data.related_memories.map((mem: string, idx: number) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-brand-400 font-bold">›</span>
              <span>{mem}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
