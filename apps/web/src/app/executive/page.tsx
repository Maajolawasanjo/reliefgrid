'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { analyticsApi, ApiError } from '@/lib/api';
import { AppShell } from '@/components/layout/app-shell';
import { Icon } from '@/components/ui/icons';

interface AgentMetrics {
  total_task_plans: number;
  total_assignments: number;
  successful_assignments: number;
  failed_assignments: number;
  agent_success_rate: number;
  per_agent_breakdown: Record<string, { total: number; success: number; failed: number }>;
}

interface MemoryMetrics {
  total_memories: number;
  total_vector_embeddings: number;
  action_plans_stored: number;
  specialist_findings_stored: number;
}

interface ResponseMetrics {
  avg_ai_confidence: number;
  avg_agent_execution_ms: number;
  agent_success_rate: number;
  memory_vectors_count: number;
}

interface TrendEntry { date: string; count: number; }

interface ExecSummary {
  active_incidents_count: number;
  total_incidents: number;
  resolved_incidents: number;
  critical_incidents: number;
  high_incidents: number;
  total_affected_population: number;
  incident_trend_7d: TrendEntry[];
  agent_status: Record<string, string>;
  agent_metrics: AgentMetrics;
  memory_metrics: MemoryMetrics;
  response_metrics: ResponseMetrics;
}

const AGENT_STATUS_COLORS: Record<string, string> = {
  OPERATIONAL: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  DEGRADED: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  IMPAIRED: 'bg-red-500/10 border-red-500/30 text-red-400',
  STANDBY: 'bg-slate-700/30 border-slate-700 text-slate-400',
};

function StatCard({
  label,
  value,
  sub,
  color = 'text-brand-400',
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  icon?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
        {icon && <Icon name={icon as any} size={16} className="text-slate-600" />}
      </div>
      <div className={`text-4xl font-extrabold ${color}`}>{value}</div>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function MiniBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] font-mono text-slate-400">
        <span>{label}</span>
        <span>{value} <span className="text-slate-600">/ {max}</span></span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-800">
        <div
          className="h-1.5 rounded-full bg-brand-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function TrendChart({ data }: { data: TrendEntry[] }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-2 h-24">
      {data.map((d) => {
        const h = max > 0 ? Math.max(4, Math.round((d.count / max) * 96)) : 4;
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t-sm bg-brand-500/60 hover:bg-brand-500 transition-colors"
              style={{ height: `${h}px` }}
              title={`${d.date}: ${d.count} incident(s)`}
            />
            <span className="text-[9px] text-slate-600 font-mono">
              {d.date.slice(5)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function ExecutiveDashboardPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<ExecSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchSummary = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyticsApi.executiveSummary();
      setData(result.data as ExecSummary);
      setLastRefresh(new Date());
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load executive summary.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (token) {
      fetchSummary();
    }
  }, [user, isLoading, token]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        Authenticating executive context...
      </div>
    );
  }

  const actions = (
    <div className="flex items-center gap-3">
      {lastRefresh && (
        <span className="text-[10px] font-mono text-slate-500">
          Updated {lastRefresh.toLocaleTimeString()}
        </span>
      )}
      <button
        onClick={fetchSummary}
        disabled={loading}
        className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-50 flex items-center gap-1.5"
      >
        <Icon name="telemetry" size={13} />
        Refresh
      </button>
    </div>
  );

  return (
    <AppShell
      title="Executive Command Dashboard"
      subtitle="Live readiness indicators, agent health, and incident trend analytics"
      actions={actions}
    >
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 font-mono">
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="flex items-center justify-center py-24 text-slate-500 gap-3">
          <span className="h-5 w-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          Loading live platform metrics...
        </div>
      )}

      {data && (
        <div className="space-y-8">

          {/* ── KPI Row ────────────────────────────────────────────────── */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Active Incidents"
              value={data.active_incidents_count}
              sub={`${data.critical_incidents} Critical · ${data.high_incidents} High`}
              color="text-red-400"
              icon="incident"
            />
            <StatCard
              label="Total Affected"
              value={data.total_affected_population.toLocaleString()}
              sub={`${data.resolved_incidents} incidents resolved`}
              color="text-amber-400"
              icon="alert"
            />
            <StatCard
              label="Avg AI Confidence"
              value={data.response_metrics.avg_ai_confidence > 0 ? `${data.response_metrics.avg_ai_confidence}%` : 'N/A'}
              sub={`${data.response_metrics.avg_agent_execution_ms}ms avg agent latency`}
              color="text-brand-400"
              icon="analytics"
            />
            <StatCard
              label="Vector Memories"
              value={data.memory_metrics.total_vector_embeddings}
              sub={`${data.memory_metrics.total_memories} total memory records`}
              color="text-cyan-400"
              icon="memory"
            />
          </div>

          {/* ── 7-Day Incident Trend ─────────────────────────────────── */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-5">
              7-Day Incident Volume Trend
            </h3>
            <TrendChart data={data.incident_trend_7d} />
          </div>

          {/* ── Agent Status Matrix + Memory Breakdown ───────────────── */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Agent status */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
                Autonomous Multi-Agent Status Matrix
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(data.agent_status).map(([agent, stat]) => (
                  <div
                    key={agent}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-200">{agent}</span>
                      {data.agent_metrics.per_agent_breakdown[agent] && (
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {data.agent_metrics.per_agent_breakdown[agent].success}/
                          {data.agent_metrics.per_agent_breakdown[agent].total} tasks
                        </p>
                      )}
                    </div>
                    <span
                      className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${
                        AGENT_STATUS_COLORS[stat] ?? AGENT_STATUS_COLORS.STANDBY
                      }`}
                    >
                      {stat}
                    </span>
                  </div>
                ))}
              </div>

              {/* Overall success rate bar */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold">Overall Agent Success Rate</span>
                  <span className="font-bold text-emerald-400">
                    {data.agent_metrics.agent_success_rate}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${data.agent_metrics.agent_success_rate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Memory & AI breakdown */}
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
                  Collective Memory Store
                </h3>
                <div className="space-y-4">
                  <MiniBar
                    label="Total Memory Records"
                    value={data.memory_metrics.total_memories}
                    max={Math.max(data.memory_metrics.total_memories, 1)}
                  />
                  <MiniBar
                    label="Action Plans Stored"
                    value={data.memory_metrics.action_plans_stored}
                    max={data.memory_metrics.total_memories}
                  />
                  <MiniBar
                    label="Specialist Findings"
                    value={data.memory_metrics.specialist_findings_stored}
                    max={data.memory_metrics.total_memories}
                  />
                  <MiniBar
                    label="Vector Embeddings (1024-dim)"
                    value={data.memory_metrics.total_vector_embeddings}
                    max={Math.max(data.memory_metrics.total_memories, 1)}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
                  Orchestration Pipeline
                </h3>
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  {[
                    { label: 'Task Plans', value: data.agent_metrics.total_task_plans, color: 'text-brand-400' },
                    { label: 'Assignments', value: data.agent_metrics.total_assignments, color: 'text-slate-200' },
                    { label: 'Successful', value: data.agent_metrics.successful_assignments, color: 'text-emerald-400' },
                    { label: 'Failed', value: data.agent_metrics.failed_assignments, color: 'text-red-400' },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <span className="text-slate-500 text-[10px] uppercase">{m.label}</span>
                      <div className={`text-2xl font-extrabold ${m.color} mt-1`}>{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </AppShell>
  );
}
