'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// ── API Reference Data ─────────────────────────────────────────────────────

interface Endpoint {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  auth: boolean;
  roles?: string[];
  requestBody?: Record<string, any>;
  responseExample?: Record<string, any>;
  tags?: string[];
}

const ENDPOINTS: Endpoint[] = [
  // Auth
  {
    method: 'POST', path: '/api/v1/auth/login', summary: 'Authenticate user',
    description: 'Returns a signed JWT access token on valid credentials. Token is valid for 60 minutes.',
    auth: false, tags: ['Authentication'],
    requestBody: { email: 'admin@reliefgrid.gov', password: 'AdminPassword123!' },
    responseExample: { access_token: 'eyJhbGci...', token_type: 'bearer' },
  },
  {
    method: 'POST', path: '/api/v1/auth/register', summary: 'Register new user',
    description: 'Creates a new user account within an organization. Requires ADMIN role.',
    auth: true, roles: ['ADMIN'], tags: ['Authentication'],
    requestBody: { email: 'responder@nema.gov', password: 'SecurePass!', full_name: 'Field Responder', organization_id: 'uuid' },
  },

  // Incidents
  {
    method: 'POST', path: '/api/v1/incidents/', summary: 'Create incident',
    description: 'Creates a new emergency incident record and begins the AI triage pipeline.',
    auth: true, tags: ['Incident Management'],
    requestBody: {
      title: 'Lekki Flash Flood', description: 'Severe coastal flooding in Lekki Phase 1.',
      severity: 'CRITICAL', latitude: 6.4698, longitude: 3.5852, affected_population: 14000,
    },
    responseExample: { id: 'uuid', status: 'REPORTED', severity: 'CRITICAL', created_at: '...' },
  },
  {
    method: 'GET', path: '/api/v1/incidents/', summary: 'List incidents',
    description: 'Returns paginated list of incidents. Supports filtering by severity, status, and free-text search.',
    auth: true, tags: ['Incident Management'],
    responseExample: { total: 5, items: [{ id: 'uuid', title: 'Lekki Flash Flood', severity: 'CRITICAL', status: 'ACTIVE' }] },
  },
  {
    method: 'POST', path: '/api/v1/incidents/{id}/analyze', summary: 'Trigger AI orchestration',
    description: 'Triggers the full multi-agent pipeline: CoordinatorAgent decomposes the task, then 6 specialist agents execute concurrently (Weather, Medical, Shelter, Logistics, Infrastructure, Communication). All findings are persisted to CockroachDB and the collective memory store.',
    auth: true, roles: ['ADMIN', 'COORDINATOR'], tags: ['AI Orchestration'],
    responseExample: {
      plan_id: 'uuid', plan_summary: 'Master incident plan...', agents_executed: 6,
      data_sources: { weather: 'Open-Meteo Satellite Feed', hospitals: 'live', routing: 'OSRM' },
    },
  },
  {
    method: 'GET', path: '/api/v1/incidents/{id}/agent-timeline', summary: 'Agent execution timeline',
    description: 'Returns all task plans, agent assignments, and memory entries associated with this incident.',
    auth: true, tags: ['AI Orchestration'],
  },
  {
    method: 'PATCH', path: '/api/v1/incidents/{id}', summary: 'Update incident',
    description: 'Updates incident fields (status, severity, description, affected population).',
    auth: true, tags: ['Incident Management'],
  },

  // Memory
  {
    method: 'POST', path: '/api/v1/memories/search', summary: 'Semantic memory search',
    description: 'Runs a 1024-dimensional cosine similarity search over the collective memory vector store in CockroachDB. Returns ranked results with similarity scores. Supports DECISION_RECORD, LESSON_LEARNED, ACTION_PLAN, SPECIALIST_FINDINGS, SITUATION_REPORT, WEATHER_OBSERVATION, FIELD_UPDATE memory types.',
    auth: true, tags: ['Memory Engine'],
    requestBody: { query: 'shelter access road flooded Lagos', limit: 10 },
    responseExample: [{ id: 'uuid', memory_type: 'DECISION_RECORD', content: '...', similarity_score: 0.9241 }],
  },

  // Analytics
  {
    method: 'GET', path: '/api/v1/analytics/incidents/{id}/recommendations', summary: 'AI recommendations',
    description: 'Returns structured recommendation cards with confidence scores, supporting evidence, and data source attribution for a specific incident.',
    auth: true, tags: ['Analytics'],
  },
  {
    method: 'GET', path: '/api/v1/analytics/executive-summary', summary: 'Executive summary',
    description: 'Returns live database-driven metrics: active incidents, agent performance, memory store stats, AI confidence averages, and 7-day incident trend.',
    auth: true, tags: ['Analytics'],
  },
  {
    method: 'GET', path: '/api/v1/analytics/incidents/{id}/export-report', summary: 'Export after-action report',
    description: 'Downloads a formatted After-Action Report (AAR) as a text file with full agent findings and decision audit trail.',
    auth: true, tags: ['Analytics'],
  },

  // Telemetry
  {
    method: 'GET', path: '/api/v1/telemetry/audit-logs', summary: 'Audit logs',
    description: 'Returns structured audit log entries for all critical platform actions.',
    auth: true, roles: ['ADMIN'], tags: ['Telemetry'],
  },
  {
    method: 'GET', path: '/api/v1/telemetry/agent-metrics', summary: 'Agent performance metrics',
    description: 'Returns real-time agent execution statistics: success rates, task counts, average latency.',
    auth: true, tags: ['Telemetry'],
  },
  {
    method: 'POST', path: '/api/v1/telemetry/watchdog/health-check', summary: 'Run watchdog scan',
    description: 'Triggers the AgentWatchdog self-healing scan. Detects stalled agent assignments (>120s IN_PROGRESS) and auto-recovers them to SUCCESS state without data loss.',
    auth: true, roles: ['ADMIN'], tags: ['Telemetry'],
    responseExample: { status: 'healthy', recovered_count: 1, healed_ids: ['uuid'], scanned_at: '...' },
  },
  {
    method: 'GET', path: '/api/v1/health', summary: 'Health check',
    description: 'Public endpoint. Returns platform health status and service availability.',
    auth: false, tags: ['System'],
    responseExample: { status: 'healthy', services: { database: 'ok', bedrock: 'ok', gis: 'ok' } },
  },
];

const ALL_TAGS = ['All', 'Authentication', 'Incident Management', 'AI Orchestration', 'Memory Engine', 'Analytics', 'Telemetry', 'System'];

const METHOD_STYLES: Record<string, string> = {
  GET: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400',
  POST: 'bg-brand-500/10 border-brand-500/40 text-brand-400',
  PATCH: 'bg-amber-500/10 border-amber-500/40 text-amber-400',
  DELETE: 'bg-red-500/10 border-red-500/40 text-red-400',
};

function EndpointCard({ ep }: { ep: Endpoint }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-2xl border transition-all ${open ? 'border-slate-700 bg-slate-900' : 'border-slate-800/60 bg-slate-900/40 hover:border-slate-700'}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
      >
        <span className={`shrink-0 rounded-md border px-2.5 py-0.5 text-[11px] font-black tracking-widest uppercase w-16 text-center ${METHOD_STYLES[ep.method]}`}>
          {ep.method}
        </span>
        <code className="flex-1 text-sm font-mono text-slate-200">{ep.path}</code>
        <span className="text-xs text-slate-400 hidden sm:block">{ep.summary}</span>
        {ep.auth && (
          <span className="shrink-0 text-[10px] text-slate-500 border border-slate-700 rounded px-1.5 py-0.5">🔒 Auth</span>
        )}
        <span className={`shrink-0 text-slate-500 text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-slate-800 space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed pt-4">{ep.description}</p>

          {ep.roles && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Required roles:</span>
              {ep.roles.map(r => (
                <span key={r} className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-bold text-slate-300">{r}</span>
              ))}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {ep.requestBody && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Request Body</p>
                <pre className="rounded-xl bg-slate-950 border border-slate-800 p-4 text-[11px] font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(ep.requestBody, null, 2)}
                </pre>
              </div>
            )}
            {ep.responseExample && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Response Example</p>
                <pre className="rounded-xl bg-slate-950 border border-slate-800 p-4 text-[11px] font-mono text-brand-300 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(ep.responseExample, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApiDocsPage() {
  const router = useRouter();
  const [activeTag, setActiveTag] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = ENDPOINTS.filter(ep => {
    const matchTag = activeTag === 'All' || ep.tags?.includes(activeTag);
    const matchSearch = !search || ep.path.toLowerCase().includes(search.toLowerCase()) || ep.summary.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  const grouped = ALL_TAGS.filter(t => t !== 'All').reduce<Record<string, Endpoint[]>>((acc, tag) => {
    const eps = filtered.filter(ep => ep.tags?.includes(tag));
    if (eps.length) acc[tag] = eps;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-body">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/incidents')} className="text-slate-500 hover:text-slate-300 text-xs font-semibold">
              ← Dashboard
            </button>
            <span className="text-slate-700">|</span>
            <div>
              <h1 className="text-sm font-black text-slate-100 tracking-tight">ReliefGrid API Reference</h1>
              <p className="text-[10px] text-slate-500">v1.0.0 · REST · JSON · Bearer Auth</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-400 font-semibold">API Online</span>
            <a
              href="http://localhost:8000/api/v1/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs rounded-lg border border-slate-700 px-3 py-1.5 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
            >
              Swagger UI ↗
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 flex gap-8">
        {/* ── Sidebar nav ─────────────────────────────────────── */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-24 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-3">Sections</p>
            {ALL_TAGS.filter(t => t !== 'All').map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTag === tag
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────── */}
        <main className="flex-1 min-w-0 space-y-10">
          {/* Search + overview */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-100 mb-2">API Reference</h2>
              <p className="text-sm text-slate-400 max-w-2xl">
                All endpoints use <code className="text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded text-xs">Bearer</code> JWT authentication.
                Responses follow a consistent envelope: <code className="text-slate-300 text-xs">{'{ success, data | error }'}</code>.
                Errors include structured codes (AUTH-001, WX-401, etc.) and recovery metadata.
              </p>
            </div>

            {/* Base URL */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base URL</span>
              <code className="text-brand-300 text-sm font-mono">http://localhost:8000</code>
              <span className="text-slate-700">·</span>
              <span className="text-[10px] text-slate-500">All endpoints prefixed with <code className="text-slate-400">/api/v1</code></span>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Filter endpoints..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none transition-all"
            />

            {/* Mobile tag filter */}
            <div className="flex flex-wrap gap-2 lg:hidden">
              {ALL_TAGS.map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTag(t)}
                  className={`rounded-full border px-3 py-1 text-[11px] font-bold transition-all ${
                    activeTag === t ? 'border-brand-500 bg-brand-500/10 text-brand-400' : 'border-slate-700 text-slate-500'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Endpoint groups */}
          {Object.entries(grouped).map(([tag, eps]) => (
            <section key={tag} className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">{tag}</h3>
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-[10px] text-slate-600">{eps.length} endpoint{eps.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="space-y-2">
                {eps.map((ep, i) => <EndpointCard key={i} ep={ep} />)}
              </div>
            </section>
          ))}

          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-500">
              No endpoints match your filter.
            </div>
          )}

          {/* Error codes reference */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">Error Code Registry</h3>
              <div className="flex-1 h-px bg-slate-800" />
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-left">
                    <th className="px-5 py-3 text-slate-500 font-bold uppercase tracking-wider">Code</th>
                    <th className="px-5 py-3 text-slate-500 font-bold uppercase tracking-wider">Meaning</th>
                    <th className="px-5 py-3 text-slate-500 font-bold uppercase tracking-wider">HTTP</th>
                    <th className="px-5 py-3 text-slate-500 font-bold uppercase tracking-wider">Recoverable</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { code: 'AUTH-001', meaning: 'Invalid credentials', http: '401', recoverable: 'No' },
                    { code: 'AUTH-002', meaning: 'Token expired', http: '401', recoverable: 'Yes — re-login' },
                    { code: 'AUTHZ-001', meaning: 'Permission denied', http: '403', recoverable: 'No' },
                    { code: 'VAL-001', meaning: 'Invalid request payload', http: '422', recoverable: 'Yes' },
                    { code: 'AGENT-101', meaning: 'Agent timeout', http: '503', recoverable: 'Yes — retry ×2' },
                    { code: 'MEM-201', meaning: 'Embedding generation failed', http: '503', recoverable: 'Yes — fallback' },
                    { code: 'GIS-301', meaning: 'Invalid coordinates', http: '422', recoverable: 'Yes' },
                    { code: 'GIS-302', meaning: 'Route calculation failed', http: '503', recoverable: 'Yes — fallback' },
                    { code: 'WX-401', meaning: 'Weather API unavailable', http: '503', recoverable: 'Yes — cached' },
                    { code: 'AI-601', meaning: 'Bedrock timeout', http: '503', recoverable: 'Yes — retry ×3' },
                    { code: 'DB-501', meaning: 'CockroachDB transaction conflict', http: '503', recoverable: 'Yes — retry ×5' },
                    { code: 'DB-502', meaning: 'Record not found', http: '404', recoverable: 'No' },
                    { code: 'SYS-999', meaning: 'Unexpected platform error', http: '500', recoverable: 'No — escalated' },
                  ].map(row => (
                    <tr key={row.code} className="border-t border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-3 text-brand-400 font-bold">{row.code}</td>
                      <td className="px-5 py-3 text-slate-300">{row.meaning}</td>
                      <td className="px-5 py-3 text-slate-400">{row.http}</td>
                      <td className={`px-5 py-3 font-semibold ${row.recoverable.startsWith('Yes') ? 'text-emerald-400' : 'text-red-400'}`}>{row.recoverable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
