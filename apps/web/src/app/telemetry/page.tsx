'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { env } from '@/lib/config';

import { Icon } from '@/components/ui/icons';
import { FullLogo } from '@/components/ui/logo';

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_name: string;
  entity_id: string;
  timestamp: string;
}

interface AgentMetrics {
  total_task_plans: number;
  total_agent_assignments: number;
  successful_assignments: number;
  failed_assignments: number;
  success_rate_percent: number;
  avg_execution_latency_ms: number;
}

export default function TelemetryPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [metrics, setMetrics] = useState<AgentMetrics | null>(null);
  const [watchdogStatus, setWatchdogStatus] = useState<string>('Standby');
  const [loading, setLoading] = useState(true);

  const fetchTelemetryData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [logsRes, metricsRes] = await Promise.all([
        fetch(`${env.apiUrl}/telemetry/audit-logs`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${env.apiUrl}/telemetry/agent-metrics`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (logsRes.ok) setAuditLogs(await logsRes.json());
      if (metricsRes.ok) setMetrics(await metricsRes.json());
    } catch (err) {
      console.error('Failed to load telemetry data', err);
    } finally {
      setLoading(false);
    }
  };

  const runWatchdogCheck = async () => {
    if (!token) return;
    setWatchdogStatus('Scanning CockroachDB checkpoints...');
    try {
      const res = await fetch(`${env.apiUrl}/telemetry/watchdog/health-check`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWatchdogStatus(`Completed: ${data.recovered_count} agents healed.`);
        fetchTelemetryData();
      }
    } catch (err) {
      setWatchdogStatus('Watchdog execution error');
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (token) {
      fetchTelemetryData();
    }
  }, [user, isLoading, token]);

  if (isLoading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-slate-400">Authenticating operations context...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <header className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <FullLogo iconSize="h-12 w-12" textClass="text-2xl" subtitle={false} />
          <div className="h-8 w-[1px] bg-slate-800" />
          <div>
            <h1 className="text-lg font-bold text-slate-200">System Telemetry & Operations Panel</h1>
            <p className="text-xs text-slate-500">Real-time agent health monitoring, self-healing status, and audit logs</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={runWatchdogCheck}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-all shadow-md flex items-center gap-1.5"
          >
            <Icon name="telemetry" size={14} /> Run Watchdog Self-Healing Scan
          </button>
          <button
            onClick={() => router.push('/')}
            className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
          >
            ← Return to Dashboard
          </button>
        </div>
      </header>

      {watchdogStatus !== 'Standby' && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400 font-mono">
          [AGENT WATCHDOG PROBE]: {watchdogStatus}
        </div>
      )}

      {metrics && (
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <span className="text-xs font-semibold uppercase text-slate-400">Active Task Plans</span>
            <div className="text-3xl font-extrabold text-brand-400 mt-2">{metrics.total_task_plans}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <span className="text-xs font-semibold uppercase text-slate-400">Dispatched Tasks</span>
            <div className="text-3xl font-extrabold text-slate-100 mt-2">{metrics.total_agent_assignments}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <span className="text-xs font-semibold uppercase text-slate-400">Agent Success Rate</span>
            <div className="text-3xl font-extrabold text-emerald-400 mt-2">{metrics.success_rate_percent}%</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <span className="text-xs font-semibold uppercase text-slate-400">Avg Reasoning Latency</span>
            <div className="text-3xl font-extrabold text-amber-400 mt-2">{metrics.avg_execution_latency_ms}ms</div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-100 mb-4">Platform Operational Audit Feed</h3>
        {loading ? (
          <div className="text-slate-500 py-8 text-center">Fetching centralized audit stream...</div>
        ) : (
          <div className="divide-y divide-slate-800 font-mono text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200">{log.action}</span>
                  <span className="text-slate-400 ml-3">Target: {log.entity_name} ({log.entity_id || 'N/A'})</span>
                </div>
                <span className="text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
